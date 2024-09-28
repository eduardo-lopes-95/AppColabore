import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

const SUPABASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Helper functions for common operations
export const supabaseHelper = {
  select: async (table, columns = '*', query = {}) => {
    return await supabase.from(table).select(columns).match(query);
  },

  insert: async (table, data) => {
    return await supabase.from(table).insert(data);
  },

  update: async (table, data, query) => {
    return await supabase.from(table).update(data).match(query);
  },

  upsert: async (table, data) => {
    return await supabase.from(table).upsert(data);
  },

  delete: async (table, query) => {
    return await supabase.from(table).delete().match(query);
  },

  rpc: async (functionName, params) => {
    return await supabase.rpc(functionName, params);
  },

  // Custom query builder
  customQuery: (table) => {
    return supabase.from(table);
  },

  // New functions for file upload
  uploadFile: async (bucket, path, file, fileOptions = {}) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, fileOptions);
    
    if (error) throw error;
    return data;
  },

  uploadFileFromUri: async (bucket, path, uri, fileOptions = {}) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      const file = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const decodedFile = Buffer.from(file, 'base64'); 
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, decodedFile, { contentType: fileOptions.contentType, ...fileOptions });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  getPublicUrl: (bucket, path) => {
    const { data, error } = supabase.storage.from(bucket).getPublicUrl(path);
    if (error) {
      console.error('Error getting public URL:', error);
      throw error;
    }
    return data?.publicUrl || null;
  },

  deleteFile: async (bucket, path) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
    return data;
  },

  listFiles: async (bucket, path = '') => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);
    
    if (error) throw error;
    return data;
  },
};
