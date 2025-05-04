import React from 'react';
import StatusBadge from './StatusBadge';

export default function ModalDetail({ selectedSubmission, closeDetailModal }) {
  return (
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
                  <StatusBadge status={selectedSubmission.status} />
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
                  <span className="text-sm font-medium text-slate-600">Sarana Kerja:</span>
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
            {/* {selectedSubmission.status === 'Approved' && (
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
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
