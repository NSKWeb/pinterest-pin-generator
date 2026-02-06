export function calculateAsphalt(
  length: number,
  width: number,
  thickness: number,
  pricePerCubicYard?: number
) {
  if (length <= 0 || width <= 0 || thickness <= 0) {
    throw new Error("All values must be positive numbers");
  }

  // Convert thickness from inches to feet
  const thicknessInFeet = thickness / 12;

  // Calculate volume in cubic feet
  const volumeCubicFeet = length * width * thicknessInFeet;

  // Convert to cubic yards (1 cubic yard = 27 cubic feet)
  const volumeCubicYards = volumeCubicFeet / 27;

  // Calculate cost if price is provided
  const cost = pricePerCubicYard ? volumeCubicYards * pricePerCubicYard : undefined;

  return {
    volumeCubicYards: Math.round(volumeCubicYards * 100) / 100,
    volumeCubicFeet: Math.round(volumeCubicFeet * 100) / 100,
    cost: cost ? Math.round(cost * 100) / 100 : undefined,
    formula: `${length} ft × ${width} ft × (${thickness} in ÷ 12) ÷ 27 = ${volumeCubicYards.toFixed(2)} cubic yards`,
  };
}
