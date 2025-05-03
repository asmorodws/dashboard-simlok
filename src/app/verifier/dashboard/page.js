"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import DashboardCard from "../../../components/DashboardCard";
import ModalDetail from "@/components/ModalDetail";
import StatusBadge from "@/components/StatusBadge";
import ModalApproval from "@/components/ModalApproval";

export default function VerifierDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateStats = useCallback(
    (data) => ({
      total: data.length,
      pending: data.filter((i) => i.status === 1).length,
      approved: data.filter((i) => i.status === 2).length,
      rejected: data.filter((i) => i.status === 3).length,
    }),
    []
  );

  const fetchSubmissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
  .from("submissions")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(5);

      if (error) throw error;

      setSubmissions(data);
      setStats(calculateStats(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchSubmissions();

    const channel = supabase
      .channel("realtime submissions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions" },
        (payload) => {
          console.log("Realtime update:", payload);
          setSubmissions((prev) => {
            let updated = [...prev];
            if (payload.eventType === "INSERT") {
              updated = [payload.new, ...prev];
            } else if (payload.eventType === "UPDATE") {
              updated = prev.map((sub) =>
                sub.id === payload.new.id ? payload.new : sub
              );
            } else if (payload.eventType === "DELETE") {
              updated = prev.filter((sub) => sub.id !== payload.old.id);
            }
            setStats(calculateStats(updated));
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchSubmissions, calculateStats]);

  // const handleApprove = async (id) => {
  //   try {
  //     const { error } = await supabase
  //       .from("submissions")
  //       .update({
  //         status: 1,
  //         approval_notes: "Disetujui oleh verifikator",
  //         updated_at: new Date(),
  //       })
  //       .eq("id", id);
  //     if (error) throw error;

  //     setSubmissions((prev) =>
  //       prev.map((sub) =>
  //         sub.id === id
  //           ? {
  //               ...sub,
  //               status: 1,
  //               approval_notes: "Disetujui oleh verifikator",
  //             }
  //           : sub
  //       )
  //     );
  //     setIsDetailModalOpen(false);
  //   } catch (error) {
  //     alert("Gagal menyetujui pengajuan.");
  //   }
  // };

  // const handleReject = async (id) => {
  //   try {
  //     const { error } = await supabase
  //       .from("submissions")
  //       .update({
  //         status: 2,
  //         rejection_reason: rejectionReason || "Ditolak oleh verifikator",
  //         updated_at: new Date(),
  //       })
  //       .eq("id", id);
  //     if (error) throw error;

  //     setSubmissions((prev) =>
  //       prev.map((sub) =>
  //         sub.id === id
  //           ? {
  //               ...sub,
  //               status: 2,
  //               rejection_reason: rejectionReason || "Ditolak oleh verifikator",
  //             }
  //           : sub
  //       )
  //     );
  //     setIsRejectionModalOpen(false);
  //     setIsDetailModalOpen(false);
  //   } catch (error) {
  //     alert("Gagal menolak pengajuan.");
  //   }
  // };

  const openDetailModal = (submission) => {
    setSelectedSubmission(submission);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-800">
        HSE Officer Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard title="Total Pengajuan">
          <p className="text-3xl font-bold">{stats.total}</p>
        </DashboardCard>
        <DashboardCard title="Menunggu Verifikasi">
          <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
        </DashboardCard>
        <DashboardCard title="Disetujui">
          <p className="text-3xl font-bold text-emerald-600">
            {stats.approved}
          </p>
        </DashboardCard>
        <DashboardCard title="Ditolak">
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </DashboardCard>
      </div>

      <div className="overflow-y-auto bg-white p-4 rounded-xl shadow-md max-w-full">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          Daftar Pengajuan
        </h2>
        <table className="min-w-full table-fixed text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Deskripsi Pekerjaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Jadwal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 border-b border-slate-200"
              >
                <td className="px-3 py-2 align-top">
                  <div className="font-semibold">{item.vendor_name}</div>
                  <div className="text-xs text-slate-500">
                    SIMJA: {item.simja_number}
                  </div>
                  <div className="text-xs text-slate-500">
                    SIKA: {item.sika_number}
                  </div>
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="truncate max-w-xs">
                    {item.job_description}
                  </div>
                  <div className="text-xs text-slate-500">
                    <b>Pekerja:</b> {item.worker_count}
                  </div>
                  <div className="text-xs text-slate-500">
                    <b>Peralatan:</b> {item.equipment}
                  </div>
                </td>
                <td className="px-3 py-2 align-top whitespace-nowrap">
                  <div>
                    {item.start_date} s/d {item.end_date}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.start_time} - {item.end_time}
                  </div>
                </td>
                <td className="px-3 py-2 align-top">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-3 py-2 align-top">
                  {/* {item.status === 0 ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSubmission(item);
                          setIsRejectionModalOpen(true);
                        }}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  ) : ( */}
                    <button
                      onClick={() => openDetailModal(item)}
                      className="px-6 py-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded text-xs transition"
                    >
                      Detail
                    </button>
                  {/* )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDetailModalOpen && selectedSubmission && (
        selectedSubmission.status !== 3 ? (
          <ModalApproval
          selectedSubmission={selectedSubmission}
          closeDetailModal={() => setIsDetailModalOpen(false)}
          />
        ) : (
          <ModalDetail
            selectedSubmission={selectedSubmission}
            closeDetailModal={() => setIsDetailModalOpen(false)}
          />
        )
        
       
      )}

      {/* {isRejectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Alasan Penolakan
            </h3>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4 h-32"
              placeholder="Masukkan alasan penolakan..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsRejectionModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleReject(selectedSubmission.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Tolak Pengajuan
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
