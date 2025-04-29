'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VendorForm from '../../../components/VendorForm';
import { supabase } from '../../../utils/supabaseClient';

export default function SubmitPage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchVendor(id);
    }
  }, [id]);

  const fetchVendor = async (vendorId) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', vendorId)
        .single();
      
      if (error) throw error;
      
      // Transform data to match form field names
      const formattedData = {
        id: data.id,
        vendorName: data.vendor_name || '',
        simjaNumber: data.simja_number || '',
        sikaNumber: data.sika_number || '',
        jobDescription: data.job_description || '',
        startDate: data.start_date || '',
        endDate: data.end_date || '',
        startTime: data.start_time || '',
        endTime: data.end_time || '',
        equipment: data.equipment || '',
        workerCount: data.worker_count?.toString() || '',
        simjaFileName: data.simja_file_name || '',
        sikaFileName: data.sika_file_name || '',
        idCardFileName: data.id_card_file_name || ''
      };
      
      setVendor(formattedData);
    } catch (error) {
      console.error('Error fetching vendor:', error);
      alert('Error loading vendor data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      console.log("Form data being submitted:", formData);
      
      // Prepare data for Supabase
      const submissionData = {
        vendor_name: formData.vendor_name,
        simja_number: formData.simja_number,
        sika_number: formData.sika_number,
        job_description: formData.job_description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        equipment: formData.equipment,
        worker_count: formData.worker_count,
        status: id ? (formData.status || 'Pending') : 'Pending',
        updated_at: new Date(),
        simja_file_name: formData.simja_file_name,
        sika_file_name: formData.sika_file_name,
        id_card_file_name: formData.id_card_file_name
      };

      console.log("Submission data being sent to Supabase:", submissionData);

      let result;
      
      if (id) {
        // Update existing submission
        const { data, error } = await supabase
          .from('submissions')
          .update(submissionData)
          .eq('id', id)
          .select();
        
        if (error) throw error;
        result = data[0];
      } else {
        // Create new submission
        submissionData.created_at = new Date();
        
        const { data, error } = await supabase
          .from('submissions')
          .insert(submissionData)
          .select();
        
        if (error) throw error;
        result = data[0];
      }
      
      alert(id ? 'Pengajuan berhasil diperbarui!' : 'Pengajuan berhasil disimpan!');
      router.push('/vendor/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat menyimpan data: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'Edit Pengajuan Vendor' : 'Tambah Pengajuan Vendor'}
      </h1>
      <VendorForm 
        onSubmit={handleSubmit} 
        initialData={vendor || {}} 
        buttonText={id ? 'Update Pengajuan' : 'Submit Pengajuan'} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
