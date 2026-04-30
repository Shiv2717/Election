import React, { useMemo } from 'react';
import { ChevronDown, Languages } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'as', label: 'Assamese' },
  { code: 'bn', label: 'Bengali' },
  { code: 'brx', label: 'Bodo' },
  { code: 'doi', label: 'Dogri' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'hi', label: 'Hindi' },
  { code: 'kn', label: 'Kannada' },
  { code: 'ks', label: 'Kashmiri' },
  { code: 'kok', label: 'Konkani' },
  { code: 'mai', label: 'Maithili' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'mni-Mtei', label: 'Meitei (Manipuri)' },
  { code: 'mr', label: 'Marathi' },
  { code: 'ne', label: 'Nepali' },
  { code: 'or', label: 'Odia' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'sa', label: 'Sanskrit' },
  { code: 'sat', label: 'Santali' },
  { code: 'sd', label: 'Sindhi' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'ur', label: 'Urdu' },
];

const getNativeLabel = (code, label) => {
  try {
    const displayLocale = code === 'mni-Mtei' ? 'mni' : code;
    const displayNames = new Intl.DisplayNames([displayLocale], { type: 'language' });
    const nativeLabel = displayNames.of(code);
    if (nativeLabel && nativeLabel !== label) {
      return `${label} · ${nativeLabel}`;
    }
  } catch {
    // Fall back to the English label if the runtime does not support the locale.
  }

  return label;
};

const LanguageSwitcher = ({ selectedLanguage, onLanguageChange }) => {
  const languageValue = selectedLanguage || 'en';

  const languageOptions = useMemo(() => {
    return languages.map((language) => ({
      ...language,
      displayLabel: getNativeLabel(language.code, language.label),
    }));
  }, []);

  return (
    <div className="language-switcher notranslate" translate="no" data-no-translate="true" role="group" aria-label="Website language selector">
      <span className="language-switcher-label">
        <Languages size={16} />
        Website Language
      </span>
      <div className="language-select-shell">
        <select
          className="language-select"
          value={languageValue}
          onChange={(event) => onLanguageChange?.(event.target.value)}
          aria-label="Select website language"
          translate="no"
        >
          {languageOptions.map((language) => (
            <option key={language.code} value={language.code}>
              {language.displayLabel}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="language-select-icon" aria-hidden="true" />
      </div>
    </div>
  );
};

export default LanguageSwitcher;