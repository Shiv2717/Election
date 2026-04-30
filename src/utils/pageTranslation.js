const TRANSLATION_ENDPOINT = 'https://translate.googleapis.com/translate_a/single';
const TRANSLATABLE_ATTRIBUTES = ['aria-label', 'title', 'placeholder', 'alt'];
const EXCLUDED_SELECTOR = '[data-no-translate="true"], [translate="no"], script, style, noscript, textarea, input, select, option';
const BATCH_SIZE = 8;

const translationCache = new Map();
const originalTextCache = new WeakMap();
const originalAttributeCache = new WeakMap();

let translationObserver = null;
let translationDebounceTimer = null;
let activeRoot = null;
let activeLanguage = 'en';
let activeTranslationRun = 0;
let translationInProgress = false;

const splitText = (text) => {
  const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/);

  if (!match) {
    return ['', text, ''];
  }

  return [match[1], match[2], match[3]];
};

const shouldSkipElement = (element) => {
  return Boolean(element.closest(EXCLUDED_SELECTOR));
};

const extractTranslatedText = (payload, fallbackText) => {
  if (Array.isArray(payload?.[0])) {
    const translatedText = payload[0].map((segment) => segment?.[0] ?? '').join('');
    return translatedText || fallbackText;
  }

  return fallbackText;
};

const translatePhrase = async (phrase, targetLanguage) => {
  if (targetLanguage === 'en' || !phrase.trim()) {
    return phrase;
  }

  const cacheKey = `${targetLanguage}::${phrase}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const url = `${TRANSLATION_ENDPOINT}?client=gtx&sl=en&tl=${encodeURIComponent(targetLanguage)}&dt=t&q=${encodeURIComponent(phrase)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Translation request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const translatedText = extractTranslatedText(payload, phrase);
  translationCache.set(cacheKey, translatedText);
  return translatedText;
};

const getOriginalAttributeMap = (element) => {
  let attributeMap = originalAttributeCache.get(element);

  if (!attributeMap) {
    attributeMap = new Map();
    originalAttributeCache.set(element, attributeMap);
  }

  return attributeMap;
};

const collectTranslatableNodes = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodesByText = new Map();

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parentElement = node.parentElement;
    const sourceText = node.nodeValue ?? '';

    if (!parentElement || shouldSkipElement(parentElement) || !sourceText.trim()) {
      continue;
    }

    if (!originalTextCache.has(node)) {
      originalTextCache.set(node, sourceText);
    }

    const originalSourceText = originalTextCache.get(node) ?? sourceText;
    const [, coreText] = splitText(originalSourceText);

    if (!coreText.trim()) {
      continue;
    }

    if (!nodesByText.has(coreText)) {
      nodesByText.set(coreText, []);
    }

    nodesByText.get(coreText).push(node);
  }

  return nodesByText;
};

const translateAttributes = async (root, targetLanguage, runId) => {
  const elements = root.querySelectorAll(TRANSLATABLE_ATTRIBUTES.map((attribute) => `[${attribute}]`).join(','));

  for (const element of elements) {
    if (runId !== activeTranslationRun) {
      return;
    }

    if (shouldSkipElement(element)) {
      continue;
    }

    const attributeMap = getOriginalAttributeMap(element);

    for (const attributeName of TRANSLATABLE_ATTRIBUTES) {
      if (!element.hasAttribute(attributeName)) {
        continue;
      }

      const currentAttributeValue = element.getAttribute(attributeName) ?? '';

      if (!attributeMap.has(attributeName)) {
        attributeMap.set(attributeName, currentAttributeValue);
      }

      const sourceValue = attributeMap.get(attributeName) ?? currentAttributeValue;

      if (!sourceValue.trim()) {
        continue;
      }

      const [leadingWhitespace, coreText, trailingWhitespace] = splitText(sourceValue);

      try {
        const translatedCoreText = targetLanguage === 'en'
          ? coreText
          : await translatePhrase(coreText, targetLanguage);
        const nextValue = `${leadingWhitespace}${translatedCoreText}${trailingWhitespace}`;

        if (element.getAttribute(attributeName) !== nextValue) {
          element.setAttribute(attributeName, nextValue);
        }
      } catch {
        // Keep the original attribute value when translation is unavailable.
      }
    }
  }
};

export const translateRoot = async (root, targetLanguage) => {
  if (!root) {
    return;
  }

  activeRoot = root;
  activeLanguage = targetLanguage;
  const runId = ++activeTranslationRun;
  translationInProgress = true;

  try {
    const nodesByText = collectTranslatableNodes(root);
    const sourceTexts = [...nodesByText.keys()];
    const translationMap = new Map();

    for (const nodes of nodesByText.values()) {
      for (const node of nodes) {
        const originalText = originalTextCache.get(node) ?? node.nodeValue ?? '';
        if (node.nodeValue !== originalText) {
          node.nodeValue = originalText;
        }
      }
    }

    if (targetLanguage === 'en') {
      await translateAttributes(root, targetLanguage, runId);
      return;
    }

    for (let index = 0; index < sourceTexts.length; index += BATCH_SIZE) {
      const batch = sourceTexts.slice(index, index + BATCH_SIZE);

      await Promise.all(batch.map(async (sourceText) => {
        if (runId !== activeTranslationRun) {
          return;
        }

        try {
          const translatedText = await translatePhrase(sourceText, targetLanguage);
          translationMap.set(sourceText, translatedText);
        } catch {
          translationMap.set(sourceText, sourceText);
        }
      }));
    }

    if (runId !== activeTranslationRun) {
      return;
    }

    for (const [sourceText, nodes] of nodesByText.entries()) {
      const translatedText = translationMap.get(sourceText) ?? sourceText;

      for (const node of nodes) {
        const originalText = originalTextCache.get(node) ?? node.nodeValue ?? '';
        const [leadingWhitespace, originalCoreText, trailingWhitespace] = splitText(originalText);
        const nextValue = targetLanguage === 'en'
          ? originalText
          : `${leadingWhitespace}${translatedText || originalCoreText}${trailingWhitespace}`;

        if (node.nodeValue !== nextValue) {
          node.nodeValue = nextValue;
        }
      }
    }

    await translateAttributes(root, targetLanguage, runId);
  } finally {
    if (runId === activeTranslationRun) {
      translationInProgress = false;
    }
  }
};

const clearObserver = () => {
  if (translationObserver) {
    translationObserver.disconnect();
    translationObserver = null;
  }

  if (translationDebounceTimer) {
    window.clearTimeout(translationDebounceTimer);
    translationDebounceTimer = null;
  }
};

export const watchTranslatedRoot = (root, targetLanguage) => {
  clearObserver();

  activeRoot = root;
  activeLanguage = targetLanguage;

  if (!root || targetLanguage === 'en') {
    return clearObserver;
  }

  translationObserver = new MutationObserver(() => {
    if (translationInProgress || activeLanguage === 'en') {
      return;
    }

    if (translationDebounceTimer) {
      window.clearTimeout(translationDebounceTimer);
    }

    translationDebounceTimer = window.setTimeout(() => {
      if (activeRoot) {
        translateRoot(activeRoot, activeLanguage).catch(() => {});
      }
    }, 160);
  });

  translationObserver.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return clearObserver;
};

export const getActiveLanguage = () => activeLanguage;