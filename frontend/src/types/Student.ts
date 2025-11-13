export interface StudentData {
  // Cognitive Abilities
  cognitiveAbility: number;
  workingMemory: number;
  processingSpeed: number;
  verbalReasoning: number;
  quantitativeReasoning: number;
  
  // Academic Behaviors
  studyHoursDaily: number;
  attendanceRate: number;
  homeworkCompletion: number;
  classParticipation: number;
  assignmentQuality: number;
  noteTakingQuality: number;
  studyConsistency: number;
  academicSelfEfficacy: number;
  
  // Learning Strategies
  metacognitionSkills: number;
  criticalThinking: number;
  timeManagement: number;
  learningAdaptability: number;
  informationSynthesis: number;
  
  // Personal Wellbeing
  sleepHours: number;
  sleepQuality: number;
  motivationLevel: number;
  stressManagement: number;
  resilience: number;
  focusConcentration: number;
  procrastinationTendency: number;
  academicAnxiety: number;
  
  // Support & Environment
  peerAcademicSupport: number;
  facultySupport: number;
  learningEnvironmentQuality: number;
  technologyAccess: number;
  financialStability: number;
  
  // Background Info
  age: number;
  gender: string;
  firstGeneration: boolean;
  transferStudent: boolean;
  employmentHours: number;
  commuteTimeMinutes: number;
  extracurricularHours: number;
  academicMajor: string;
}

export interface PredictionResponse {
  success: boolean;
  predictions: {
    final_score: number;
    performance_level: 'Low' | 'Medium' | 'High' | 'Excellent';
    confidence: number;
    score_range: {
      min: number;
      max: number;
      range: number;
    };
    model_breakdown: {
      xgboost_score: number;
      catboost_score: number;
      ensemble_score: number;
    };
    improvement_potential?: number; // New field from enhanced dataset
  };
  insights: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    comparison: {
      predicted_vs_benchmark: number;
      performance_tier: string;
      percentile_estimate: number;
      benchmark_score: number;
      performance_gap_analysis: string;
    };
    performance_analysis: {
      current_level: string;
      predicted_score: number;
      score_interpretation: string;
      improvement_potential: {
        short_term_target: number;
        potential_gain: number;
        timeline: string;
        focus_area: string;
      };
    };
    cognitive_analysis?: { // New insights for cognitive factors
      strongest_abilities: string[];
      areas_for_development: string[];
      learning_style_suggestions: string[];
    };
  };
  feature_impact: {
    [key: string]: number;
  };
  recommendations: Recommendation[];
  timestamp: string;
  request_id?: string;
  academic_major_suggestions?: string[]; // New field
  study_strategy_recommendations?: string[]; // New field
}

export interface Recommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  current_value: any;
  target_value: any;
  improvement_area: string;
  estimated_improvement?: number; // Points improvement estimate
}