export function generateCoupleNames(name1: string, name2: string) {
  const cleanName1 = name1.trim().toLowerCase();
  const cleanName2 = name2.trim().toLowerCase();

  const variations: string[] = [];

  // 1. Syllable mixing
  const mid1 = Math.ceil(cleanName1.length / 2);
  const mid2 = Math.ceil(cleanName2.length / 2);

  const firstHalf1 = cleanName1.slice(0, mid1);
  const secondHalf2 = cleanName2.slice(mid2);
  const firstHalf2 = cleanName2.slice(0, mid2);
  const secondHalf1 = cleanName1.slice(mid1);

  variations.push(capitalize(firstHalf1 + secondHalf2));
  variations.push(capitalize(firstHalf2 + secondHalf1));

  // 2. Name blending (alternating letters)
  let blend1 = "";
  let blend2 = "";
  const maxLen = Math.max(cleanName1.length, cleanName2.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < cleanName1.length) blend1 += cleanName1[i];
    if (i < cleanName2.length) blend1 += cleanName2[i];
    if (i < cleanName2.length) blend2 += cleanName2[i];
    if (i < cleanName1.length) blend2 += cleanName1[i];
  }

  variations.push(capitalize(blend1));
  variations.push(capitalize(blend2));

  // 3. Prefix/suffix combinations
  const prefix1 = cleanName1.slice(0, 3);
  const prefix2 = cleanName2.slice(0, 3);
  const suffix1 = cleanName1.slice(-3);
  const suffix2 = cleanName2.slice(-3);

  variations.push(capitalize(prefix1 + suffix2));
  variations.push(capitalize(prefix2 + suffix1));

  // 4. Combined endings
  if (cleanName1.endsWith("a") && cleanName2.endsWith("a")) {
    variations.push(capitalize(cleanName1.slice(0, -1) + cleanName2.slice(0, -1) + "as"));
  } else if (cleanName1.endsWith("o") && cleanName2.endsWith("o")) {
    variations.push(capitalize(cleanName1.slice(0, -1) + cleanName2.slice(0, -1) + "os"));
  }

  // 5. Nickname styles
  if (cleanName1.length >= 4) {
    variations.push(capitalize(cleanName1.slice(0, -2) + "y"));
  }
  if (cleanName2.length >= 4) {
    variations.push(capitalize(cleanName2.slice(0, -2) + "y"));
  }

  // 6. Double letters for emphasis
  const doubleVowel1 = cleanName1.replace(/[aeiou]/g, "$&$&").slice(0, 12);
  const doubleVowel2 = cleanName2.replace(/[aeiou]/g, "$&$&").slice(0, 12);

  variations.push(capitalize(doubleVowel1 + doubleVowel2));

  // Remove duplicates and empty strings
  return [...new Set(variations.filter((v) => v.length > 2))].slice(0, 8);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
