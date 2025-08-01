import { useState, useCallback } from 'react';
import axiosInstance from '../axiosInstance';
import { UrlConfig } from '../ApiEndPoints';
import { useSyncLoading } from '@/hooks/useSyncLoading';

interface ExportParams {
  year?: string;
  siteID?: string;
  isTemplate?: string;
}

export const useExportCSV = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  useSyncLoading(isLoading); // Sync local loading with global loader

  const exportCSV = useCallback(async (params: ExportParams, apiPath?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const requestUrl = apiPath || UrlConfig.EXPORT_BUDGET_CSV;
      const response = await axiosInstance.get(requestUrl, {
        params,
        responseType: 'blob',
      });

      // Extract filename from Content-Disposition header
      const contentDisposition =
        response.headers['content-disposition'] ||
        response.headers['Content-Disposition'];
      let filename = '';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^";\r\n]+)"?/i);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      // Remove fallback filename: if no filename, let browser use default

      // Create Blob and trigger download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      if (filename) link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return response;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to export CSV';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      setIsSuccess(true);
    }
  }, []);

  return {
    isLoading,
    error,
    exportCSV,
    isSuccess,
  };
};
