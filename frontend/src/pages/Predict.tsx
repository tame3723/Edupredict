import React, { useState, useEffect } from 'react';
import { PredictionForm } from '../components/PredictionForm';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useApi } from '../hooks/useApi';
import { StudentData, PredictionResponse } from '../types/Student';
import { 
  ArrowLeft, 
  Download,
  Share2
} from 'lucide-react';

interface PredictProps {
  onPredictionComplete?: (results: PredictionResponse) => void;
  existingResults?: PredictionResponse | null;
  onNewPrediction?: () => void;
}

export const Predict: React.FC<PredictProps> = ({ 
  onPredictionComplete, 
  existingResults,
  onNewPrediction 
}) => {
  const [predictionResults, setPredictionResults] = useState<PredictionResponse | null>(existingResults || null);
  const [showResults, setShowResults] = useState(!!existingResults);
  const { predictPerformance, generateSampleData, loading, error } = useApi();

  useEffect(() => {
    if (existingResults) {
      setPredictionResults(existingResults);
      setShowResults(true);
    }
  }, [existingResults]);

  const handleFormSubmit = async (studentData: Partial<StudentData>) => {
    try {
      const results = await predictPerformance(studentData);
      setPredictionResults(results);
      setShowResults(true);
      onPredictionComplete?.(results);
    } catch (err) {
      console.error('Prediction failed:', err);
    }
  };

  const handleUseSampleData = async (sampleData: StudentData) => {
    try {
      const results = await predictPerformance(sampleData);
      setPredictionResults(results);
      setShowResults(true);
      onPredictionComplete?.(results);
    } catch (err) {
      console.error('Prediction failed:', err);
    }
  };

  const handleNewPrediction = () => {
    setShowResults(false);
    setPredictionResults(null);
    onNewPrediction?.();
  };

  const downloadResults = () => {
    if (!predictionResults) return;
    
    const dataStr = JSON.stringify(predictionResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edupredict-results-${predictionResults.request_id || Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading && !predictionResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Analyzing student data with AI..." />
          <p className="mt-4 text-gray-600">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {showResults ? (
            <div className="flex items-center justify-between">
              <button
                onClick={handleNewPrediction}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>New Prediction</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={downloadResults}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Results</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Student Performance Predictor
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Enter student information below to get AI-powered predictions, insights, 
                and personalized recommendations for academic success.
              </p>
            </div>
          )}
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

        {/* Content */}
        {showResults && predictionResults ? (
          <ResultsDashboard results={predictionResults} />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <PredictionForm 
              onSubmit={handleFormSubmit}
              loading={loading}
              onUseSample={handleUseSampleData}
            />
          </div>
        )}

        {/* Loading Overlay for Subsequent Predictions */}
        {loading && predictionResults && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <LoadingSpinner size="lg" text="Generating new prediction..." />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};