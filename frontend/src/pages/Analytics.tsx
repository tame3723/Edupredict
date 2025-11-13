import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp,
  Cpu,
  Database
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const { getModelInfo, healthCheck, loading, error } = useApi();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [info, health] = await Promise.all([
          getModelInfo(),
          healthCheck()
        ]);
        
        setModelInfo(info);
        setStats({
          model_loaded: health.model_loaded,
          status: health.status,
          timestamp: health.timestamp
        });
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading && !modelInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            System Analytics
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Monitor model performance, system health, and analytics insights
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <Cpu className="w-5 h-5 text-primary-500" />
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                stats?.status === 'healthy' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats?.status?.toUpperCase() || 'UNKNOWN'}
              </div>
              <div className="text-sm text-gray-500 mt-1">Backend Status</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Models Loaded</h3>
              <Database className="w-5 h-5 text-primary-500" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {(modelInfo?.model_info?.regression_models?.length || 0) + (modelInfo?.model_info?.classification_models?.length || 0)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Active Models</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              <Target className="w-5 h-5 text-primary-500" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {modelInfo?.model_info?.feature_count || 18}
              </div>
              <div className="text-sm text-gray-500 mt-1">Input Features</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Architecture</h3>
              <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">Ensemble</div>
              <div className="text-sm text-gray-500 mt-1">ML Approach</div>
            </div>
          </div>
        </div>

        {/* Model Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regression Models */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              <h3 className="text-xl font-semibold text-gray-900">Regression Models</h3>
            </div>
            
            <div className="space-y-4">
              {modelInfo?.model_info?.regression_models?.map((model: string) => (
                <div key={model} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{model}</span>
                  </div>
                  <span className="text-sm text-gray-500">Score Prediction</span>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-4">
                  No regression models loaded
                </div>
              )}
            </div>
          </div>

          {/* Classification Models */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="w-5 h-5 text-primary-500" />
              <h3 className="text-xl font-semibold text-gray-900">Classification Models</h3>
            </div>
            
            <div className="space-y-4">
              {modelInfo?.model_info?.classification_models?.map((model: string) => (
                <div key={model} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{model}</span>
                  </div>
                  <span className="text-sm text-gray-500">Performance Level</span>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-4">
                  No classification models loaded
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Training Results */}
        {modelInfo?.model_info?.training_results && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <h3 className="text-xl font-semibold text-gray-900">Model Performance</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(modelInfo.model_info.training_results).map(([model, results]: [string, any]) => (
                <div key={model} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 capitalize">{model.replace('_', ' ')}</h4>
                  <div className="space-y-2">
                    {Object.entries(results).map(([metric, value]: [string, any]) => (
                      <div key={metric} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{metric}:</span>
                        <span className="font-medium text-primary-600">
                          {typeof value === 'number' ? value.toFixed(3) : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">
                {stats?.timestamp ? new Date(stats.timestamp).toLocaleString() : 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Model Type:</span>
              <span className="font-medium">{modelInfo?.model_info?.type || 'Ensemble'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frontend Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};