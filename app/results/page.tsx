"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ResultRow {
  id: number;
  name: string;
  question_paper: string;
  section_1_marks: number;
  section_2_marks: number;
  section_3_marks: number;
  total_marks: number;
  created_at: string;
}

export default function Results() {
  const [results, setResults] = useState<ResultRow[]>([]);
  const [filteredResults, setFilteredResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  // Advanced filtering states
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSection, setFilterSection] = useState<string>("total_marks");
  const [filterLimit, setFilterLimit] = useState<number>(10);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from("question_papers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResults(data || []);
      setFilteredResults(data || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyAdvancedFilters = () => {
    let filtered = [...results];

    if (filterType === "top") {
      // Sort by the selected section
      filtered.sort((a, b) => {
        return b[filterSection as keyof ResultRow] as number - 
               (a[filterSection as keyof ResultRow] as number);
      });
      
      // Limit to the specified number
      filtered = filtered.slice(0, filterLimit);
    }

    setFilteredResults(filtered);
  };

  const columns: ColumnDef<ResultRow>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "question_paper",
      header: "Question Paper",
      cell: ({ row }) => <div>{row.getValue("question_paper")}</div>,
    },
    {
      accessorKey: "section_1_marks",
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="px-0"
            >
              Section 1
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("section_1_marks")}</div>
      ),
    },
    {
      accessorKey: "section_2_marks",
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="px-0"
            >
              Section 2
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("section_2_marks")}</div>
      ),
    },
    {
      accessorKey: "section_3_marks",
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="px-0"
            >
              Section 3
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("section_3_marks")}</div>
      ),
    },
    {
      accessorKey: "total_marks",
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="px-0"
            >
              Total Marks
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center font-bold">{row.getValue("total_marks")}</div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Results</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Advanced Filters</CardTitle>
          <CardDescription>Filter results by top performers in each section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Filter Type</label>
              <Select
                value={filterType}
                onValueChange={(value) => setFilterType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="top">Top Performers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Section</label>
              <Select
                value={filterSection}
                onValueChange={(value) => setFilterSection(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total_marks">Total Marks</SelectItem>
                  <SelectItem value="section_1_marks">Section 1</SelectItem>
                  <SelectItem value="section_2_marks">Section 2</SelectItem>
                  <SelectItem value="section_3_marks">Section 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Show Top</label>
              <Input
                type="number"
                min="1"
                value={filterLimit}
                onChange={(e) => setFilterLimit(parseInt(e.target.value) || 10)}
                placeholder="Number of results"
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={applyAdvancedFilters} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                  No results found.
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
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}