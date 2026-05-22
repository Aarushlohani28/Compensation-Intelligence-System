import { NextResponse } from "next/server";
import { SalaryIngestSchema } from "@/lib/validation/salary";
import { normalizeCompanyName } from "@/lib/normalization/company";
import { computeConfidenceScore } from "@/lib/analytics/confidence";
import { checkIsDuplicate } from "@/lib/analytics/duplicates";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate Input
    const parseResult = SalaryIngestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 2. Normalize company
    const normalizedCompany = normalizeCompanyName(data.company);

    // 3. Compute total compensation
    const totalCompensation = data.base_salary + data.bonus + data.stock;

    // 4. Detect duplicates
    const isDuplicate = await checkIsDuplicate(data, normalizedCompany, totalCompensation);
    if (isDuplicate) {
      return NextResponse.json(
        { error: "Duplicate entry detected" },
        { status: 409 }
      );
    }

    // 5. Compute confidence score
    const confidenceScore = computeConfidenceScore(data);

    // 6. Insert record
    const newSalary = await prisma.salary.create({
      data: {
        company: data.company,
        normalized_company: normalizedCompany,
        role: data.role,
        level_standardized: data.level_standardized,
        location: data.location,
        experience_years: data.experience_years,
        base_salary: data.base_salary,
        bonus: data.bonus,
        stock: data.stock,
        total_compensation: totalCompensation,
        confidence_score: confidenceScore,
      },
    });

    return NextResponse.json(
      { message: "Salary ingested successfully", data: newSalary },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error ingesting salary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
