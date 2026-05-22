"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalaryItem {
  company: string;
  role: string;
  level_standardized: string;
  base_salary: number;
  bonus: number;
  stock: number;
  total_compensation: number;
}

interface CompareResponse {
  salary1: SalaryItem;
  salary2: SalaryItem;
  comparison: {
    winner: string;
    differences: {
      base_diff: number;
      base_pct: number;
      bonus_diff: number;
      bonus_pct: number;
      stock_diff: number;
      stock_pct: number;
      total_diff: number;
      total_pct: number;
    }
  }
}

function CompareContent() {
  const searchParams = useSearchParams();
  const paramId1 = searchParams.get("id1");
  const paramId2 = searchParams.get("id2");

  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompareResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const activeId1 = paramId1 || urlParams.get("id1") || "";
    const activeId2 = paramId2 || urlParams.get("id2") || "";

    if (activeId1) setId1(activeId1);
    if (activeId2) setId2(activeId2);

    if (activeId1 && activeId2) {
      handleCompare(activeId1, activeId2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId1, paramId2]);

  const handleCompare = async (overrideId1?: string, overrideId2?: string) => {
    const targetId1 = overrideId1 || id1;
    const targetId2 = overrideId2 || id2;
    if (!targetId1 || !targetId2) return;
    setLoading(true);
    setError("");
    try {
      const url = new URL("/api/compare", window.location.origin);
      url.searchParams.set("id1", targetId1);
      url.searchParams.set("id2", targetId2);
      
      const res = await fetch(url.toString());
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || "Failed to fetch comparison");
      setData(json);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Compare Salaries</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-sm font-medium mb-1 block">Salary ID 1</label>
          <Input 
            placeholder="Enter first salary ID..." 
            value={id1} 
            onChange={(e) => setId1(e.target.value)} 
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Salary ID 2</label>
          <Input 
            placeholder="Enter second salary ID..." 
            value={id2} 
            onChange={(e) => setId2(e.target.value)} 
          />
        </div>
      </div>
      
      <Button onClick={() => handleCompare()} disabled={loading || !id1 || !id2} className="w-full mb-8">
        {loading ? "Comparing..." : "Compare"}
      </Button>

      {error && <div className="text-red-500 font-medium mb-4">{error}</div>}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className={data.comparison.winner === "salary1" ? "border-green-500 border-2" : ""}>
            <CardHeader>
              <CardTitle>{data.salary1.company}</CardTitle>
              <p className="text-muted-foreground">{data.salary1.role} • {data.salary1.level_standardized}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Base Salary</span>
                <span className="font-semibold">${(data.salary1.base_salary / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between">
                <span>Bonus</span>
                <span className="font-semibold">${(data.salary1.bonus / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between">
                <span>Stock</span>
                <span className="font-semibold">${(data.salary1.stock / 1000).toFixed(0)}k</span>
              </div>
              <div className="pt-4 border-t flex justify-between font-bold text-lg">
                <span>Total Compensation</span>
                <span className="text-green-600">${(data.salary1.total_compensation / 1000).toFixed(0)}k</span>
              </div>
            </CardContent>
          </Card>

          <Card className={data.comparison.winner === "salary2" ? "border-green-500 border-2" : ""}>
            <CardHeader>
              <CardTitle>{data.salary2.company}</CardTitle>
              <p className="text-muted-foreground">{data.salary2.role} • {data.salary2.level_standardized}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Base Salary</span>
                <span className="font-semibold">${(data.salary2.base_salary / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between">
                <span>Bonus</span>
                <span className="font-semibold">${(data.salary2.bonus / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between">
                <span>Stock</span>
                <span className="font-semibold">${(data.salary2.stock / 1000).toFixed(0)}k</span>
              </div>
              <div className="pt-4 border-t flex justify-between font-bold text-lg">
                <span>Total Compensation</span>
                <span className="text-green-600">${(data.salary2.total_compensation / 1000).toFixed(0)}k</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="col-span-1 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Difference Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span>Base Diff</span>
                  <span>${(data.comparison.differences.base_diff / 1000).toFixed(1)}k ({data.comparison.differences.base_pct.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Bonus Diff</span>
                  <span>${(data.comparison.differences.bonus_diff / 1000).toFixed(1)}k ({data.comparison.differences.bonus_pct.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Stock Diff</span>
                  <span>${(data.comparison.differences.stock_diff / 1000).toFixed(1)}k ({data.comparison.differences.stock_pct.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between pt-2 font-bold">
                  <span>Total Diff</span>
                  <span>${(data.comparison.differences.total_diff / 1000).toFixed(1)}k ({data.comparison.differences.total_pct.toFixed(1)}%)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10 px-4 max-w-4xl"><h1 className="text-3xl font-bold mb-6">Compare Salaries</h1><p>Loading...</p></div>}>
      <CompareContent />
    </Suspense>
  );
}
