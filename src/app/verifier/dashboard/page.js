'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import DashboardCard from '../../../components/DashboardCard';
import ModalDetail from '@/components/ModalDetail';
import StatusBadge from '@/components/StatusBadge';

export default function VerifierDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      setSubmissions(data);
      setStats({
        total: data.length,
        pending: data.filter(i => i.status === 1).length,
        approved: data.filter(i => i.status === 2).length,
        rejected: data.filter(i => i.status === 3).length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();

    // Membuat channel untuk menerima pembaruan data secara real-time
    const channel = supabase
      .channel('submissions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'submissions' }, payload => {
        console.log('New submission added:', payload);
        setSubmissions(prev => [payload.new, ...prev]);  // Menambahkan submission baru ke data yang ada
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'submissions' }, payload => {
        console.log('Submission updated:', payload);
        setSubmissions(prev => prev.map(submission => 
          submission.id === payload.new.id ? payload.new : submission));  // Memperbarui submission yang diupdate
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'submissions' }, payload => {
        console.log('Submission deleted:', payload);
        setSubmissions(prev => prev.filter(submission => submission.id !== payload.old.id));  // Menghapus submission yang dihapus
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(channel);  // Membersihkan subscription saat komponen unmount
    };
  }, []);

  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: 2, approval_notes: 'Disetujui oleh verifikator', updated_at: new Date() })
        .eq('id', id);
      if (error) throw error;

      setSubmissions(prev => prev.map(submission =>
        submission.id === id ? { ...submission, status: 2, approval_notes: 'Disetujui oleh verifikator' } : submission
      ));
      setIsDetailModalOpen(false);
    } catch (error) {
      alert('Gagal menyetujui pengajuan.');
    }
  };

  const handleReject = async (id) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: 3, rejection_reason: rejectionReason || 'Ditolak oleh verifikator', updated_at: new Date() })
        .eq('id', id);
      if (error) throw error;

      setSubmissions(prev => prev.map(submission =>
        submission.id === id ? { ...submission, status: 3, rejection_reason: rejectionReason || 'Ditolak oleh verifikator' } : submission
      ));
      setIsRejectionModalOpen(false);
      setIsDetailModalOpen(false);
    } catch (error) {
      alert('Gagal menolak pengajuan.');
    }
  };

  const openDetailModal = (submission) => {
    setSelectedSubmission(submission);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-800">HSE Officer Dashboard</h1>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard title="Total Pengajuan"><p className="text-3xl font-bold">{stats.total}</p></DashboardCard>
        <DashboardCard title="Menunggu Verifikasi"><p className="text-3xl font-bold text-amber-600">{stats.pending}</p></DashboardCard>
        <DashboardCard title="Disetujui"><p className="text-3xl font-bold text-emerald-600">{stats.approved}</p></DashboardCard>
        <DashboardCard title="Ditolak"><p className="text-3xl font-bold text-red-600">{stats.rejected}</p></DashboardCard>
      </div>

      {/* Tabel */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Daftar Pengajuan</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-4 py-2 text-left">Nama Vendor</th>
              <th className="px-4 py-2 text-left">Detail Pekerjaan</th>
              <th className="px-4 py-2 text-left">Jadwal</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 border-b">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.vendor_name}</div>
                  <div className="text-sm text-slate-500">SIMJA: {item.simja_number}</div>
                  <div className="text-sm text-slate-500">SIKA: {item.sika_number}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="max-w-xs truncate">{item.job_description}</div>
                  <div className="text-sm text-slate-500"><b>Pekerja:</b> {item.worker_count}</div>
                  <div className="text-sm text-slate-500"><b>Peralatan:</b> {item.equipment}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>{item.start_date} s/d {item.end_date}</div>
                  <div className="text-sm text-slate-500">{item.start_time} - {item.end_time}</div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3">
                  {item.status === 0 ? (  // 1 = Pending
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSubmission(item);
                          setIsRejectionModalOpen(true);
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openDetailModal(item)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                    >
                      Detail
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      {isDetailModalOpen && selectedSubmission && (
        <ModalDetail selectedSubmission={selectedSubmission} closeDetailModal={() => setIsDetailModalOpen(false)} />
      )}

      {/* Modal Penolakan */}
      {isRejectionModalOpen && (
        <div className="fixed overflow-hidden" 
        style={{ 
          position: 'fixed',
          top: -25,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Alasan Penolakan</h3>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 mb-4 h-32"
              placeholder="Masukkan alasan penolakan..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setIsRejectionModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Batal</button>
              <button onClick={() => handleReject(selectedSubmission.id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Tolak Pengajuan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
