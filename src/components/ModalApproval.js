import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // ganti sesuai path
import StatusBadge from './StatusBadge';

export default function ModalApproval({ selectedSubmission, closeDetailModal }) {
  const [status, setStatus] = useState(selectedSubmission.status);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('submissions')
      .update({ status })
      .eq('id', selectedSubmission.id);

    setLoading(false);

    if (error) {
      alert('Gagal mengupdate status.');
      console.error(error);
    } else {
      alert('Status berhasil diperbarui!');
      
      closeDetailModal();
    }
  };


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
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-slate-800">Detail Pengajuan Vendor</h3>
          <button onClick={closeDetailModal} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
       
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informasi Vendor */}
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
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm"
                >
                  <option value="0">Pending</option>
                  <option value="1">Approved</option>
                  <option value="2">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Detail Pekerjaan */}
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

          {/* Jadwal */}
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

          {/* Tanggal dan Catatan */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-3">Informasi Lain</h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-slate-600">Dibuat:</span>
                <p>{new Date(selectedSubmission.created_at).toLocaleString('id-ID')}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">Diperbarui:</span>
                <p>{new Date(selectedSubmission.updated_at).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={closeDetailModal}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50"
          >
            Cancel
          </button>
      
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}
