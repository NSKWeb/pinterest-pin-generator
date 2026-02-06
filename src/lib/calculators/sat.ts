export function calculateSATScore(mathScore: number, readingWritingScore: number) {
  if (mathScore < 200 || mathScore > 800) {
    throw new Error("Math score must be between 200 and 800");
  }

  if (readingWritingScore < 200 || readingWritingScore > 800) {
    throw new Error("Evidence-Based Reading & Writing score must be between 200 and 800");
  }

  const totalScore = mathScore + readingWritingScore;

  // Estimate percentile based on total score (approximate 2023 data)
  let percentile = 0;
  if (totalScore >= 1500) percentile = 98;
  else if (totalScore >= 1450) percentile = 95;
  else if (totalScore >= 1400) percentile = 91;
  else if (totalScore >= 1350) percentile = 85;
  else if (totalScore >= 1300) percentile = 78;
  else if (totalScore >= 1250) percentile = 68;
  else if (totalScore >= 1200) percentile = 57;
  else if (totalScore >= 1150) percentile = 46;
  else if (totalScore >= 1100) percentile = 35;
  else if (totalScore >= 1050) percentile = 26;
  else if (totalScore >= 1000) percentile = 19;
  else if (totalScore >= 950) percentile = 13;
  else if (totalScore >= 900) percentile = 9;
  else if (totalScore >= 850) percentile = 6;
  else if (totalScore >= 800) percentile = 4;
  else if (totalScore >= 750) percentile = 2;
  else percentile = 1;

  return {
    mathScore,
    readingWritingScore,
    totalScore,
    percentile,
    formula: `${mathScore} + ${readingWritingScore} = ${totalScore}`,
    // College readiness indicators
    isCollegeReady: totalScore >= 1200,
    isCompetitiveForSelective: totalScore >= 1400,
    isTopTier: totalScore >= 1500,
    needsImprovement: totalScore < 1000,
  };
}
