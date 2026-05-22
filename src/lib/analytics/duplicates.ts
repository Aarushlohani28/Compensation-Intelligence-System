import prisma from "../db";
import { SalaryIngestInput } from "../validation/salary";

export async function checkIsDuplicate(
  data: SalaryIngestInput,
  normalizedCompany: string,
  totalCompensation: number
): Promise<boolean> {
  // Define the boundary for "close compensation" - e.g., within 5%
  const lowerBound = totalCompensation * 0.95;
  const upperBound = totalCompensation * 1.05;

  const potentialDuplicates = await prisma.salary.findFirst({
    where: {
      normalized_company: normalizedCompany,
      role: data.role,
      level_standardized: data.level_standardized,
      location: data.location,
      experience_years: data.experience_years,
      total_compensation: {
        gte: lowerBound,
        lte: upperBound,
      },
    },
  });

  return !!potentialDuplicates;
}
