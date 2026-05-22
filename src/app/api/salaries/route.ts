import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { SalaryQuerySchema } from "@/lib/validation/salary";

import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const parseResult = SalaryQuerySchema.safeParse(queryParams);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { page, limit, company, role, level, location } = parseResult.data;

    // Build the query where clause
    const where: Prisma.SalaryWhereInput = {};
    if (company) {
      where.normalized_company = { contains: company.toLowerCase() };
    }
    if (role) {
      where.role = { contains: role, mode: "insensitive" };
    }
    if (level) {
      where.level_standardized = level;
    }
    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    const skip = (page - 1) * limit;

    const [salaries, total] = await Promise.all([
      prisma.salary.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          total_compensation: "desc",
        },
      }),
      prisma.salary.count({ where }),
    ]);

    return NextResponse.json({
      data: salaries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching salaries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
