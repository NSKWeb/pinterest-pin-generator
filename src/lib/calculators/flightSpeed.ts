export function calculateFlightSpeed(
  distance: number,
  time: number,
  unit: "miles" | "km" = "miles"
) {
  if (distance <= 0 || time <= 0) {
    throw new Error("Distance and time must be positive numbers");
  }

  // Calculate speed in the same unit as distance
  const speedPerHour = distance / time;

  // Convert to other units
  let kmPerHour: number;
  let milesPerHour: number;

  if (unit === "miles") {
    milesPerHour = speedPerHour;
    kmPerHour = speedPerHour * 1.60934;
  } else {
    kmPerHour = speedPerHour;
    milesPerHour = speedPerHour / 1.60934;
  }

  // Convert to knots (1 knot = 1.15078 mph)
  const knots = milesPerHour / 1.15078;

  return {
    kmPerHour: Math.round(kmPerHour * 100) / 100,
    milesPerHour: Math.round(milesPerHour * 100) / 100,
    knots: Math.round(knots * 100) / 100,
    metersPerSecond: Math.round(kmPerHour * 0.27778 * 100) / 100,
    formula: `${distance} ${unit} ÷ ${time} hours = ${speedPerHour.toFixed(2)} ${unit}/h`,
    // Aviation context
    isTypicalCommercialSpeed: knots >= 450 && knots <= 575,
    isTypicalPrivateSpeed: knots >= 200 && knots <= 400,
  };
}
