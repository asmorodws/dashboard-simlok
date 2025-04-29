import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function VendorForm({ onSubmit, initialData = {}, buttonText = 'Submit', isSubmitting = false }) {
  const [formData, setFormData] = useState({
    vendorName: '',
    simjaNumber: '',
    jobDescription: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    equipment: '',
    sikaNumber: '',
    workerCount: '',
    simjaFileName: initialData.simja_file_name || '',
    sikaFileName: initialData.sika_file_name || '',
    idCardFileName: initialData.id_card_file_name || '',
    ...initialData,
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // For file inputs, just store the file name
    if (type === 'file' && files[0]) {
      const fileName = files[0].name;
      const fileNameField = name.replace('File', 'FileName');
      
      setFormData((prev) => ({
        ...prev,
        [fileNameField]: fileName
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!formData.vendorName) errors.vendorName = 'Nama vendor harus diisi';
    if (!formData.simjaNumber) errors.simjaNumber = 'Nomor SIMJA harus diisi';
    if (!formData.jobDescription) errors.jobDescription = 'Deskripsi pekerjaan harus diisi';
    if (!formData.startDate) errors.startDate = 'Tanggal mulai harus diisi';
    if (!formData.endDate) errors.endDate = 'Tanggal selesai harus diisi';
    if (!formData.startTime) errors.startTime = 'Jam mulai harus diisi';
    if (!formData.endTime) errors.endTime = 'Jam selesai harus diisi';
    if (!formData.workerCount) errors.workerCount = 'Jumlah pekerja harus diisi';
    
    // Date validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        errors.endDate = 'Tanggal selesai tidak boleh sebelum tanggal mulai';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      return;
    }
    
    try {
      console.log("Form data before submission:", formData);
      
      // Prepare data for Supabase - matching the exact column names from the table schema
      const submissionData = {
        vendor_name: formData.vendorName || '',
        simja_number: formData.simjaNumber || '',
        sika_number: formData.sikaNumber || '',
        job_description: formData.jobDescription || '',
        start_date: formData.startDate || '',
        end_date: formData.endDate || '',
        start_time: formData.startTime || '',
        end_time: formData.endTime || '',
        equipment: formData.equipment || '',
        worker_count: parseInt(formData.workerCount, 10) || 0,
        status: 'Pending',
        updated_at: new Date(),
        // Store only file names
        simja_file_name: formData.simjaFileName || '',
        sika_file_name: formData.sikaFileName || '',
        id_card_file_name: formData.idCardFileName || ''
      };
      
      console.log("Submission data being sent to Supabase:", submissionData);
      
      // Additional validation before submission to prevent NULL constraint errors
      if (!submissionData.vendor_name) {
        alert('Nama vendor harus diisi');
        return;
      }
      
      if (!submissionData.simja_number) {
        alert('Nomor SIMJA harus diisi');
        return;
      }
      
      if (!submissionData.job_description) {
        alert('Deskripsi pekerjaan harus diisi');
        return;
      }
      
      if (!submissionData.start_date) {
        alert('Tanggal mulai harus diisi');
        return;
      }
      
      if (!submissionData.end_date) {
        alert('Tanggal selesai harus diisi');
        return;
      }
      
      if (!submissionData.start_time) {
        alert('Jam mulai harus diisi');
        return;
      }
      
      if (!submissionData.end_time) {
        alert('Jam selesai harus diisi');
        return;
      }
      
      // For new records, add created_at
      if (!initialData.id) {
        submissionData.created_at = new Date();
      }
      
      // Call the onSubmit prop with the prepared data
      await onSubmit(submissionData);
      
      // Reset form after successful submission if it's a new record
      if (!initialData.id) {
        setFormData({
          vendorName: '',
          simjaNumber: '',
          jobDescription: '',
          startDate: '',
          endDate: '',
          startTime: '',
          endTime: '',
          equipment: '',
          sikaNumber: '',
          workerCount: '',
          simjaFileName: '',
          sikaFileName: '',
          idCardFileName: ''
        });
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat mengirim data: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-slate-700 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="p-6 rounded-lg border border-slate-200 shadow-sm bg-white">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Vendor Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Nama Vendor</label>
            <input 
              name="vendorName" 
              value={formData.vendorName} 
              onChange={handleChange} 
              className={`w-full border ${formErrors.vendorName ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              placeholder="Masukkan nama vendor"
              required
            />
            {formErrors.vendorName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.vendorName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Nomor SIMJA</label>
            <input 
              name="simjaNumber" 
              value={formData.simjaNumber} 
              onChange={handleChange} 
              className={`w-full border ${formErrors.simjaNumber ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              placeholder="Masukkan nomor SIMJA"
              required
            />
            {formErrors.simjaNumber && (
              <p className="text-red-500 text-xs mt-1">{formErrors.simjaNumber}</p>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Section */}
      <div className="p-6 rounded-lg border border-slate-200 shadow-sm bg-white">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Detail Pekerjaan</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Deskripsi Pekerjaan</label>
            <textarea 
              name="jobDescription" 
              value={formData.jobDescription} 
              onChange={handleChange} 
              rows="3"
              className={`w-full border ${formErrors.jobDescription ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              placeholder="Jelaskan detail pekerjaan yang akan dilakukan"
              required
            ></textarea>
            {formErrors.jobDescription && (
              <p className="text-red-500 text-xs mt-1">{formErrors.jobDescription}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Sarana Kerja</label>
              <input 
                name="equipment" 
                value={formData.equipment} 
                onChange={handleChange} 
                className={`w-full border ${formErrors.equipment ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Alat dan sarana yang digunakan"
              />
              {formErrors.equipment && (
                <p className="text-red-500 text-xs mt-1">{formErrors.equipment}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Jumlah Pekerja</label>
              <input 
                type="number" 
                name="workerCount" 
                value={formData.workerCount} 
                onChange={handleChange} 
                className={`w-full border ${formErrors.workerCount ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                placeholder="Jumlah pekerja yang terlibat"
                required
              />
              {formErrors.workerCount && (
                <p className="text-red-500 text-xs mt-1">{formErrors.workerCount}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Nomor SIKA</label>
            <input 
              name="sikaNumber" 
              value={formData.sikaNumber} 
              onChange={handleChange} 
              className={`w-full border ${formErrors.sikaNumber ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              placeholder="Masukkan nomor SIKA"
            />
            {formErrors.sikaNumber && (
              <p className="text-red-500 text-xs mt-1">{formErrors.sikaNumber}</p>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="p-6 rounded-lg border border-slate-200 shadow-sm bg-white">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Jadwal Pekerjaan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Tanggal Mulai</label>
            <input 
              type="date" 
              name="startDate" 
              value={formData.startDate} 
              onChange={handleChange} 
              className={`w-full border ${formErrors.startDate ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              required
            />
            {formErrors.startDate && (
              <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Tanggal Selesai</label>
            <input 
              type="date" 
              name="endDate" 
              value={formData.endDate} 
              onChange={handleChange} 
              className={`w-full border ${formErrors.endDate ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              required
            />
            {formErrors.endDate && (
              <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Jam Mulai</label>
            <input 
              type="time" 
              name="startTime" 
              value={formData.startTime} 
              onChange={handleChange} 
              className={`w-full border ${formErrors.startTime ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-              transparent transition-colors`}
              required
            />
            {formErrors.startTime && (
              <p className="text-red-500 text-xs mt-1">{formErrors.startTime}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Jam Selesai</label>
            <input 
              type="time" 
              name="endTime" 
              value={formData.endTime} 
              onChange={handleChange} 
              className={`w-full border ${formErrors.endTime ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
              required
            />
            {formErrors.endTime && (
              <p className="text-red-500 text-xs mt-1">{formErrors.endTime}</p>
            )}
          </div>
        </div>
      </div>

      {/* Document Upload Section - Modified to only store file names */}
      <div className="p-6 rounded-lg border border-slate-200 shadow-sm bg-white">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Dokumen Pendukung</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload SIMJA</label>
            <div className="flex items-center">
              <input 
                type="file" 
                name="simjaFile" 
                onChange={handleChange} 
                className="hidden" 
                id="simjaFile"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label 
                htmlFor="simjaFile" 
                className={`flex items-center justify-center w-full border ${formErrors.simjaFile ? 'border-red-500' : 'border-slate-300'} border-dashed rounded-md px-4 py-3 bg-white hover:bg-slate-50 cursor-pointer transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-slate-600">
                  {formData.simjaFileName ? formData.simjaFileName : 'Pilih file SIMJA'}
                </span>
              </label>
            </div>
            {formErrors.simjaFile && (
              <p className="text-red-500 text-xs mt-1">{formErrors.simjaFile}</p>
            )}
            <p className="text-xs text-slate-500">Format yang didukung: PDF, JPG, PNG (Maks. 5MB)</p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload SIKA</label>
            <div className="flex items-center">
              <input 
                type="file" 
                name="sikaFile" 
                onChange={handleChange} 
                className="hidden" 
                id="sikaFile"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label 
                htmlFor="sikaFile" 
                className={`flex items-center justify-center w-full border ${formErrors.sikaFile ? 'border-red-500' : 'border-slate-300'} border-dashed rounded-md px-4 py-3 bg-white hover:bg-slate-50 cursor-pointer transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-slate-600">
                  {formData.sikaFileName ? formData.sikaFileName : 'Pilih file SIKA'}
                </span>
              </label>
            </div>
            {formErrors.sikaFile && (
              <p className="text-red-500 text-xs mt-1">{formErrors.sikaFile}</p>
            )}
            <p className="text-xs text-slate-500">Format yang didukung: PDF, JPG, PNG (Maks. 5MB)</p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload ID Card</label>
            <div className="flex items-center">
              <input 
                type="file" 
                name="idCardFile" 
                onChange={handleChange} 
                className="hidden" 
                id="idCardFile"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label 
                htmlFor="idCardFile" 
                className={`flex items-center justify-center w-full border ${formErrors.idCardFile ? 'border-red-500' : 'border-slate-300'} border-dashed rounded-md px-4 py-3 bg-white hover:bg-slate-50 cursor-pointer transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-slate-600">
                  {formData.idCardFileName ? formData.idCardFileName : 'Pilih file ID Card'}
                </span>
              </label>
            </div>
            {formErrors.idCardFile && (
              <p className="text-red-500 text-xs mt-1">{formErrors.idCardFile}</p>
            )}
            <p className="text-xs text-slate-500">Format yang didukung: PDF, JPG, PNG (Maks. 5MB)</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          className={`px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengirim...
            </div>
          ) : buttonText}
        </button>
      </div>
    </form>
  );
}

