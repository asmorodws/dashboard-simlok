import { useState } from 'react';

export default function VendorForm({ onSubmit, initialData = {}, buttonText = 'Submit' }) {
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
    simjaFile: null,
    sikaFile: null,
    idCardFile: null,
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-slate-700 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className=" p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Vendor Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Nama Vendor</label>
            <input 
              name="vendorName" 
              value={formData.vendorName} 
              onChange={handleChange} 
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              placeholder="Masukkan nama vendor"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Nomor SIMJA</label>
            <input 
              name="simjaNumber" 
              value={formData.simjaNumber} 
              onChange={handleChange} 
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              placeholder="Masukkan nomor SIMJA"
            />
          </div>
        </div>
      </div>

      {/* Job Details Section */}
      <div className=" p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Detail Pekerjaan</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Deskripsi Pekerjaan</label>
            <textarea 
              name="jobDescription" 
              value={formData.jobDescription} 
              onChange={handleChange} 
              rows="3"
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              placeholder="Jelaskan detail pekerjaan yang akan dilakukan"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Sarana Kerja</label>
              <input 
                name="equipment" 
                value={formData.equipment} 
                onChange={handleChange} 
                className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                placeholder="Alat dan sarana yang digunakan"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Jumlah Pekerja</label>
              <input 
                type="number" 
                name="workerCount" 
                value={formData.workerCount} 
                onChange={handleChange} 
                className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                placeholder="Jumlah pekerja yang terlibat"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Nomor SIKA</label>
            <input 
              name="sikaNumber" 
              value={formData.sikaNumber} 
              onChange={handleChange} 
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
              placeholder="Masukkan nomor SIKA"
            />
          </div>
        </div>
      </div>

      {/* Schedule Section */}
      <div className=" p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Jadwal Pekerjaan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Tanggal Mulai</label>
            <input 
              type="date" 
              name="startDate" 
              value={formData.startDate} 
              onChange={handleChange} 
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Tanggal Selesai</label>
            <input 
              type="date" 
              name="endDate" 
              value={formData.endDate} 
              onChange={handleChange} 
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Jam Mulai</label>
            <input 
              type="time" 
              name="startTime" 
              value={formData.startTime} 
              onChange={handleChange} 
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Jam Selesai</label>
            <input 
              type="time" 
              name="endTime" 
              value={formData.endTime} 
              onChange={handleChange} 
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
            />
          </div>
        </div>
      </div>

      {/* Document Upload Section */}
      <div className=" p-6 rounded-lg border border-slate-200 shadow-sm">
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
              />
              <label 
                htmlFor="simjaFile" 
                className="flex items-center justify-center w-full border border-slate-300 border-dashed rounded-md px-4 py-3 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-slate-600">
                  {formData.simjaFile ? formData.simjaFile.name : 'Pilih file SIMJA'}
                </span>
              </label>
            </div>
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
              />
              <label 
                htmlFor="sikaFile" 
                className="flex items-center justify-center w-full border border-slate-300 border-dashed rounded-md px-4 py-3 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-slate-600">
                  {formData.sikaFile ? formData.sikaFile.name : 'Pilih file SIKA'}
                </span>
              </label>
            </div>
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
              />
              <label 
                htmlFor="idCardFile" 
                className="flex items-center justify-center w-full border border-slate-300 border-dashed rounded-md px-4 py-3 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-slate-600">
                  {formData.idCardFile ? formData.idCardFile.name : 'Pilih file ID Card'}
                </span>
              </label>
            </div>
            <p className="text-xs text-slate-500">Format yang didukung: PDF, JPG, PNG (Maks. 5MB)</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          className="px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
