'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import DashboardCard from '../../../components/DashboardCard';

export default function VerifierDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setSubmissions(data);
        
        // Calculate stats
        setStats({
          total: data.length,
          pending: data.filter(item => item.status === 'Pending').length,
          approved: data.filter(item => item.status === 'Approved').length,
          rejected: data.filter(item => item.status === 'Rejected').length
        });
      } catch (err) {
        console.error('Error fetching submissions:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
 
    // Set up real-time subscription for updates
    const submissionsSubscription = supabase
      .channel('submissions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'submissions' }, 
        (payload) => {
          // Refresh data when changes occur
          fetchSubmissions();
        }
      )
      .subscribe();
      
    return () => {
      // Clean up subscription when component unmounts
      submissionsSubscription.unsubscribe();
    };
  }, []);

  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ 
          status: 'Approved', 
          approval_notes: 'Disetujui oleh verifikator',
          updated_at: new Date() 
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setSubmissions(submissions.map(item =>
        item.id === id ? { ...item, status: 'Approved', approval_notes: 'Disetujui oleh verifikator' } : item
      ));
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('Error approving submission:', error);
      alert('Failed to approve submission. Please try again.');
    }
  };

  const handleReject = async (id, reason = 'Ditolak oleh verifikator') => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ 
          status: 'Rejected', 
          rejection_reason: reason,
          updated_at: new Date() 
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setSubmissions(submissions.map(item =>
        item.id === id ? { ...item, status: 'Rejected', rejection_reason: reason } : item
      ));
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('Error rejecting submission:', error);
      alert('Failed to reject submission. Please try again.');
    }
  };

  const openDetailModal = (submission) => {
    setSelectedSubmission(submission);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedSubmission(null);
    setIsDetailModalOpen(false);
  };

  // Using the same status badge class function as in vendor dashboard
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Disetujui': return 'bg-green-100 text-green-800';
      case 'Ditolak': return 'bg-red-100 text-red-800';
      case 'Menunggu': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <h1 className="text-3xl font-semibold text-slate-800">Verifier Dashboard</h1>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard title="Total Pengajuan">
          <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
        </DashboardCard>
        <DashboardCard title="Menunggu Verifikasi">
          <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
        </DashboardCard>
        <DashboardCard title="Disetujui">
          <p className="text-3xl font-bold text-emerald-600">{stats.approved}</p>
        </DashboardCard>
        <DashboardCard title="Ditolak">
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </DashboardCard>
      </div>

      {/* Tabel */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Daftar Pengajuan</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-4 py-2 text-left text-slate-700">Nama Vendor</th>
              <th className="px-4 py-2 text-left text-slate-700">Detail Pekerjaan</th>
              <th className="px-4 py-2 text-left text-slate-700">Jadwal</th>
              <th className="px-4 py-2 text-left text-slate-700">Status</th>
              <th className="px-4 py-2 text-left text-slate-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 border-b border-slate-200">
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
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {item.status === 'Pending' ? (
                    <div className="flex space-x-2">
                      <button onClick={() => handleApprove(item.id)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded">
                        Setujui
                      </button>
                      <button onClick={() => handleReject(item.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">
                        Tolak
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => openDetailModal(item)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
                      Detail
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedSubmission && (
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
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-800">Detail Pengajuan Vendor</h3>
                <button 
                  onClick={closeDetailModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vendor Information */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-3">Informasi Vendor</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-slate-600">Nama Vendor:</span>
                      <p>{selectedSubmission.vendor_name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Nomor SIMJA:</span>
                      <p>{selectedSubmission.simja_number}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Nomor SIKA:</span>
                      <p>{selectedSubmission.sika_number}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedSubmission.status)}`}>
                        {selectedSubmission.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-3">Detail Pekerjaan</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-slate-600">Deskripsi:</span>
                      <p>{selectedSubmission.job_description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Peralatan:</span>
                      <p>{selectedSubmission.equipment}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Jumlah Pekerja:</span>
                      <p>{selectedSubmission.worker_count} orang</p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-3">Jadwal Pekerjaan</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-slate-600">Tanggal Mulai:</span>
                      <p>{selectedSubmission.start_date}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Tanggal Selesai:</span>
                      <p>{selectedSubmission.end_date}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Jam Kerja:</span>
                      <p>{selectedSubmission.start_time} - {selectedSubmission.end_time}</p>
                    </div>
                  </div>
                </div>
                                {/* Notes */}
                                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-800 mb-3">Catatan</h4>
                  <div className="space-y-2">
                    {selectedSubmission.status === 'Approved' && (
                      <div>
                        <span className="text-sm font-medium text-slate-600">Catatan Persetujuan:</span>
                        <p className="text-emerald-600">{selectedSubmission.approval_notes || 'Tidak ada catatan'}</p>
                      </div>
                    )}
                    {selectedSubmission.status === 'Rejected' && (
                      <div>
                        <span className="text-sm font-medium text-slate-600">Alasan Penolakan:</span>
                        <p className="text-red-600">{selectedSubmission.rejection_reason || 'Tidak ada alasan'}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-slate-600">Tanggal Dibuat:</span>
                      <p>{new Date(selectedSubmission.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Terakhir Diperbarui:</span>
                      <p>{new Date(selectedSubmission.updated_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-3">
                <button 
                  onClick={closeDetailModal} 
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Tutup
                </button>
                {selectedSubmission.status === 'Pending' && (
                  <>
                    <button 
                      onClick={() => handleReject(selectedSubmission.id)} 
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                      Tolak
                    </button>
                    <button 
                      onClick={() => handleApprove(selectedSubmission.id)} 
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                    >
                      Setujui
                    </button>
                  </>
                )}
                {selectedSubmission.status === 'Approved' && (
                  <button 
                    onClick={() => {
                      try {
                        // Import dynamically to avoid server-side issues
                        import('../../../utils/pdfGenerator').then(({ downloadSubmissionPDF }) => {
                          // Format the submission data for PDF
                          const formattedSubmission = {
                            simjaNumber: selectedSubmission.simja_number,
                            vendorName: selectedSubmission.vendor_name,
                            status: selectedSubmission.status,
                            jobDescription: selectedSubmission.job_description,
                            startDate: selectedSubmission.start_date,
                            endDate: selectedSubmission.end_date,
                            startTime: selectedSubmission.start_time,
                            endTime: selectedSubmission.end_time,
                            equipment: selectedSubmission.equipment,
                            sikaNumber: selectedSubmission.sika_number,
                            workerCount: selectedSubmission.worker_count,
                            createdAt: new Date(selectedSubmission.created_at).toLocaleDateString('id-ID')
                          };
                          downloadSubmissionPDF(formattedSubmission);
                        });
                      } catch (error) {
                        console.error('Error generating PDF:', error);
                        alert('Failed to generate PDF. Please try again.');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Download PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {selectedSubmission && selectedSubmission.status === 'Pending' && (
        <div id="rejectionModal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Alasan Penolakan</h3>
            <textarea 
              id="rejectionReason"
              className="w-full border border-gray-300 rounded-md p-2 mb-4 h-32"
              placeholder="Masukkan alasan penolakan pengajuan ini..."
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  document.getElementById('rejectionModal').classList.add('hidden');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  const reason = document.getElementById('rejectionReason').value;
                  handleReject(selectedSubmission.id, reason || 'Ditolak oleh verifikator');
                  document.getElementById('rejectionModal').classList.add('hidden');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Tolak Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

