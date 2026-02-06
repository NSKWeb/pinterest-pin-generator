export function calculateOneRepMax(weight: number, reps: number, unit: "lbs" | "kg" = "lbs") {
  if (weight <= 0 || reps <= 0) {
    throw new Error("Weight and reps must be positive numbers");
  }

  if (reps > 12) {
    // Epley formula is most accurate for 1-12 reps
    console.warn("Epley formula is most accurate for 1-12 reps");
  }

  // Epley formula: 1RM = weight × (1 + reps / 30)
  const oneRepMax = weight * (1 + reps / 30);

  // Calculate training percentages
  const percentages = [50, 60, 70, 80, 85, 90, 95];
  const trainingWeights = percentages.map((pct) => ({
    percentage: pct,
    weight: Math.round((oneRepMax * pct / 100) * 10) / 10,
  }));

  return {
    oneRepMax: Math.round(oneRepMax * 10) / 10,
    unit,
    formula: `${weight} ${unit} × (1 + ${reps} / 30) = ${oneRepMax.toFixed(1)} ${unit}`,
    trainingWeights,
    // Training zone descriptions
    zones: {
      warmup: trainingWeights.slice(0, 2), // 50-60%
      hypertrophy: trainingWeights.slice(2, 4), // 70-80%
      strength: trainingWeights.slice(4, 6), // 85-90%
      power: trainingWeights.slice(6), // 95%+
    },
  };
}
