import { SalaryTable } from "@/components/salary-table";

export const metadata = {
  title: "Salaries - Compensation Intelligence",
  description: "Browse and filter standardized compensation data",
};

export default function SalariesPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Compensation Data</h1>
        <p className="text-muted-foreground mt-2">
          Browse our verified, standardized compensation data across top tech companies.
        </p>
      </div>
      <SalaryTable />
    </div>
  );
}
