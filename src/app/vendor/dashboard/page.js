'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardCard from '../../../components/DashboardCard';
import DashboardLayout from '../../../components/DashboardLayout';
import { supabase } from '../../../utils/supabaseClient';

export default function VendorDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setSubmissions(data);

        const pending = data.filter(s => s.status === 'Pending' || s.status === 'Menunggu').length;
        const approved = data.filter(s => s.status === 'Approved' || s.status === 'Disetujui').length;
        const rejected = data.filter(s => s.status === 'Rejected' || s.status === 'Ditolak').length;

        setStats({ total: data.length, pending, approved, rejected });
      } catch (err) {
        console.error('Error fetching submissions:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();

    const submissionsSubscription = supabase
      .channel('submissions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, () => {
        fetchSubmissions();
      })
      .subscribe();

    return () => {
      submissionsSubscription.unsubscribe();
    };
  }, []);

  const handleEditSubmission = (id) => {
    router.push(`/vendor/submit?id=${id}`);
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
  };

  const handleDeleteSubmission = async (id) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      try {
        const { error } = await supabase.from('submissions').delete().eq('id', id);
        if (error) throw error;
        setSubmissions(submissions.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Failed to delete submission. Please try again.');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
      case 'Disetujui':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
      case 'Ditolak':
        return 'bg-red-100 text-red-800';
      case 'Pending':
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Vendor Dashboard</h1>
        <button
          onClick={() => router.push('/vendor/submit')}
          className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Tambah Pengajuan
        </button>
      </div>

      <DashboardLayout>
        <DashboardCard title="Total Pengajuan">
          <div className="text-3xl font-bold text-blue-800">{stats.total}</div>
          <p className="text-slate-600">Pengajuan vendor</p>
        </DashboardCard>

        <DashboardCard title="Menunggu Verifikasi">
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          <p className="text-slate-600">Pengajuan dalam proses</p>
        </DashboardCard>

        <DashboardCard title="Disetujui">
          <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          <p className="text-slate-600">Pengajuan disetujui</p>
        </DashboardCard>
      </DashboardLayout>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-medium text-slate-800">Pengajuan Terbaru</h3>
        </div>

        {submissions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Belum ada pengajuan. Klik Tambah Pengajuan untuk membuat pengajuan baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Deskripsi Pekerjaan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Jadwal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{submission.vendor_name}</div>
                      <div className="text-sm text-slate-500">SIMJA: {submission.simja_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 max-w-xs truncate">{submission.job_description}</div>
                      <div className="text-sm text-slate-500">Pekerja: {submission.worker_count} orang</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{submission.start_date} s/d {submission.end_date}</div>
                      <div className="text-sm text-slate-500">{submission.start_time} - {submission.end_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(submission.status)}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {submission.status === 'Pending' || submission.status === 'Menunggu' ? (
                          <>
                            <button onClick={() => handleEditSubmission(submission.id)} className="text-blue-600 hover:text-blue-900">Edit</button>
                            <button onClick={() => handleDeleteSubmission(submission.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                          </>
                        ) : (
                          <button onClick={() => handleViewDetails(submission)} className="text-green-600 hover:text-green-900">Detail</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Detail Pengajuan: {selectedSubmission.simja_number}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Informasi Vendor</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Nama Vendor:</strong> {selectedSubmission.vendor_name}</p>
                    <p><strong>SIMJA Number:</strong> {selectedSubmission.simja_number}</p>
                    <p><strong>SIKA Number:</strong> {selectedSubmission.sika_number}</p>
                    <p><strong>Tanggal Pengajuan:</strong> {new Date(selectedSubmission.created_at).toLocaleDateString('id-ID')}</p>
                    <p><strong>Status:</strong> <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedSubmission.status)}`}>{selectedSubmission.status}</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Detail Pekerjaan</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Deskripsi:</strong> {selectedSubmission.job_description}</p>
                    <p><strong>Jumlah Pekerja:</strong> {selectedSubmission.worker_count} orang</p>
                    <p><strong>Peralatan:</strong> {selectedSubmission.equipment}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Jadwal</h4>
                  <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Tanggal Mulai:</strong> {selectedSubmission.start_date}</p>
                      <p><strong>Tanggal Selesai:</strong> {selectedSubmission.end_date}</p>
                    </div>
                    <div>
                      <p><strong>Jam Mulai:</strong> {selectedSubmission.start_time}</p>
                      <p><strong>Jam Selesai:</strong> {selectedSubmission.end_time}</p>
                    </div>
                  </div>
                </div>
                
                {/* Add your new Dokumen section here */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Dokumen</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedSubmission.simja_file_name && (
                      <p><strong>SIMJA File:</strong> {selectedSubmission.simja_file_name}</p>
                    )}
                    {selectedSubmission.sika_file_name && (
                      <p><strong>SIKA File:</strong> {selectedSubmission.sika_file_name}</p>
                    )}
                    {selectedSubmission.id_card_file_name && (
                      <p><strong>ID Card File:</strong> {selectedSubmission.id_card_file_name}</p>
                    )}
                    {!selectedSubmission.simja_file_name && !selectedSubmission.sika_file_name && !selectedSubmission.id_card_file_name && (
                      <p className="text-gray-500 italic">Tidak ada dokumen yang diunggah</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
