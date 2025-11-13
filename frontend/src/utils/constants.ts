// Form Field Interface
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'range';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description?: string;
  minLabel?: string;
  maxLabel?: string;
  unit?: string;
  placeholder?: string;
}

export const FORM_FIELDS: { [key: string]: FormField[] } = {
  cognitive: [
    { 
      name: 'cognitiveAbility', 
      label: 'Cognitive Ability Score', 
      type: 'number', 
      min: 70, 
      max: 130, 
      step: 1,
      description: 'General cognitive ability assessment score'
    },
    { 
      name: 'workingMemory', 
      label: 'Working Memory', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Poor',
      maxLabel: 'Excellent'
    },
    { 
      name: 'processingSpeed', 
      label: 'Processing Speed', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Slow',
      maxLabel: 'Fast'
    },
    { 
      name: 'verbalReasoning', 
      label: 'Verbal Reasoning', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Weak',
      maxLabel: 'Strong'
    },
    { 
      name: 'quantitativeReasoning', 
      label: 'Quantitative Reasoning', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Weak',
      maxLabel: 'Strong'
    },
  ],
  academic: [
    { 
      name: 'studyHoursDaily', 
      label: 'Daily Study Hours', 
      type: 'number', 
      min: 0, 
      max: 12, 
      step: 0.5,
      unit: 'hours'
    },
    { 
      name: 'attendanceRate', 
      label: 'Attendance Rate', 
      type: 'number', 
      min: 0, 
      max: 100, 
      step: 1,
      unit: '%'
    },
    { 
      name: 'homeworkCompletion', 
      label: 'Homework Completion', 
      type: 'number', 
      min: 0, 
      max: 100, 
      step: 1,
      unit: '%'
    },
    { 
      name: 'classParticipation', 
      label: 'Class Participation', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Low',
      maxLabel: 'High'
    },
    { 
      name: 'assignmentQuality', 
      label: 'Assignment Quality', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Poor',
      maxLabel: 'Excellent'
    },
    { 
      name: 'noteTakingQuality', 
      label: 'Note Taking Quality', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Poor',
      maxLabel: 'Excellent'
    },
    { 
      name: 'studyConsistency', 
      label: 'Study Consistency', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Inconsistent',
      maxLabel: 'Very Consistent'
    },
    { 
      name: 'academicSelfEfficacy', 
      label: 'Academic Self-Efficacy', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Low',
      maxLabel: 'High'
    },
  ],
  learning: [
    { 
      name: 'metacognitionSkills', 
      label: 'Metacognition Skills', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Basic',
      maxLabel: 'Advanced'
    },
    { 
      name: 'criticalThinking', 
      label: 'Critical Thinking', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Developing',
      maxLabel: 'Strong'
    },
    { 
      name: 'timeManagement', 
      label: 'Time Management', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Poor',
      maxLabel: 'Excellent'
    },
    { 
      name: 'learningAdaptability', 
      label: 'Learning Adaptability', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Rigid',
      maxLabel: 'Adaptable'
    },
    { 
      name: 'informationSynthesis', 
      label: 'Information Synthesis', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Weak',
      maxLabel: 'Strong'
    },
  ],
  wellbeing: [
    { 
      name: 'sleepHours', 
      label: 'Sleep Hours per Night', 
      type: 'number', 
      min: 4, 
      max: 12, 
      step: 0.5,
      unit: 'hours'
    },
    { 
      name: 'sleepQuality', 
      label: 'Sleep Quality', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Poor',
      maxLabel: 'Excellent'
    },
    { 
      name: 'motivationLevel', 
      label: 'Motivation Level', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Low',
      maxLabel: 'High'
    },
    { 
      name: 'stressManagement', 
      label: 'Stress Management', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Poor',
      maxLabel: 'Excellent'
    },
    { 
      name: 'resilience', 
      label: 'Resilience', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Low',
      maxLabel: 'High'
    },
    { 
      name: 'focusConcentration', 
      label: 'Focus & Concentration', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Poor',
      maxLabel: 'Excellent'
    },
    { 
      name: 'procrastinationTendency', 
      label: 'Procrastination Tendency', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Low',
      maxLabel: 'High'
    },
    { 
      name: 'academicAnxiety', 
      label: 'Academic Anxiety', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Low',
      maxLabel: 'High'
    },
  ],
  support: [
    { 
      name: 'peerAcademicSupport', 
      label: 'Peer Academic Support', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Low',
      maxLabel: 'High'
    },
    { 
      name: 'facultySupport', 
      label: 'Faculty Support', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Low',
      maxLabel: 'High'
    },
    { 
      name: 'learningEnvironmentQuality', 
      label: 'Learning Environment Quality', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Poor',
      maxLabel: 'Excellent'
    },
    { 
      name: 'technologyAccess', 
      label: 'Technology Access', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Limited',
      maxLabel: 'Excellent'
    },
    { 
      name: 'financialStability', 
      label: 'Financial Stability', 
      type: 'range', 
      min: 1, 
      max: 10,
      minLabel: 'Unstable',
      maxLabel: 'Very Stable'
    },
  ],
  background: [
    { 
      name: 'age', 
      label: 'Age', 
      type: 'number', 
      min: 16, 
      max: 30, 
      step: 1 
    },
    { 
      name: 'gender', 
      label: 'Gender', 
      type: 'select', 
      options: ['Male', 'Female', 'Other', 'Prefer not to say'] 
    },
    { 
      name: 'firstGeneration', 
      label: 'First Generation Student', 
      type: 'checkbox' 
    },
    { 
      name: 'transferStudent', 
      label: 'Transfer Student', 
      type: 'checkbox' 
    },
    { 
      name: 'employmentHours', 
      label: 'Weekly Employment Hours', 
      type: 'number', 
      min: 0, 
      max: 40, 
      step: 1,
      unit: 'hours'
    },
    { 
      name: 'commuteTimeMinutes', 
      label: 'Daily Commute Time', 
      type: 'number', 
      min: 0, 
      max: 180, 
      step: 5,
      unit: 'minutes'
    },
    { 
      name: 'extracurricularHours', 
      label: 'Weekly Extracurricular Hours', 
      type: 'number', 
      min: 0, 
      max: 20, 
      step: 1,
      unit: 'hours'
    },
    { 
      name: 'academicMajor', 
      label: 'Academic Major/Field', 
      type: 'select', 
      options: [
        'STEM', 
        'Humanities', 
        'Social Sciences', 
        'Business', 
        'Arts', 
        'Health Sciences', 
        'Education', 
        'Undecided'
      ] 
    },
  ]
} as const;

export const PERFORMANCE_COLORS = {
  Low: 'bg-red-500',
  Medium: 'bg-yellow-500',
  High: 'bg-green-500',
  Excellent: 'bg-blue-500'
} as const;

export const PERFORMANCE_GRADIENTS = {
  Low: 'from-red-500 to-red-600',
  Medium: 'from-yellow-500 to-yellow-600',
  High: 'from-green-500 to-green-600',
  Excellent: 'from-blue-500 to-blue-600'
} as const;