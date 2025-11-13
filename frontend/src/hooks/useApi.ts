import { useState } from 'react';
import { StudentData, PredictionResponse } from '../types/Student';

const API_BASE_URL = 'http://localhost:5000/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Remove the success check since some endpoints don't have it
      if (data.success === false) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const predictPerformance = (studentData: Partial<StudentData>) => {
    return makeRequest<PredictionResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  };

  const generateSampleData = (count: number = 5) => {
    return makeRequest<{ students: StudentData[] }>(`/generate-sample-data?count=${count}`);
  };

  const getModelInfo = () => {
    return makeRequest<any>('/model-info');
  };

  const healthCheck = () => {
    return makeRequest<any>('/health');
  };

  return {
    loading,
    error,
    predictPerformance,
    generateSampleData,
    getModelInfo,
    healthCheck,
  };
};