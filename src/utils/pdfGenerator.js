import { jsPDF } from 'jspdf';

/**
 * Generate a PDF document for vendor submission details
 * @param {Object} submission - The submission data object
 * @returns {jsPDF} - The generated PDF document
 */
export const generateSubmissionPDF = (submission) => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Pengajuan Vendor', 105, 15, { align: 'center' });
  
  // Add submission details
  doc.setFontSize(12);
  doc.text(`SIMJA Number: ${submission.simjaNumber}`, 20, 30);
  doc.text(`Vendor: ${submission.vendorName}`, 20, 40);
  doc.text(`Status: ${submission.status}`, 20, 50);
  doc.text(`Deskripsi Pekerjaan: ${submission.jobDescription}`, 20, 60);
  doc.text(`Tanggal Mulai: ${submission.startDate}`, 20, 70);
  doc.text(`Tanggal Selesai: ${submission.endDate}`, 20, 80);
  doc.text(`Waktu: ${submission.startTime} - ${submission.endTime}`, 20, 90);
  doc.text(`Sarana Kerja: ${submission.equipment}`, 20, 100);
  doc.text(`SIKA Number: ${submission.sikaNumber}`, 20, 110);
  doc.text(`Jumlah Pekerja: ${submission.workerCount}`, 20, 120);
  doc.text(`Tanggal Pengajuan: ${submission.createdAt}`, 20, 130);
  
  return doc;
};

/**
 * Generate and download a PDF for a vendor submission
 * @param {Object} submission - The submission data object
 */
export const downloadSubmissionPDF = (submission) => {
  const doc = generateSubmissionPDF(submission);
  doc.save(`pengajuan-${submission.simjaNumber}.pdf`);
};

/**
 * Get PDF as data URL for preview
 * @param {Object} submission - The submission data object
 * @returns {string} - Data URL of the PDF
 */
export const getSubmissionPDFDataUrl = (submission) => {
  const doc = generateSubmissionPDF(submission);
  return doc.output('datauristring');
};
