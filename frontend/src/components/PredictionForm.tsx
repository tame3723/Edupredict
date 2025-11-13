import React, { useState } from 'react';
import { StudentData } from '../types/Student';
import { FORM_FIELDS } from '../utils/constants';
import { LoadingSpinner } from './LoadingSpinner';

interface PredictionFormProps {
  onSubmit: (data: Partial<StudentData>) => void;
  loading: boolean;
  onUseSample?: (data: StudentData) => void;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ 
  onSubmit, 
  loading,
  onUseSample 
}) => {
  const [formData, setFormData] = useState<Partial<StudentData>>({});
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    { 
      title: 'Cognitive Abilities', 
      fields: FORM_FIELDS.cognitive 
    },
    { 
      title: 'Academic Behaviors', 
      fields: FORM_FIELDS.academic 
    },
    { 
      title: 'Learning Strategies', 
      fields: FORM_FIELDS.learning 
    },
    { 
      title: 'Personal Wellbeing', 
      fields: FORM_FIELDS.wellbeing 
    },
    { 
      title: 'Support & Environment', 
      fields: FORM_FIELDS.support 
    },
    { 
      title: 'Background Info', 
      fields: FORM_FIELDS.background 
    },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isCurrentSectionValid = () => {
    const currentFields = sections[currentSection].fields;
    return currentFields.every(field => {
      const value = formData[field.name as keyof StudentData];
      return value !== undefined && value !== '' && value !== null;
    });
  };

  const canProceed = currentSection < sections.length - 1 && isCurrentSectionValid();
  const canSubmit = currentSection === sections.length - 1 && isCurrentSectionValid();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className={`text-sm font-medium text-center ${
                index <= currentSection ? 'text-primary-600' : 'text-gray-400'
              }`}
              style={{ width: `${100 / sections.length}%` }}
            >
              {section.title}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Section Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections[currentSection].fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.description && (
                  <span className="block text-xs text-gray-500 font-normal mt-1">
                    {field.description}
                  </span>
                )}
              </label>
              
              {field.type === 'select' ? (
                <select
                  value={formData[field.name as keyof StudentData] as string || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={!!formData[field.name as keyof StudentData]}
                    onChange={(e) => handleInputChange(field.name, e.target.checked)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
              ) : field.type === 'range' ? (
                <div className="space-y-2">
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={formData[field.name as keyof StudentData] as number || field.min}
                    onChange={(e) => handleInputChange(field.name, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{field.minLabel || field.min}</span>
                    <span className="font-medium text-primary-600">
                      {formData[field.name as keyof StudentData] || field.min}
                      {field.unit && ` ${field.unit}`}
                    </span>
                    <span>{field.maxLabel || field.max}</span>
                  </div>
                </div>
              ) : (
                <input
                  type={field.type}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={formData[field.name as keyof StudentData] as number || ''}
                  onChange={(e) => handleInputChange(field.name, 
                    field.type === 'number' ? parseFloat(e.target.value) : e.target.value
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
            disabled={currentSection === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-4">
            {onUseSample && (
              <button
                type="button"
                onClick={() => onUseSample({
                  // Cognitive Abilities
                  cognitiveAbility: 105,
                  workingMemory: 7,
                  processingSpeed: 7,
                  verbalReasoning: 7,
                  quantitativeReasoning: 7,
                  
                  // Academic Behaviors
                  studyHoursDaily: 5.5,
                  attendanceRate: 85,
                  homeworkCompletion: 80,
                  classParticipation: 7,
                  assignmentQuality: 7,
                  noteTakingQuality: 6,
                  studyConsistency: 6,
                  academicSelfEfficacy: 7,
                  
                  // Learning Strategies
                  metacognitionSkills: 6,
                  criticalThinking: 7,
                  timeManagement: 6,
                  learningAdaptability: 7,
                  informationSynthesis: 6,
                  
                  // Personal Wellbeing
                  sleepHours: 7,
                  sleepQuality: 7,
                  motivationLevel: 7,
                  stressManagement: 6,
                  resilience: 7,
                  focusConcentration: 7,
                  procrastinationTendency: 5,
                  academicAnxiety: 4,
                  
                  // Support & Environment
                  peerAcademicSupport: 6,
                  facultySupport: 6,
                  learningEnvironmentQuality: 7,
                  technologyAccess: 8,
                  financialStability: 6,
                  
                  // Background Info
                  age: 20,
                  gender: 'Male',
                  firstGeneration: false,
                  transferStudent: false,
                  employmentHours: 10,
                  commuteTimeMinutes: 25,
                  extracurricularHours: 5,
                  academicMajor: 'STEM'
                })}
                className="px-6 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50"
              >
                Use Sample Data
              </button>
            )}

            {canProceed ? (
              <button
                type="button"
                onClick={() => setCurrentSection(prev => prev + 1)}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Next
              </button>
            ) : canSubmit ? (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading && <LoadingSpinner size="sm" text="" />}
                <span>Predict Performance</span>
              </button>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
};