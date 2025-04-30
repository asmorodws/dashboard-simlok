"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

import DashboardCard from "@/components/DashboardCard";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import ModalDetail from "@/components/ModalDetail";

export default function VendorDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data and subscribe to real-time changes
  useEffect(() => {
    fetchSubmissions();

    const subscription = supabase
      .channel("submissions-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "submissions" },
        fetchSubmissions
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSubmissions(data);
      updateStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateStats(data) {
    const pending = data.filter(
      (s) => s.status === "Pending" || s.status === "Menunggu"
    ).length;
    const approved = data.filter(
      (s) => s.status === "Approved" || s.status === "Disetujui"
    ).length;
    const rejected = data.filter(
      (s) => s.status === "Rejected" || s.status === "Ditolak"
    ).length;
    setStats({ total: data.length, pending, approved, rejected });
  }

  function handleViewDetails(submission) {
    setSelectedSubmission(submission);
    setShowModal(true);
  }

  function handleCloseModal() {
    setSelectedSubmission(null);
    setShowModal(false);
  }

  function handleEditSubmission(id) {
    router.push(`/vendor/submit?id=${id}`);
  }

  async function handleDeleteSubmission(id) {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      const { error } = await supabase
        .from("submissions")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Gagal menghapus pengajuan. Coba lagi.");
    }
  }

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Vendor Dashboard</h1>
        <button
          onClick={() => router.push("/vendor/submit")}
          className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition"
        >
          Tambah Pengajuan
        </button>
      </div>

      <DashboardLayout>
        <DashboardCard title="Total Pengajuan">
          <StatItem
            count={stats.total}
            subtitle="Pengajuan vendor"
            color="text-blue-800"
          />
        </DashboardCard>
        <DashboardCard title="Menunggu Verifikasi">
          <StatItem
            count={stats.pending}
            subtitle="Pengajuan dalam proses"
            color="text-yellow-600"
          />
        </DashboardCard>
        <DashboardCard title="Disetujui">
          <StatItem
            count={stats.approved}
            subtitle="Pengajuan disetujui"
            color="text-green-600"
          />
        </DashboardCard>
      </DashboardLayout>

      <SubmissionTable
        submissions={submissions}
        onEdit={handleEditSubmission}
        onDelete={handleDeleteSubmission}
        onView={handleViewDetails}
      />

      {showModal && selectedSubmission && (
        <ModalDetail
          selectedSubmission={selectedSubmission}
          closeDetailModal={handleCloseModal}
        />
      )}
    </div>
  );
}

function StatItem({ count, subtitle, color }) {
  return (
    <>
      <div className={`text-3xl font-bold ${color}`}>{count}</div>
      <p className="text-slate-600">{subtitle}</p>
    </>
  );
}

function SubmissionTable({ submissions, onEdit, onDelete, onView }) {
  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center text-gray-500 border border-slate-200 shadow-md">
        Belum ada pengajuan. Klik Tambah Pengajuan untuk membuat pengajuan baru.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-md overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-lg font-medium text-slate-800">
          Pengajuan Terbaru
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <Th>Vendor</Th>
              <Th>Deskripsi Pekerjaan</Th>
              <Th>Jadwal</Th>
              <Th>Status</Th>
              <Th>Aksi</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50">
                <Td>
                  <div className="font-medium text-slate-900">
                    {sub.vendor_name}
                  </div>
                  <div className="text-sm text-slate-500">
                    SIMJA: {sub.simja_number}
                  </div>
                </Td>
                <Td>
                  <div className="text-slate-900 max-w-xs truncate">
                    {sub.job_description}
                  </div>
                  <div className="text-sm text-slate-500">
                    Pekerja: {sub.worker_count} orang
                  </div>
                </Td>
                <Td>
                  <div>
                    {sub.start_date} s/d {sub.end_date}
                  </div>
                  <div className="text-sm text-slate-500">
                    {sub.start_time} - {sub.end_time}
                  </div>
                </Td>
                <Td>
                  <StatusBadge status={sub.status} />
                </Td>
                <Td>
                  <div className="flex space-x-2 text-sm font-medium">
                    {sub.status == 0 ? (
                      <>
                        <button
                          onClick={() => onEdit(sub.id)}
                          className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(sub.id)}
                          className="px-6 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                        >
                          Hapus
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onView(sub)}
                        className="px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                      >
                        Detail
                      </button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
      {children}
    </th>
  );
}

function Td({ children }) {
  return <td className="px-6 py-4 whitespace-nowrap text-sm">{children}</td>;
}
