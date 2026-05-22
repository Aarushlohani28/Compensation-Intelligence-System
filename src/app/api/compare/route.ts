import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id1 = searchParams.get("id1");
    const id2 = searchParams.get("id2");

    if (!id1 || !id2) {
      return NextResponse.json(
        { error: "Both id1 and id2 are required" },
        { status: 400 }
      );
    }

    const [salary1, salary2] = await Promise.all([
      prisma.salary.findUnique({ where: { id: id1 } }),
      prisma.salary.findUnique({ where: { id: id2 } }),
    ]);

    if (!salary1 || !salary2) {
      return NextResponse.json(
        { error: "One or both salaries not found" },
        { status: 404 }
      );
    }

    const diff = {
      base_diff: Math.abs(salary1.base_salary - salary2.base_salary),
      base_pct: salary2.base_salary ? ((salary1.base_salary - salary2.base_salary) / salary2.base_salary) * 100 : 0,
      
      bonus_diff: Math.abs(salary1.bonus - salary2.bonus),
      bonus_pct: salary2.bonus ? ((salary1.bonus - salary2.bonus) / salary2.bonus) * 100 : 0,
      
      stock_diff: Math.abs(salary1.stock - salary2.stock),
      stock_pct: salary2.stock ? ((salary1.stock - salary2.stock) / salary2.stock) * 100 : 0,
      
      total_diff: Math.abs(salary1.total_compensation - salary2.total_compensation),
      total_pct: salary2.total_compensation ? ((salary1.total_compensation - salary2.total_compensation) / salary2.total_compensation) * 100 : 0,
    };

    return NextResponse.json({
      salary1,
      salary2,
      comparison: {
        winner: salary1.total_compensation === salary2.total_compensation 
          ? "tie" 
          : salary1.total_compensation > salary2.total_compensation 
            ? "salary1" 
            : "salary2",
        differences: diff,
      },
    });
  } catch (error) {
    console.error("Error comparing salaries:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
