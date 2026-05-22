import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db";
import { normalizeCompanyName } from "@/lib/normalization/company";
import { LevelChart } from "@/components/level-chart";

async function getCompanyData(company: string) {
  try {
    const normalizedCompany = normalizeCompanyName(company);

    const salaries = await prisma.salary.findMany({
      where: { normalized_company: normalizedCompany },
      orderBy: { total_compensation: "desc" },
    });

    if (!salaries.length) return null;

    const count = salaries.length;
    const totalCompArray = salaries.map((s) => s.total_compensation).sort((a, b) => a - b);
    
    const mid = Math.floor(count / 2);
    const medianComp = count % 2 !== 0 ? totalCompArray[mid] : (totalCompArray[mid - 1] + totalCompArray[mid]) / 2;
    const avgComp = totalCompArray.reduce((acc, val) => acc + val, 0) / count;

    const levelDistribution = salaries.reduce((acc, curr) => {
      acc[curr.level_standardized] = (acc[curr.level_standardized] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      data: salaries,
      analytics: {
        median_compensation: medianComp,
        average_compensation: avgComp,
        count,
        level_distribution: levelDistribution,
      },
    };
  } catch {
    return null;
  }
}

export default async function CompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  const decodedCompany = decodeURIComponent(company);
  
  const data = await getCompanyData(decodedCompany);

  if (!data && process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8 capitalize">{decodedCompany} Compensation</h1>
      
      {!data ? (
        <p className="text-muted-foreground">Could not load analytics data for this company at the moment. Try refreshing.</p>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Median Total Comp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">${(data.analytics.median_compensation / 1000).toFixed(0)}k</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Total Comp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${(data.analytics.average_compensation / 1000).toFixed(0)}k</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Data Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{data.analytics.count}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Level Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(data.analytics.level_distribution).map(([level, count]: [string, number]) => (
                  <div key={level} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <span className="font-medium bg-secondary px-2 py-1 rounded-md">{level}</span>
                    <span className="text-muted-foreground">{count} entries</span>
                  </div>
                ))}
              </div>
              <LevelChart data={data.analytics.level_distribution} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
