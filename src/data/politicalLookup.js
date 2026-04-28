let politicalLookupPromise;

async function loadPoliticalLookup() {
  if (!politicalLookupPromise) {
    politicalLookupPromise = fetch('/data/pin-current-mp.json').then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to load political lookup data.');
      }

      return response.json();
    });
  }

  return politicalLookupPromise;
}

export async function getPoliticalInfoForPin(pinCode) {
  const lookup = await loadPoliticalLookup();
  return lookup[pinCode] ?? null;
}