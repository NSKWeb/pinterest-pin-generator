export function calculateSpeed(
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

  return {
    kmPerHour: Math.round(kmPerHour * 100) / 100,
    milesPerHour: Math.round(milesPerHour * 100) / 100,
    metersPerSecond: Math.round(kmPerHour * 0.27778 * 100) / 100,
    formula: `${distance} ${unit} ÷ ${time} hours = ${speedPerHour.toFixed(2)} ${unit}/h`,
  };
}
