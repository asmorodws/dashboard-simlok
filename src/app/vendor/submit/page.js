'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VendorForm from '../../../components/VendorForm';

export default function SubmitProject() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [initialData, setInitialData] = useState({});
  const [isLoading, setIsLoading] = useState(!!submissionId);

  // If we have an ID, fetch the submission data
  useEffect(() => {
    if (submissionId) {
      // In a real app, you would fetch the data from your API
      // For this example, we'll use mock data
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
          workerCount: '5'
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
          workerCount: '3'
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
          workerCount: '8'
        }
      ];

      const foundSubmission = mockSubmissions.find(sub => sub.id === parseInt(submissionId));
      
      if (foundSubmission) {
        setInitialData(foundSubmission);
      } else {
        setSubmitError('Pengajuan tidak ditemukan');
      }
      
      setIsLoading(false);
    }
  }, [submissionId]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // In a real application, you would send this data to your API
      console.log('Submitting project data:', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard after successful submission
      router.push('/vendor/dashboard?success=true');
    } catch (error) {
      console.error('Error submitting project:', error);
      setSubmitError('An error occurred while submitting your project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="text-center">
          <p className="text-slate-600">Loading submission data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-slate-800">
            {submissionId ? "Ubah Pengajuan" : "Form Pengajuan"}
          </h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
          >
            Kembali
          </button>
        </div>
        {/* <p className="mt-2 text-slate-600">
          {submissionId 
            ? 'Edit the form below to update your project submission.' 
            : 'Fill out the form below to submit a new project for verification.'}
        </p> */}
      </div>
      
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{submitError}</p>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <VendorForm 
          onSubmit={handleSubmit} 
          initialData={initialData}
          buttonText={isSubmitting 
            ? 'Submitting...' 
            : submissionId ? 'Update Project' : 'Submit Project'
          }
        />
      </div>
    </div>
  );
}
