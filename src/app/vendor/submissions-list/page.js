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
import { useRouter } from "next/navigation";

export default function SubmissionsList() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // State for loading animation during delete
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setData(data);
      setLoading(false);
    };
    fetchSubmissions();

    // Realtime subscription to the submissions table
    const channel = supabase
      .channel("supabase_realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to INSERT, UPDATE, DELETE events
          schema: "public",
          table: "submissions",
        },
        (payload) => {
          console.log("Realtime update:", payload);
          setData((prev) => {
            let updated = [...prev];
            if (payload.eventType === "INSERT") {
              updated = [payload.new, ...prev]; // Add new submission
            } else if (payload.eventType === "UPDATE") {
              updated = prev.map((sub) =>
                sub.id === payload.new.id ? payload.new : sub
              ); // Update existing submission
            } else if (payload.eventType === "DELETE") {
              updated = prev.filter((sub) => sub.id !== payload.old.id); // Remove deleted submission
            }
            return updated;
          });
        }
      )
      .subscribe();

    // Clean up on component unmount
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleDetail = (submission) => {
    if (!submission) return;
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
    setShowModal(false);
  };

  const handleEdit = (id) => {
    router.push(`/vendor/submit?id=${id}`);
  };

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    
    setIsDeleting(true); // Start loading animation

    try {
      const { error } = await supabase
        .from("submissions")
        .delete()
        .eq("id", id);
      if (error) throw error;
  
      // Ensure to use the correct state update function for data
      setData((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to delete the submission. Please try again.");
    } finally {
      setIsDeleting(false); // End loading animation
    }
  }

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper();

    return [
      columnHelper.accessor("vendor_name", {
        header: "Vendor",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div>
              <div className="font-semibold">{info.getValue() || "-"}</div>
              <div className="text-xs text-slate-500">
                SIMJA: {row.simja_number || "-"}
              </div>
              <div className="text-xs text-slate-500">
                SIKA: {row.sika_number || "-"}
              </div>
            </div>
          );
        },
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
        cell: (info) => {
          const submission = info.row.original;
          return (
            <div className="flex space-x-2 text-sm font-medium">
              {submission.status == 0 ? (
                <>
                  <button
                    onClick={() => handleEdit(submission.id)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                    disabled={isDeleting} // Disable the button during deletion
                  >
                    {isDeleting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleDetail(submission)}
                  className="px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded text-xs transition"
                >
                  Detail
                </button>
              )}
            </div>
          );
        },
        enableSorting: false,
        meta: { width: "200px" },
      }),
    ];
  }, [isDeleting]);

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

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-slate-800">Riwayat Pengajuan</h1>

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

      {showModal && (
        <ModalDetail
          data={selectedSubmission}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
