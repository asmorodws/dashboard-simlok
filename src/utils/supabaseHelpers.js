import { supabase } from './supabaseClient';

/**
 * Create a new record in a Supabase table
 * @param {string} table - The table name
 * @param {object} data - The data to insert
 * @returns {Promise} - The Supabase response
 */
export const createRecord = async (table, data) => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    
    if (error) throw error;
    
    return { data: result, error: null };
  } catch (error) {
    console.error(`Error creating record in ${table}:`, error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Update an existing record in a Supabase table
 * @param {string} table - The table name
 * @param {string} id - The record ID
 * @param {object} data - The data to update
 * @returns {Promise} - The Supabase response
 */
export const updateRecord = async (table, id, data) => {
  try {
    // Add updated_at timestamp if not provided
    if (!data.updated_at) {
      data.updated_at = new Date();
    }
    
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return { data: result, error: null };
  } catch (error) {
    console.error(`Error updating record in ${table}:`, error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Delete a record from a Supabase table
 * @param {string} table - The table name
 * @param {string} id - The record ID
 * @returns {Promise} - The Supabase response
 */
export const deleteRecord = async (table, id) => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting record from ${table}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get a single record by ID
 * @param {string} table - The table name
 * @param {string} id - The record ID
 * @returns {Promise} - The Supabase response
 */
export const getRecordById = async (table, id) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching record from ${table}:`, error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Get multiple records with optional filters
 * @param {string} table - The table name
 * @param {object} options - Query options (filters, order, etc.)
 * @returns {Promise} - The Supabase response
 */
export const getRecords = async (table, options = {}) => {
  try {
    let query = supabase.from(table).select('*');
    
    // Apply filters if provided
    if (options.filters) {
      for (const filter of options.filters) {
        const { column, operator, value } = filter;
        query = query[operator](column, value);
      }
    }
    
    // Apply ordering if provided
    if (options.order) {
      const { column, ascending = false } = options.order;
      query = query.order(column, { ascending });
    }
    
    // Apply pagination if provided
    if (options.pagination) {
      const { from, to } = options.pagination;
      query = query.range(from, to);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching records from ${table}:`, error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Upload a file to Supabase Storage
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The file path within the bucket
 * @param {File} file - The file to upload
 * @returns {Promise} - The Supabase response
 */
export const uploadFile = async (bucket, path, file) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Error uploading file to ${bucket}/${path}:`, error.message);
    return { data: null, error: error.message };
  }
};

/**
 * Delete a file from Supabase Storage
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The file path within the bucket
 * @returns {Promise} - The Supabase response
 */
export const deleteFile = async (bucket, path) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting file from ${bucket}/${path}:`, error.message);
    return { success: false, error: error.message };
  }
};
