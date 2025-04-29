'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VendorSidebar } from '../../../components/VendorSidebar';
import DashboardCard from '../../../components/DashboardCard';
import DashboardLayout from '../../../components/DashboardLayout';

export default function VendorDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data that matches the VendorForm structure
  useEffect(() => {
    const mockSubmissions = [
      {
        id: 1,
        vendorName: 'PT Maju Bersama',
        simjaNumber: 'SIMJA-2023-001',
        jobDescription: 'Pemasangan jaringan fiber optik di area pabrik',
        startDate: '2023-11-01',
        endDate: '2023-11-15',
        startTime: '08:00',
        endTime: '17:00',
        equipment: 'Fiber splicer, OTDR, Toolkit',
        sikaNumber: 'SIKA-2023-001',
        workerCount: '5',
        status: 'Approved',
        createdAt: '2023-10-15'
      },
      {
        id: 2,
        vendorName: 'CV Teknik Utama',
        simjaNumber: 'SIMJA-2023-002',
        jobDescription: 'Perbaikan sistem pendingin ruangan server',
        startDate: '2023-11-05',
        endDate: '2023-11-07',
        startTime: '09:00',
        endTime: '16:00',
        equipment: 'AC toolkit, Refrigerant, Pressure gauge',
        sikaNumber: 'SIKA-2023-002',
        workerCount: '3',
        status: 'Pending',
        createdAt: '2023-10-20'
      },
      {
        id: 3,
        vendorName: 'PT Konstruksi Prima',
        simjaNumber: 'SIMJA-2023-003',
        jobDescription: 'Renovasi ruang meeting lantai 3',
        startDate: '2023-11-10',
        endDate: '2023-11-25',
        startTime: '07:30',
        endTime: '16:30',
        equipment: 'Peralatan konstruksi, Cat, Peralatan listrik',
        sikaNumber: 'SIKA-2023-003',
        workerCount: '8',
        status: 'Rejected',
        createdAt: '2023-10-22'
      }
    ];
    
    setSubmissions(mockSubmissions);
    
    // Calculate stats
    setStats({
      total: mockSubmissions.length,
      pending: mockSubmissions.filter(s => s.status === 'Pending').length,
      approved: mockSubmissions.filter(s => s.status === 'Approved').length,
      rejected: mockSubmissions.filter(s => s.status === 'Rejected').length
    });
  }, []);

  const handleEditSubmission = (id) => {
    // For now, we'll just navigate to the submit page
    // In a real app, you would pass the ID to edit the specific submission
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

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

      {/* Stats Cards */}
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

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-medium text-slate-800">Pengajuan Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Deskripsi Pekerjaan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Jadwal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{submission.vendorName}</div>
                    <div className="text-sm text-slate-500">SIMJA: {submission.simjaNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900 max-w-xs truncate">{submission.jobDescription}</div>
                    <div className="text-sm text-slate-500">Pekerja: {submission.workerCount} orang</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{submission.startDate} s/d {submission.endDate}</div>
                    <div className="text-sm text-slate-500">{submission.startTime} - {submission.endTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(submission.status)}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {submission.status === 'Pending' ? (
                      <button
                        onClick={() => handleEditSubmission(submission.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => handleViewDetails(submission)}
                        className="text-green-600 hover:text-green-900"
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
      </div>

      {/* Detail Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Detail Pengajuan: {selectedSubmission.simjaNumber}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Informasi Vendor</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2"><span className="font-medium">Nama Vendor:</span> {selectedSubmission.vendorName}</p>
                    <p className="mb-2"><span className="font-medium">SIMJA Number:</span> {selectedSubmission.simjaNumber}</p>
                    <p className="mb-2"><span className="font-medium">SIKA Number:</span> {selectedSubmission.sikaNumber}</p>
                    <p className="mb-2"><span className="font-medium">Tanggal Pengajuan:</span> {selectedSubmission.createdAt}</p>
                    <p className="mb-2">
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedSubmission.status)}`}>
                        {selectedSubmission.status}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Detail Pekerjaan</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2"><span className="font-medium">Deskripsi:</span> {selectedSubmission.jobDescription}</p>
                    <p className="mb-2"><span className="font-medium">Jumlah Pekerja:</span> {selectedSubmission.workerCount} orang</p>
                    <p className="mb-2"><span className="font-medium">Peralatan:</span> {selectedSubmission.equipment}</p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Jadwal</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="mb-2"><span className="font-medium">Tanggal Mulai:</span> {selectedSubmission.startDate}</p>
                        <p className="mb-2"><span className="font-medium">Tanggal Selesai:</span> {selectedSubmission.endDate}</p>
                      </div>
                      <div>
                        <p className="mb-2"><span className="font-medium">Jam Mulai:</span> {selectedSubmission.startTime}</p>
                        <p className="mb-2"><span className="font-medium">Jam Selesai:</span> {selectedSubmission.endTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  // Here you would implement PDF generation and download
                  // For now, we'll just close the modal
                  alert('PDF akan diunduh (fitur belum diimplementasikan)');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
