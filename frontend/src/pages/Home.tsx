import React from 'react';
import { 
  BookOpen, 
  BarChart3, 
  Target, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface HomeProps {
  onGetStarted: () => void;
}

export const Home: React.FC<HomeProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning models predict student performance with high accuracy using ensemble methods.'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Detailed Analytics',
      description: 'Comprehensive insights and feature importance analysis to understand what drives student success.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Personalized Recommendations',
      description: 'Actionable suggestions tailored to individual student profiles for maximum improvement.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Analysis',
      description: 'Instant predictions and insights powered by our trained ensemble models.'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Enter Student Data',
      description: 'Provide academic, lifestyle, and demographic information'
    },
    {
      number: '2',
      title: 'AI Analysis',
      description: 'Our models analyze multiple factors simultaneously'
    },
    {
      number: '3',
      title: 'Get Insights',
      description: 'Receive detailed predictions and recommendations'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-primary-600 font-medium mb-8 border border-primary-200">
              <Zap className="w-4 h-4" />
              <span>Powered by XGBoost + LightGBM + CatBoost</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Predict Student
              <span className="block bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                Performance
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Harness the power of ensemble machine learning to predict academic success, 
              identify improvement areas, and provide personalized recommendations for students.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group bg-primary-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <span>Start Predicting</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose EduPredict?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge machine learning with educational expertise 
            to deliver actionable insights for student success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-primary-500 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple three-step process to get AI-powered insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">18+</div>
            <div className="text-gray-600">Factors Analyzed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">3</div>
            <div className="text-gray-600">ML Models</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-2">∞</div>
            <div className="text-gray-600">Possibilities</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Student Outcomes?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join educators and institutions using AI to enhance student success
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Predicting Now
          </button>
        </div>
      </div>
    </div>
  );
};