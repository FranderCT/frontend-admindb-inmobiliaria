import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table as UiTable,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DataTableProps } from "../types/userTypes";

const DataTable = <TData, TValue>({
  columns,
  data,
  total,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  showPagination = true,
  toolbar,
  action,
  onRowClick,
  isRowRead, 
  estado,
  setEstado,
}: DataTableProps<TData, TValue>) => {

  const isManual =
    pageIndex !== undefined &&
    pageSize !== undefined &&
    typeof setPageIndex === "function" &&
    typeof setPageSize === "function";

  const [localPagination, setLocalPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const safeTotal = total ?? data.length;
  const safePageSize = (isManual ? pageSize : undefined) ?? localPagination.pageSize;

  const table = useReactTable({
    data,
    columns,
    state: isManual
      ? { pagination: { pageIndex: pageIndex!, pageSize: pageSize! } }
      : { pagination: localPagination },
    manualPagination: isManual,
    onPaginationChange: (updater) => {
      if (isManual) {
        const next =
          typeof updater === "function"
            ? updater({ pageIndex: pageIndex!, pageSize: pageSize! })
            : updater;
        setPageIndex?.(next.pageIndex);
        setPageSize?.(next.pageSize);
      } else {
        setLocalPagination((prev) =>
          typeof updater === "function" ? updater(prev) : updater
        );
      }
    },
    pageCount: isManual
      ? Math.max(1, Math.ceil(safeTotal / (safePageSize || 1)))
      : undefined,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  });

  const pageSizeOptions = [5, 10, 15, 20, 30];

  const currentPageSize = isManual
    ? pageSize!
    : table.getState().pagination.pageSize;
  const currentPageIndex = isManual
    ? pageIndex!
    : table.getState().pagination.pageIndex;

  const pageCountDisplay = isManual
    ? Math.max(1, Math.ceil(safeTotal / (currentPageSize || 1)))
    : Math.max(1, Math.ceil(data.length / (currentPageSize || 1)));

  const defaultToolbar = (typeof estado === "boolean" && typeof setEstado === "function") ? (
    <div className="flex items-center gap-2">
      <Select
        value={estado ? "true" : "false"}
        onValueChange={(v) => {
          setEstado(v === "true");
          if (isManual) {
            setPageIndex?.(0);
          } else {
            table.setPageIndex(0);
          }
        }}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Activo</SelectItem>
          <SelectItem value="false">Inactivo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ) : null;

  return (
    <div>
      {showPagination && (
        <div className="flex items-center justify-end gap-2 py-4">
          {toolbar ?? defaultToolbar}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Mostrar {currentPageSize} items
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Items por página</DropdownMenuLabel>
              {pageSizeOptions.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => {
                    if (isManual) {
                      setPageSize?.(size);
                      setPageIndex?.(0);
                    } else {
                      table.setPageSize(size);
                      table.setPageIndex(0);
                    }
                  }}
                  className="hover:cursor-pointer"
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="w-full overflow-x-auto rounded-md border text-left max-w-screen">
        <UiTable className="bg-secondary">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="bg-white">
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                  Sin datos
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => {
                const read = isRowRead ? isRowRead(row.original) : undefined;
                return (
                  <TableRow key={row.id} className="hover:cursor-pointer">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        onClick={() => {
                          onRowClick?.(row.original);
                          action?.(row.original);
                        }}
                        className={`max-w-0 break-words whitespace-normal ${isRowRead ? (read ? "" : "font-bold") : ""}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </UiTable>
      </div>

      {showPagination && (
        <div className="flex items-center justify-end gap-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previa
          </Button>
          <p>
            Página {currentPageIndex + 1} de {pageCountDisplay}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
