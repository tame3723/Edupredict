import React from 'react';
import { PredictionResponse } from '../types/Student';
import { RecommendationCard } from './RecommendationCard';
import { AnalyticsCharts } from './AnalyticsCharts';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Lightbulb,
  Award,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { PERFORMANCE_COLORS, PERFORMANCE_GRADIENTS } from '../utils/constants';

interface ResultsDashboardProps {
  results: PredictionResponse;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results }) => {
  const { predictions, insights, feature_impact, recommendations } = results;

  const getPerformanceIcon = (level: string) => {
    switch (level) {
      case 'High': return <Award className="w-6 h-6" />;
      case 'Medium': return <TrendingUp className="w-6 h-6" />;
      case 'Low': return <AlertTriangle className="w-6 h-6" />;
      default: return <BarChart3 className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Final Score */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Predicted Score</h3>
            <Target className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold bg-gradient-to-r ${PERFORMANCE_GRADIENTS[predictions.performance_level]} bg-clip-text text-transparent`}>
              {predictions.final_score}/100
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Range: {predictions.score_range.min} - {predictions.score_range.max}
            </div>
          </div>
        </div>

        {/* Performance Level */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Level</h3>
            {getPerformanceIcon(predictions.performance_level)}
          </div>
          <div className="text-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${PERFORMANCE_COLORS[predictions.performance_level]} text-white`}>
              {predictions.performance_level}
            </span>
            <div className="text-sm text-gray-500 mt-2">
              Confidence: {predictions.confidence}%
            </div>
          </div>
        </div>

        {/* Improvement Potential */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Improvement Potential</h3>
            <Zap className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              +{insights.performance_analysis?.improvement_potential?.potential_gain || 5}+
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Points possible in {insights.performance_analysis?.improvement_potential?.timeline || '4-6 weeks'}
            </div>
          </div>
        </div>

        {/* Next Target */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Next Target</h3>
            <Target className="w-5 h-5 text-primary-500" />
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {insights.performance_analysis?.improvement_potential?.short_term_target || 75}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {insights.performance_analysis?.improvement_potential?.focus_area || 'Continued improvement'}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="w-5 h-5 text-primary-500" />
          <h3 className="text-xl font-semibold text-gray-900">Performance Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Score Interpretation</h4>
            <p className="text-gray-700 bg-blue-50 rounded-lg p-4">
              {insights.performance_analysis?.score_interpretation || 'Solid performance with room for growth'}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Benchmark Comparison</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Your Score:</span>
                <span className="font-semibold">{predictions.final_score}</span>
              </div>
              <div className="flex justify-between">
                <span>Benchmark ({predictions.performance_level}):</span>
                <span className="font-semibold">{insights.comparison?.benchmark_score || 70}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Difference:</span>
                <span className={`font-semibold ${
                  (insights.comparison?.predicted_vs_benchmark || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {insights.comparison?.predicted_vs_benchmark >= 0 ? '+' : ''}{insights.comparison?.predicted_vs_benchmark}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights & Feature Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detailed Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Lightbulb className="w-5 h-5 text-primary-500" />
            <h3 className="text-xl font-semibold text-gray-900">Detailed Analysis</h3>
          </div>
          
          <div className="space-y-6">
            {/* Strengths */}
            {insights.strengths.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Key Strengths
                </h4>
                <ul className="space-y-2">
                  {insights.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-3 text-sm text-gray-700 bg-green-50 rounded-lg p-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {insights.weaknesses.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {insights.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start space-x-3 text-sm text-gray-700 bg-red-50 rounded-lg p-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Opportunities */}
            {insights.opportunities.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Growth Opportunities
                </h4>
                <ul className="space-y-2">
                  {insights.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start space-x-3 text-sm text-gray-700 bg-blue-50 rounded-lg p-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Feature Impact */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <h3 className="text-xl font-semibold text-gray-900">Key Influencing Factors</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(feature_impact)
              .sort(([, a], [, b]) => b - a)
              .map(([feature, impact]) => (
                <div key={feature} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-medium">{feature}</span>
                    <span className="font-semibold text-primary-600">{impact}% impact</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${impact}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts predictions={predictions} featureImpact={feature_impact} />

      {/* Actionable Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="w-5 h-5 text-primary-500" />
            <h3 className="text-xl font-semibold text-gray-900">Actionable Recommendations</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};