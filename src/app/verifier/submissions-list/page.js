"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { supabase } from "../../../lib/supabaseClient";
import StatusBadge from "@/components/StatusBadge";
import ModalDetail from "@/components/ModalDetail";
import ModalApproval from "@/components/ModalApproval";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function SubmissionsList() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    let subscription; // to store channel ref
  
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
  
      if (!error) setData(data);
      setLoading(false);
  
      // Realtime listener
      subscription = supabase
        .channel("supabase_realtime")
        .on(
          "postgres_changes",
          {
            event: "*", // or "INSERT", "UPDATE", "DELETE" if you want specific
            schema: "public",
            table: "submissions",
          },
          (payload) => {
            console.log("Realtime payload:", payload);
            setData((prevData) => {
              const { eventType, new: newRow, old: oldRow } = payload;
              switch (eventType) {
                case "INSERT":
                  return [newRow, ...prevData];
                case "UPDATE":
                  return prevData.map((item) =>
                    item.id === newRow.id ? newRow : item
                  );
                case "DELETE":
                  return prevData.filter((item) => item.id !== oldRow.id);
                default:
                  return prevData;
              }
            });
          }
        )
        .subscribe();
    };
  
    fetchSubmissions();
  
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper();

    return [
      columnHelper.accessor("vendor_name", {
        header: "Vendor",
        cell: (info) => (
          <div>
            <div className="font-semibold">{info.getValue()}</div>
            <div className="text-xs text-slate-500">
              SIMJA: {info.row.original.simja_number}
            </div>
            <div className="text-xs text-slate-500">
              SIKA: {info.row.original.sika_number}
            </div>
          </div>
        ),
        enableSorting: true,
        meta: { width: "200px" },
      }),
      columnHelper.accessor("job_description", {
        header: "Deskripsi",
        cell: (info) => (
          <div>
            <div>{info.getValue()}</div>
            <div className="text-xs text-slate-500">
              <b>Pekerja:</b> {info.row.original.worker_count}
              <br />
              <b>Sarana Kerja:</b> {info.row.original.equipment}
            </div>
          </div>
        ),
        enableSorting: true,
        meta: { width: "250px" },
      }),
      columnHelper.accessor("start_date", {
        header: "Jadwal",
        cell: (info) => {
          const row = info.row.original;
          const startDate = format(new Date(row.start_date), "d MMMM yyyy", {
            locale: id,
          });
          const endDate = format(new Date(row.end_date), "d MMMM yyyy", {
            locale: id,
          });
          return (
            <div>
              <div>
                {startDate} s/d {endDate}
              </div>
              <div className="text-xs text-slate-500">
                {row.start_time} - {row.end_time}
              </div>
            </div>
          );
        },
        enableSorting: true,
        meta: { width: "150px" },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
        enableSorting: true,
        meta: { width: "120px" },
      }),
      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
        enableSorting: true,
        meta: { width: "180px" },
      }),
      columnHelper.accessor("id", {
        header: "Aksi",
        cell: (info) => (
          <button
            className="px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded text-xs transition"
            onClick={() => handleDetail(info.row.original)}
          >
            Detail
          </button>
        ),
        enableSorting: false,
        meta: { width: "100px" },
      }),
    ];
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDetail = (submission) => {
    if (!submission) return;
    setSelectedSubmission(submission);
    setIsDetailModalOpen(true);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-slate-800">
        Daftar Pengajuan
      </h1>

      <div className="relative flex w-full max-w-xs flex-col gap-1 text-on-surface dark:text-on-surface-dark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="absolute left-2.5 top-1/2 size-5 -translate-y-1/2 text-on-surface/50 dark:text-on-surface-dark/50"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="search"
          className="w-full rounded border border-gray-300 bg-white py-2 pl-10 pr-2 text-sm"
          placeholder="Cari vendor"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-md mt-4">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 font-medium text-xs uppercase cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.column.columnDef.meta?.width }}
                  >
                    {!header.isPlaceholder && (
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <span>↓</span>
                        )}
                        {header.column.getIsSorted() === "asc" && (
                          <span>↑</span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 align-top"
                    style={{ width: cell.column.columnDef.meta?.width }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-600">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="space-x-2">
            <button
              className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 bg-slate-200 rounded disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detail or Approval */}
      {isDetailModalOpen && selectedSubmission && (
        <ModalApproval
          selectedSubmission={selectedSubmission}
          closeDetailModal={() => setIsDetailModalOpen(false)}
        />
      )}
      {/* {isDetailModalOpen &&
        selectedSubmission &&
        (selectedSubmission.status !== 3 ? (
          <ModalApproval
            selectedSubmission={selectedSubmission}
            closeDetailModal={() => setIsDetailModalOpen(false)}
          />
        ) : (
          <ModalDetail
            submission={selectedSubmission}
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
          />
        ))} */}
    </div>
  );
}
