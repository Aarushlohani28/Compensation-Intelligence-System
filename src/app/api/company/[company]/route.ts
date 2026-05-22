import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeCompanyName } from "@/lib/normalization/company";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ company: string }> }
) {
  try {
    const { company } = await params;
    const normalizedCompany = normalizeCompanyName(company);

    const salaries = await prisma.salary.findMany({
      where: { normalized_company: normalizedCompany },
      orderBy: { total_compensation: "desc" },
    });

    if (!salaries.length) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Analytics
    const count = salaries.length;
    const totalCompArray = salaries.map((s) => s.total_compensation).sort((a, b) => a - b);
    
    // Median
    const mid = Math.floor(count / 2);
    const medianComp = count % 2 !== 0 ? totalCompArray[mid] : (totalCompArray[mid - 1] + totalCompArray[mid]) / 2;

    // Average
    const avgComp = totalCompArray.reduce((acc, val) => acc + val, 0) / count;

    // Level distribution
    const levelDistribution = salaries.reduce((acc, curr) => {
      acc[curr.level_standardized] = (acc[curr.level_standardized] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      data: salaries,
      analytics: {
        median_compensation: medianComp,
        average_compensation: avgComp,
        count,
        level_distribution: levelDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
