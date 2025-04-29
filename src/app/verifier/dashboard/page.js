'use client';

import { useState } from 'react';
import DashboardCard from '../../../components/DashboardCard';

export default function VerifierDashboard() {
  const [submissions, setSubmissions] = useState([
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
      status: 'Menunggu',
      simjaFile: { name: 'simja_doc_001.pdf' },
      sikaFile: { name: 'sika_doc_001.pdf' },
      idCardFile: { name: 'id_cards_001.pdf' }
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
      status: 'Menunggu',
      simjaFile: { name: 'simja_doc_002.pdf' },
      sikaFile: { name: 'sika_doc_002.pdf' },
      idCardFile: { name: 'id_cards_002.pdf' }
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
      status: 'Disetujui',
      simjaFile: { name: 'simja_doc_003.pdf' },
      sikaFile: { name: 'sika_doc_003.pdf' },
      idCardFile: { name: 'id_cards_003.pdf' }
    },
    {
      id: 4,
      vendorName: 'PT Elektrik Solusi',
      simjaNumber: 'SIMJA-2023-004',
      jobDescription: 'Pemasangan sistem keamanan CCTV',
      startDate: '2023-11-12',
      endDate: '2023-11-14',
      startTime: '08:30',
      endTime: '17:30',
      equipment: 'CCTV, Kabel, Peralatan instalasi',
      sikaNumber: 'SIKA-2023-004',
      workerCount: '4',
      status: 'Ditolak',
      simjaFile: { name: 'simja_doc_004.pdf' },
      sikaFile: { name: 'sika_doc_004.pdf' },
      idCardFile: { name: 'id_cards_004.pdf' }
    },
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleApprove = (id) => {
    setSubmissions(submissions.map(item =>
      item.id === id ? { ...item, status: 'Disetujui' } : item
    ));
    setIsDetailModalOpen(false);
  };

  const handleReject = (id) => {
    setSubmissions(submissions.map(item =>
      item.id === id ? { ...item, status: 'Ditolak' } : item
    ));
    setIsDetailModalOpen(false);
  };

  const openDetailModal = (submission) => {
    setSelectedSubmission(submission);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedSubmission(null);
    setIsDetailModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-800">Verifier Dashboard</h1>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard title="Total Pengajuan">
          <p className="text-3xl font-bold text-slate-800">{submissions.length}</p>
        </DashboardCard>
        <DashboardCard title="Menunggu Verifikasi">
          <p className="text-3xl font-bold text-amber-600">
            {submissions.filter(item => item.status === 'Menunggu').length}
          </p>
        </DashboardCard>
        <DashboardCard title="Disetujui">
          <p className="text-3xl font-bold text-emerald-600">
            {submissions.filter(item => item.status === 'Disetujui').length}
          </p>
        </DashboardCard>
        <DashboardCard title="Ditolak">
          <p className="text-3xl font-bold text-red-600">
            {submissions.filter(item => item.status === 'Ditolak').length}
          </p>
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
                  <div className="font-medium">{item.vendorName}</div>
                  <div className="text-sm text-slate-500">SIMJA: {item.simjaNumber}</div>
                  <div className="text-sm text-slate-500">SIKA: {item.sikaNumber}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="max-w-xs truncate">{item.jobDescription}</div>
                  <div className="text-sm text-slate-500"><b>Pekerja:</b> {item.workerCount}</div>
                  <div className="text-sm text-slate-500"><b>Peralatan:</b> {item.equipment}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>{item.startDate} s/d {item.endDate}</div>
                  <div className="text-sm text-slate-500">{item.startTime} - {item.endTime}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {item.status === 'Menunggu' ? (
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
  <div   className="fixed overflow-hidden" 
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
                <p>{selectedSubmission.vendorName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Nomor SIMJA:</span>
                <p>{selectedSubmission.simjaNumber}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Nomor SIKA:</span>
                <p>{selectedSubmission.sikaNumber}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  selectedSubmission.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' : 
                  selectedSubmission.status === 'Ditolak' ? 'bg-red-100 text-red-800' : 
                  'bg-amber-100 text-amber-800'
                }`}>
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
                <p>{selectedSubmission.jobDescription}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Peralatan:</span>
                <p>{selectedSubmission.equipment}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Jumlah Pekerja:</span>
                <p>{selectedSubmission.workerCount} orang</p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Jadwal Pekerjaan</h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-slate-600">Tanggal Mulai:</span>
                <p>{selectedSubmission.startDate}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Tanggal Selesai:</span>
                <p>{selectedSubmission.endDate}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Jam Kerja:</span>
                <p>{selectedSubmission.startTime} - {selectedSubmission.endTime}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Dokumen Pendukung</h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-slate-600">SIMJA:</span>
                <p>{selectedSubmission.simjaFile?.name || 'Tidak ada file'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">SIKA:</span>
                <p>{selectedSubmission.sikaFile?.name || 'Tidak ada file'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">ID Card:</span>
                <p>{selectedSubmission.idCardFile?.name || 'Tidak ada file'}</p>
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
          {selectedSubmission.status === 'Menunggu' && (
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
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
