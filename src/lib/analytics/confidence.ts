import { SalaryIngestInput, standardLevels } from "../validation/salary";

export function computeConfidenceScore(data: SalaryIngestInput): number {
  let score = 1.0;

  const totalComp = data.base_salary + data.bonus + data.stock;

  // Penalty for missing optional fields while claiming high total comp
  if (data.bonus === 0 && data.stock === 0 && totalComp > 150000) {
    score -= 0.1;
  }

  // Level vs Experience sanity checks
  const levelIndex = standardLevels.indexOf(data.level_standardized);
  if (levelIndex >= 0) {
    // L3 usually 0-3 years
    if (levelIndex === 0 && data.experience_years > 5) score -= 0.1;
    // L5 usually 5+ years
    if (levelIndex === 2 && data.experience_years < 3) score -= 0.2;
    // L6/L7 usually 8+ years
    if (levelIndex >= 3 && data.experience_years < 5) score -= 0.3;
  }

  // Compensation realism checks (Basic heuristics)
  if (data.base_salary > 0) {
    const baseRatio = data.base_salary / totalComp;
    // If base is less than 20% of total comp for lower levels, highly suspicious
    if (baseRatio < 0.2 && levelIndex < 3) {
      score -= 0.3;
    }
  }

  // Ensure score is within [0, 1] bounds
  return Math.max(0, Math.min(1, score));
}
