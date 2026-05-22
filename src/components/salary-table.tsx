"use client";

import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type Salary = {
  id: string;
  company: string;
  role: string;
  level_standardized: string;
  location: string;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
  total_compensation: number;
  confidence_score: number;
};

const columns: ColumnDef<Salary>[] = [
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0 hover:bg-transparent font-bold">
          Company {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </Button>
      )
    },
    cell: ({ row }) => {
      const company = row.original.company;
      return <Link href={`/company/${company}`} className="font-semibold text-blue-600 hover:underline">{company}</Link>;
    }
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "level_standardized",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0 hover:bg-transparent font-bold">
          Level {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium px-2 py-1 bg-secondary rounded-md text-center max-w-[60px]">{row.original.level_standardized}</div>
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "experience_years",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0 hover:bg-transparent font-bold">
          YOE {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </Button>
      )
    },
  },
  {
    accessorKey: "base_salary",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0 hover:bg-transparent font-bold">
          Base {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </Button>
      )
    },
    cell: ({ row }) => `$${(row.original.base_salary / 1000).toFixed(0)}k`
  },
  {
    accessorKey: "bonus",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0 hover:bg-transparent font-bold">
          Bonus {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </Button>
      )
    },
    cell: ({ row }) => `$${(row.original.bonus / 1000).toFixed(0)}k`
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0 hover:bg-transparent font-bold">
          Stock {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </Button>
      )
    },
    cell: ({ row }) => `$${(row.original.stock / 1000).toFixed(0)}k`
  },
  {
    accessorKey: "total_compensation",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="p-0 hover:bg-transparent font-bold">
          Total Comp {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : ""}
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-bold text-green-600">$${(row.original.total_compensation / 1000).toFixed(0)}k</div>
  },
];

export function SalaryTable() {
  const [data, setData] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [companyFilter, setCompanyFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  
  const [queryCompany, setQueryCompany] = useState("");
  const [queryRole, setQueryRole] = useState("");
  const [queryLevel, setQueryLevel] = useState("");
  const [queryLocation, setQueryLocation] = useState("");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        queryCompany !== companyFilter ||
        queryRole !== roleFilter ||
        queryLevel !== levelFilter ||
        queryLocation !== locationFilter
      ) {
        setQueryCompany(companyFilter);
        setQueryRole(roleFilter);
        setQueryLevel(levelFilter);
        setQueryLocation(locationFilter);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [companyFilter, roleFilter, levelFilter, locationFilter, queryCompany, queryRole, queryLevel, queryLocation]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = new URL("/api/salaries", window.location.origin);
        url.searchParams.set("page", page.toString());
        if (queryCompany) url.searchParams.set("company", queryCompany);
        if (queryRole) url.searchParams.set("role", queryRole);
        if (queryLevel) url.searchParams.set("level", queryLevel);
        if (queryLocation) url.searchParams.set("location", queryLocation);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch");
        
        const json = await res.json();
        setData(json.data);
        setTotalPages(json.meta.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, queryCompany, queryRole, queryLevel, queryLocation]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <Input 
          placeholder="Company..." 
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="flex-1"
        />
        <Input 
          placeholder="Role..." 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="flex-1"
        />
        <Input 
          placeholder="Level (e.g. L4)..." 
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="flex-1"
        />
        <Input 
          placeholder="Location..." 
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="flex-1"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col, j) => (
                    <TableCell key={j}><Skeleton className="h-6 w-[80px]" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </Button>
        <span className="text-sm font-medium">Page {page} of {totalPages}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages || loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
