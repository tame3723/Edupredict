import React from 'react';
import { Recommendation } from '../types/Student';
import { 
  TrendingUp, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUp
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Target className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-4 h-full flex flex-col ${getPriorityColor(recommendation.priority)}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getPriorityIcon(recommendation.priority)}
          <span className={`text-xs font-medium uppercase tracking-wide ${
            recommendation.priority === 'high' ? 'text-red-600' :
            recommendation.priority === 'medium' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {recommendation.priority} Priority
          </span>
        </div>
        <div className="px-2 py-1 bg-white rounded border text-xs font-medium text-gray-600">
          {recommendation.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">{recommendation.title}</h4>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{recommendation.description}</p>
        
        {/* Improvement Details */}
        {(recommendation.current_value || recommendation.target_value) && (
          <div className="space-y-2 text-xs mb-3 bg-white/50 rounded p-2">
            {recommendation.current_value && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current:</span>
                <span className="font-medium text-gray-800">{recommendation.current_value}</span>
              </div>
            )}
            {recommendation.target_value && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Target:</span>
                <span className="font-medium text-green-600 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  {recommendation.target_value}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center space-x-1 text-xs text-primary-600 font-medium pt-2 border-t border-gray-200">
        <TrendingUp className="w-3 h-3" />
        <span>{recommendation.impact}</span>
      </div>
    </div>
  );
};