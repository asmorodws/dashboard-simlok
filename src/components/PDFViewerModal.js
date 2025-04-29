'use client';

import { useEffect, useRef } from 'react';
import { getSubmissionPDFDataUrl, downloadSubmissionPDF } from '../utils/pdfGenerator';

export default function PDFViewerModal({ submission, onClose }) {
  const iframeRef = useRef(null);
  
  useEffect(() => {
    if (submission && iframeRef.current) {
      const pdfDataUrl = getSubmissionPDFDataUrl(submission);
      iframeRef.current.src = pdfDataUrl;
    }
  }, [submission]);

  if (!submission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col h-5/6">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Preview Pengajuan: {submission.simjaNumber}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-auto">
          <iframe 
            ref={iframeRef}
            className="w-full h-full border-0"
            title="PDF Preview"
          />
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={() => downloadSubmissionPDF(submission)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
