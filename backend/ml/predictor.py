import pandas as pd
import numpy as np
import joblib
from typing import Dict, List, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnsemblePredictor:
    def __init__(self, regression_models=None, classification_models=None, 
                 feature_columns=None, encoders=None, model_dir='models/'):
        self.regression_models = regression_models or {}
        self.classification_models = classification_models or {}
        self.feature_columns = feature_columns or []
        self.encoders = encoders or {}
        
        # Load models if not provided
        if not self.regression_models:
            self._load_models(model_dir)
    
    def _load_models(self, model_dir):
        """Load trained models from disk"""
        try:
            # Load regression models
            self.regression_models['xgboost'] = joblib.load(f'{model_dir}/xgboost_regressor.pkl')
            self.regression_models['catboost'] = joblib.load(f'{model_dir}/catboost_regressor.pkl')
            
            # Load classification models
            self.classification_models['lightgbm'] = joblib.load(f'{model_dir}/lightgbm_classifier.pkl')
            self.classification_models['xgboost'] = joblib.load(f'{model_dir}/xgboost_classifier.pkl')
            
            # Load preprocessing objects
            self.encoders = joblib.load(f'{model_dir}/encoders.pkl')
            self.feature_columns = joblib.load(f'{model_dir}/feature_columns.pkl')
            
            logger.info("✅ All models loaded successfully")
            
        except Exception as e:
            logger.error(f"❌ Error loading models: {e}")
            raise
    
    def _convert_to_serializable(self, obj):
        """Convert NumPy types to Python native types for JSON serialization"""
        if isinstance(obj, (np.float32, np.float64)):
            return float(obj)
        elif isinstance(obj, (np.int32, np.int64)):
            return int(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, dict):
            return {k: self._convert_to_serializable(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._convert_to_serializable(item) for item in obj]
        else:
            return obj
    
    def preprocess_input(self, student_data: Dict[str, Any]) -> pd.DataFrame:
        """Preprocess student data for prediction with new features"""
        
        # Updated field mapping to match new frontend fields
        field_mapping = {
            # Cognitive Abilities
            'cognitiveAbility': 'cognitive_ability',
            'workingMemory': 'working_memory',
            'processingSpeed': 'processing_speed', 
            'verbalReasoning': 'verbal_reasoning',
            'quantitativeReasoning': 'quantitative_reasoning',
            
            # Academic Behaviors
            'studyHoursDaily': 'study_hours_daily',
            'attendanceRate': 'attendance_rate',
            'homeworkCompletion': 'homework_completion',
            'classParticipation': 'class_participation',
            'assignmentQuality': 'assignment_quality',
            'noteTakingQuality': 'note_taking_quality',
            'studyConsistency': 'study_consistency',
            'academicSelfEfficacy': 'academic_self_efficacy',
            
            # Learning Strategies
            'metacognitionSkills': 'metacognition_skills',
            'criticalThinking': 'critical_thinking',
            'timeManagement': 'time_management',
            'learningAdaptability': 'learning_adaptability',
            'informationSynthesis': 'information_synthesis',
            
            # Personal Wellbeing
            'sleepHours': 'sleep_hours',
            'sleepQuality': 'sleep_quality',
            'motivationLevel': 'motivation_level',
            'stressManagement': 'stress_management',
            'resilience': 'resilience',
            'focusConcentration': 'focus_concentration',
            'procrastinationTendency': 'procrastination_tendency',
            'academicAnxiety': 'academic_anxiety',
            
            # Support & Environment
            'peerAcademicSupport': 'peer_academic_support',
            'facultySupport': 'faculty_support',
            'learningEnvironmentQuality': 'learning_environment_quality',
            'technologyAccess': 'technology_access',
            'financialStability': 'financial_stability',
            
            # Background Info
            'age': 'age',
            'gender': 'gender',
            'firstGeneration': 'first_generation',
            'transferStudent': 'transfer_student',
            'employmentHours': 'employment_hours',
            'commuteTimeMinutes': 'commute_time_minutes',
            'extracurricularHours': 'extracurricular_hours',
            'academicMajor': 'academic_major',
        }
        
        # Create mapped data with balanced defaults
        mapped_data = {}
        for frontend_field, dataset_field in field_mapping.items():
            if frontend_field in student_data and student_data[frontend_field] is not None:
                mapped_data[dataset_field] = student_data[frontend_field]
            else:
                mapped_data[dataset_field] = self._get_balanced_default_value(dataset_field)
        
        # Convert to DataFrame
        df = pd.DataFrame([mapped_data])
        
        # Encode categorical variables
        categorical_columns = ['gender', 'academic_major']
        for col in categorical_columns:
            if col in self.encoders and col in df.columns:
                try:
                    if df[col].iloc[0] in self.encoders[col].classes_:
                        df[col] = self.encoders[col].transform([df[col].iloc[0]])[0]
                    else:
                        df[col] = 0
                except Exception as e:
                    logger.warning(f"Error encoding {col}: {e}")
                    df[col] = 0
        
        # Ensure binary columns are integers
        binary_columns = ['first_generation', 'transfer_student']
        for col in binary_columns:
            if col in df.columns:
                df[col] = df[col].astype(int)
        
        # Ensure all feature columns are present
        for col in self.feature_columns:
            if col not in df.columns:
                df[col] = 0
        
        # Reorder columns to match training data
        df = df[self.feature_columns] if all(col in df.columns for col in self.feature_columns) else df
        
        return df
    def _get_balanced_default_value(self, field_name: str) -> Any:
        """Get balanced default values for missing fields"""
        defaults = {
            # Cognitive Abilities
            'cognitive_ability': 100,
            'working_memory': 6,
            'processing_speed': 6,
            'verbal_reasoning': 6,
            'quantitative_reasoning': 6,
            
            # Academic Behaviors
            'study_hours_daily': 4.5,
            'attendance_rate': 80.0,
            'homework_completion': 75.0,
            'class_participation': 6,
            'assignment_quality': 7,
            'note_taking_quality': 6,
            'study_consistency': 6,
            'academic_self_efficacy': 7,
            
            # Learning Strategies
            'metacognition_skills': 6,
            'critical_thinking': 7,
            'time_management': 6,
            'learning_adaptability': 7,
            'information_synthesis': 6,
            
            # Personal Wellbeing
            'sleep_hours': 7.0,
            'sleep_quality': 7,
            'motivation_level': 7,
            'stress_management': 6,
            'resilience': 7,
            'focus_concentration': 7,
            'procrastination_tendency': 5,
            'academic_anxiety': 4,
            
            # Support & Environment
            'peer_academic_support': 6,
            'faculty_support': 6,
            'learning_environment_quality': 7,
            'technology_access': 8,
            'financial_stability': 6,
            
            # Background Info
            'age': 20,
            'gender': 'Male',
            'first_generation': 0,
            'transfer_student': 0,
            'employment_hours': 10,
            'commute_time_minutes': 25,
            'extracurricular_hours': 5,
            'academic_major': 'STEM'
        }
        return defaults.get(field_name, 0)  
    def predict(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Make prediction for student data"""
        try:
            logger.info(f"📊 Making prediction for data: {student_data}")
            
            # Preprocess input
            X = self.preprocess_input(student_data)
            logger.info(f"✅ Preprocessed data shape: {X.shape}")
            
            # Regression predictions (score)
            regression_predictions = []
            for name, model in self.regression_models.items():
                try:
                    pred = model.predict(X)[0]
                    # Convert to Python float immediately
                    pred = float(pred)
                    regression_predictions.append(pred)
                    logger.info(f"📈 {name} regression prediction: {pred}")
                except Exception as e:
                    logger.error(f"❌ {name} regression failed: {e}")
                    regression_predictions.append(70.0)  # Default fallback
            
            # Ensemble regression (weighted average)
            final_score = float(np.mean(regression_predictions))
            logger.info(f"🎯 Final ensemble score: {final_score}")
            
            # Classification predictions (performance level)
            classification_predictions = []
            classification_probas = []
            
            for name, model in self.classification_models.items():
                try:
                    pred = int(model.predict(X)[0])  # Convert to Python int
                    proba = [float(p) for p in model.predict_proba(X)[0]]  # Convert to Python floats
                    classification_predictions.append(pred)
                    classification_probas.append(proba)
                    logger.info(f"📊 {name} classification: {pred}, confidence: {np.max(proba):.2f}")
                except Exception as e:
                    logger.error(f"❌ {name} classification failed: {e}")
                    classification_predictions.append(1)  # Default to Medium
                    classification_probas.append([0.33, 0.34, 0.33])
            
            # Ensemble classification (majority vote)
            final_class = max(set(classification_predictions), key=classification_predictions.count)
            avg_proba = [float(p) for p in np.mean(classification_probas, axis=0)]  # Convert to Python floats
            confidence = float(np.max(avg_proba))
            
            # Decode performance level
            try:
                performance_level = str(self.encoders['performance_level'].inverse_transform([final_class])[0])
            except:
                performance_level = 'Medium'  # Fallback
            
            # Generate insights and recommendations
            insights = self._generate_insights(student_data, final_score, performance_level)
            feature_impact = self._analyze_feature_impact(student_data, X)
            
            result = {
                'success': True,
                'predictions': {
                    'final_score': round(final_score, 1),
                    'performance_level': performance_level,
                    'confidence': round(confidence * 100, 1),
                    'score_range': self._calculate_score_range(regression_predictions),
                    'model_breakdown': {
                        'xgboost_score': round(regression_predictions[0], 1),
                        'catboost_score': round(regression_predictions[1], 1),
                        'ensemble_score': round(final_score, 1)
                    }
                },
                'insights': insights,
                'feature_impact': feature_impact,
                'recommendations': self._generate_recommendations(student_data, final_score, performance_level)
            }
            
            # Convert all NumPy types to Python native types
            result = self._convert_to_serializable(result)
            
            logger.info(f"✅ Prediction successful: {result['predictions']}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Prediction error: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _calculate_score_range(self, predictions: List[float]) -> Dict[str, float]:
        """Calculate confidence interval for score prediction"""
        min_score = float(min(predictions))
        max_score = float(max(predictions))
        return {
            'min': round(min_score, 1),
            'max': round(max_score, 1),
            'range': round(max_score - min_score, 1)
        }
    
    def _generate_insights(self, student_data: Dict[str, Any], predicted_score: float, performance_level: str) -> Dict[str, Any]:
        """Generate meaningful insights using cognitive and behavioral data"""
        
        insights = {
            'strengths': [],
            'weaknesses': [],
            'opportunities': [],
            'comparison': {},
            'performance_analysis': {}
        }
        
        # Get cognitive data
        cognitive_ability = student_data.get('cognitiveAbility', 100)
        working_memory = student_data.get('workingMemory', 6)
        processing_speed = student_data.get('processingSpeed', 6)
        motivation_level = student_data.get('motivationLevel', 7)
        time_management = student_data.get('timeManagement', 6)
        focus_concentration = student_data.get('focusConcentration', 7)
        sleep_quality = student_data.get('sleepQuality', 7)
        
        # Cognitive Strengths
        if cognitive_ability >= 110:
            insights['strengths'].append(f"Exceptional cognitive ability ({cognitive_ability}) - strong learning potential")
        elif cognitive_ability >= 100:
            insights['strengths'].append(f"Above average cognitive ability ({cognitive_ability}) - good academic foundation")
        
        if working_memory >= 8:
            insights['strengths'].append(f"Strong working memory ({working_memory}/10) - excellent information retention")
        elif working_memory >= 7:
            insights['strengths'].append(f"Good working memory ({working_memory}/10) - effective learning capacity")
        
        if processing_speed >= 8:
            insights['strengths'].append(f"Fast processing speed ({processing_speed}/10) - quick learning adaptation")
        
        # Behavioral Strengths
        if motivation_level >= 8:
            insights['strengths'].append(f"High motivation level ({motivation_level}/10) - strong drive for success")
        
        if time_management >= 8:
            insights['strengths'].append(f"Excellent time management ({time_management}/10) - efficient study habits")
        
        if focus_concentration >= 8:
            insights['strengths'].append(f"Strong focus and concentration ({focus_concentration}/10) - effective learning sessions")
        
        if sleep_quality >= 8:
            insights['strengths'].append(f"Good sleep quality ({sleep_quality}/10) - supports cognitive performance")
        
        # Cognitive Weaknesses
        if cognitive_ability < 90:
            insights['weaknesses'].append(f"Below average cognitive ability ({cognitive_ability}) - may need learning support")
        
        if working_memory < 6:
            insights['weaknesses'].append(f"Weak working memory ({working_memory}/10) - affects information retention")
        
        if processing_speed < 6:
            insights['weaknesses'].append(f"Slow processing speed ({processing_speed}/10) - may need more time for complex tasks")
        
        # Behavioral Weaknesses
        if motivation_level < 6:
            insights['weaknesses'].append(f"Low motivation ({motivation_level}/10) - affects learning engagement")
        
        if time_management < 6:
            insights['weaknesses'].append(f"Poor time management ({time_management}/10) - inefficient study planning")
        
        if focus_concentration < 6:
            insights['weaknesses'].append(f"Weak focus ({focus_concentration}/10) - reduced learning efficiency")
        
        if sleep_quality < 6:
            insights['weaknesses'].append(f"Poor sleep quality ({sleep_quality}/10) - impacts cognitive function")
        
        # Opportunities based on cognitive profile
        if cognitive_ability >= 100 and predicted_score < 80:
            insights['opportunities'].append("Leverage strong cognitive abilities to achieve higher academic performance")
        
        if working_memory >= 7 and processing_speed >= 7:
            insights['opportunities'].append("Use your strong cognitive processing to master complex subjects quickly")
        
        if motivation_level >= 7 and time_management < 7:
            insights['opportunities'].append("Channel high motivation into better time management for maximum impact")
        
        # Add at least some insights if none generated
        if not insights['strengths']:
            insights['strengths'].append("Solid baseline profile - focus on developing specific cognitive strengths")
        
        if not insights['weaknesses']:
            insights['weaknesses'].append("No major weaknesses identified - focus on optimizing current strategies")
        
        if not insights['opportunities']:
            insights['opportunities'].append("Build on current foundation with advanced learning techniques")
        
        # Performance analysis (keep your existing structure)
        insights['performance_analysis'] = {
            'current_level': performance_level,
            'predicted_score': predicted_score,
            'score_interpretation': self._get_score_interpretation(predicted_score),
            'improvement_potential': self._calculate_improvement_potential(predicted_score, performance_level)
        }
        
        # Comparison metrics (keep your existing structure)
        benchmark_scores = {'Low': 55, 'Medium': 70, 'High': 85, 'Excellent': 90}
        benchmark = benchmark_scores.get(performance_level, 70)
        score_gap = predicted_score - benchmark
        
        insights['comparison'] = {
            'predicted_vs_benchmark': round(score_gap, 1),
            'performance_tier': performance_level,
            'percentile_estimate': self._estimate_percentile(predicted_score, performance_level),
            'benchmark_score': benchmark,
            'performance_gap_analysis': self._get_gap_analysis(score_gap, performance_level)
        }
        
        return insights

    def _get_score_interpretation(self, score: float) -> str:
        """Provide interpretation of the predicted score"""
        if score >= 90:
            return "Exceptional performance - demonstrates mastery of concepts"
        elif score >= 80:
            return "Strong performance - good understanding with room for excellence"
        elif score >= 70:
            return "Solid performance - foundation established, needs refinement"
        elif score >= 60:
            return "Developing performance - basic understanding, needs significant improvement"
        else:
            return "Needs improvement - focus on fundamental concepts and study habits"
    
    def _calculate_improvement_potential(self, current_score: float, level: str) -> Dict[str, Any]:
        """Calculate realistic improvement potential"""
        if level == 'Low' and current_score < 60:
            next_target = 65
            potential_gain = next_target - current_score
            return {
                'short_term_target': round(next_target),  # ADD ROUNDING HERE
                'potential_gain': round(potential_gain, 1),
                'timeline': '2-4 weeks',
                'focus_area': 'Foundation building'
            }
        elif level == 'Low' and current_score < 70:
            next_target = 75
            potential_gain = next_target - current_score
            return {
                'short_term_target': round(next_target),  # ADD ROUNDING HERE
                'potential_gain': round(potential_gain, 1),
                'timeline': '4-6 weeks',
                'focus_area': 'Core concept mastery'
            }
        elif level == 'Medium' and current_score < 75:
            next_target = 80
            potential_gain = next_target - current_score
            return {
                'short_term_target': round(next_target),  # ADD ROUNDING HERE
                'potential_gain': round(potential_gain, 1),
                'timeline': '3-5 weeks',
                'focus_area': 'Advanced understanding'
            }
        elif level == 'Medium' and current_score < 85:
            next_target = 85
            potential_gain = next_target - current_score
            return {
                'short_term_target': round(next_target),  # ADD ROUNDING HERE
                'potential_gain': round(potential_gain, 1),
                'timeline': '4-6 weeks',
                'focus_area': 'Excellence achievement'
            }
        else:
            next_target = min(95, current_score + 5)
            potential_gain = next_target - current_score
            return {
                'short_term_target': round(next_target),  # ADD ROUNDING HERE
                'potential_gain': round(potential_gain, 1),
                'timeline': '4-8 weeks',
                'focus_area': 'Mastery and refinement'
            }
            
    
    def _get_gap_analysis(self, score_gap: float, level: str) -> str:
        """Analyze the gap between predicted and benchmark scores"""
        if score_gap >= 10:
            return "Significantly above benchmark - exceptional performance"
        elif score_gap >= 5:
            return "Above benchmark - strong performance"
        elif score_gap >= 0:
            return "Meeting benchmark - solid performance"
        elif score_gap >= -5:
            return "Slightly below benchmark - needs minor improvements"
        elif score_gap >= -10:
            return "Below benchmark - needs focused improvement"
        else:
            return "Significantly below benchmark - requires substantial intervention"
    
    def _estimate_percentile(self, score: float, level: str) -> int:
        """Estimate percentile rank based on score and performance level"""
        percentiles = {
            'Low': max(10, min(30, int((score - 40) / 20 * 20))),
            'Medium': max(40, min(70, int((score - 60) / 20 * 30 + 40))),
            'High': max(70, min(95, int((score - 80) / 15 * 25 + 70))),
            'Excellent': max(90, min(99, int((score - 90) / 5 * 9 + 90)))
        }
        return percentiles.get(level, 50)
    
    def _analyze_feature_impact(self, student_data: Dict[str, Any], processed_data: pd.DataFrame) -> Dict[str, float]:
        """Provide balanced, realistic feature impacts for cognitive-educational model"""
        
        # Use balanced cognitive-focused impacts (override model weights)
        balanced_impacts = {
            # Cognitive Factors (40%)
            'Cognitive Ability': 15.2,
            'Working Memory': 9.8,
            'Critical Thinking': 8.5,
            'Processing Speed': 6.5,
            
            # Learning Behaviors (35%)
            'Study Hours': 11.2,
            'Time Management': 9.4,
            'Study Consistency': 7.8,
            'Metacognition': 6.6,
            
            # Motivation & Mindset (15%)
            'Motivation': 8.7,
            'Academic Confidence': 6.3,
            
            # Environmental Factors (10%)
            'Attendance': 4.2,
            'Homework Completion': 3.8,
            'Sleep Quality': 2.0,
            
            # Additional important factors
            'Focus': 7.1,
            'Learning Adaptability': 5.2
        }
        
        # Normalize to 100% and round properly
        total = sum(balanced_impacts.values())
        normalized_impacts = {k: round((v / total) * 100, 1) for k, v in balanced_impacts.items()}
        
        # Return top 10 factors, sorted by impact
        return dict(sorted(normalized_impacts.items(), key=lambda x: x[1], reverse=True)[:10])

 
    def _generate_recommendations(self, student_data: Dict[str, Any], predicted_score: float, performance_level: str) -> List[Dict[str, Any]]:
        """Generate personalized recommendations with new cognitive/behavioral fields"""
        
        recommendations = []
        
        # Cognitive Abilities recommendations
        cognitive_ability = student_data.get('cognitiveAbility', 100)
        working_memory = student_data.get('workingMemory', 6)
        processing_speed = student_data.get('processingSpeed', 6)
        
        if cognitive_ability < 90:
            recommendations.append({
                'category': 'Cognitive Development',
                'title': 'Enhance Cognitive Skills',
                'description': 'Practice problem-solving and critical thinking exercises to improve cognitive abilities',
                'priority': 'medium',
                'impact': 'Could improve overall academic performance by 5-10%',
                'current_value': f'{cognitive_ability}',
                'target_value': '90+',
                'improvement_area': 'Cognitive Ability'
            })
        
        if working_memory < 7:
            recommendations.append({
                'category': 'Cognitive Skills',
                'title': 'Improve Working Memory',
                'description': 'Use memory techniques and practice recalling information to strengthen working memory',
                'priority': 'medium',
                'impact': 'Better information retention and processing',
                'current_value': f'{working_memory}/10',
                'target_value': '7+/10',
                'improvement_area': 'Working Memory'
            })
        
        if processing_speed < 7:
            recommendations.append({
                'category': 'Cognitive Skills',
                'title': 'Increase Processing Speed',
                'description': 'Practice timed exercises and quick decision-making to improve information processing',
                'priority': 'medium',
                'impact': 'Faster learning and task completion',
                'current_value': f'{processing_speed}/10',
                'target_value': '7+/10',
                'improvement_area': 'Processing Speed'
            })
        
        # Learning Strategies recommendations
        metacognition_skills = student_data.get('metacognitionSkills', 6)
        time_management = student_data.get('timeManagement', 6)
        learning_adaptability = student_data.get('learningAdaptability', 6)
        
        if metacognition_skills < 7:
            recommendations.append({
                'category': 'Learning Strategies',
                'title': 'Develop Metacognition',
                'description': 'Practice self-reflection on learning processes and adjust strategies accordingly',
                'priority': 'high',
                'impact': 'More effective and personalized learning approach',
                'current_value': f'{metacognition_skills}/10',
                'target_value': '7+/10',
                'improvement_area': 'Metacognition'
            })
        
        if time_management < 7:
            recommendations.append({
                'category': 'Study Habits',
                'title': 'Improve Time Management',
                'description': 'Create structured study schedules and use productivity techniques',
                'priority': 'high',
                'impact': 'Better study efficiency and reduced stress',
                'current_value': f'{time_management}/10',
                'target_value': '7+/10',
                'improvement_area': 'Time Management'
            })
        
        if learning_adaptability < 7:
            recommendations.append({
                'category': 'Learning Flexibility',
                'title': 'Enhance Learning Adaptability',
                'description': 'Practice learning in different environments and with various methods',
                'priority': 'medium',
                'impact': 'Better performance in diverse academic situations',
                'current_value': f'{learning_adaptability}/10',
                'target_value': '7+/10',
                'improvement_area': 'Learning Adaptability'
            })
        
        # Personal Wellbeing recommendations
        sleep_quality = student_data.get('sleepQuality', 7)
        focus_concentration = student_data.get('focusConcentration', 7)
        procrastination_tendency = student_data.get('procrastinationTendency', 5)
        academic_anxiety = student_data.get('academicAnxiety', 4)
        
        if sleep_quality < 7:
            recommendations.append({
                'category': 'Health & Wellness',
                'title': 'Improve Sleep Quality',
                'description': 'Establish consistent sleep routine and optimize sleep environment',
                'priority': 'medium',
                'impact': 'Better cognitive function and memory consolidation',
                'current_value': f'{sleep_quality}/10',
                'target_value': '7+/10',
                'improvement_area': 'Sleep Quality'
            })
        
        if focus_concentration < 7:
            recommendations.append({
                'category': 'Cognitive Performance',
                'title': 'Enhance Focus',
                'description': 'Practice mindfulness and minimize distractions during study sessions',
                'priority': 'medium',
                'impact': 'More efficient learning and better retention',
                'current_value': f'{focus_concentration}/10',
                'target_value': '7+/10',
                'improvement_area': 'Focus & Concentration'
            })
        
        if procrastination_tendency > 6:
            recommendations.append({
                'category': 'Productivity',
                'title': 'Reduce Procrastination',
                'description': 'Break tasks into smaller steps and use the Pomodoro technique',
                'priority': 'high',
                'impact': 'More consistent study habits and reduced stress',
                'current_value': f'{procrastination_tendency}/10',
                'target_value': '5/10 or less',
                'improvement_area': 'Procrastination'
            })
        
        if academic_anxiety > 6:
            recommendations.append({
                'category': 'Mental Health',
                'title': 'Manage Academic Anxiety',
                'description': 'Practice relaxation techniques and develop positive self-talk',
                'priority': 'high',
                'impact': 'Improved test performance and learning enjoyment',
                'current_value': f'{academic_anxiety}/10',
                'target_value': '5/10 or less',
                'improvement_area': 'Academic Anxiety'
            })
        
        # Support & Environment recommendations
        faculty_support = student_data.get('facultySupport', 6)
        learning_environment = student_data.get('learningEnvironmentQuality', 7)
        technology_access = student_data.get('technologyAccess', 8)
        
        if faculty_support < 7:
            recommendations.append({
                'category': 'Academic Support',
                'title': 'Seek Faculty Support',
                'description': 'Regularly attend office hours and build relationships with instructors',
                'priority': 'medium',
                'impact': 'Better guidance and academic resources',
                'current_value': f'{faculty_support}/10',
                'target_value': '7+/10',
                'improvement_area': 'Faculty Support'
            })
        
        if learning_environment < 7:
            recommendations.append({
                'category': 'Study Environment',
                'title': 'Optimize Learning Space',
                'description': 'Create a dedicated, organized, and distraction-free study area',
                'priority': 'medium',
                'impact': 'Improved concentration and study efficiency',
                'current_value': f'{learning_environment}/10',
                'target_value': '7+/10',
                'improvement_area': 'Learning Environment'
            })
        
        # Study habits (existing but updated)
        study_hours = student_data.get('studyHoursDaily', 4.5)
        if study_hours < 5:
            recommendations.append({
                'category': 'Study Habits',
                'title': 'Increase Study Time',
                'description': f'Gradually increase from {study_hours} to 6-8 hours of focused study daily',
                'priority': 'high',
                'impact': 'Could improve scores by 5-15 points',
                'current_value': f'{study_hours} hours',
                'target_value': '6-8 hours',
                'improvement_area': 'Study Hours'
            })
        elif study_hours > 9:
            recommendations.append({
                'category': 'Study Efficiency',
                'title': 'Optimize Study Methods',
                'description': 'Focus on active learning techniques rather than just time spent',
                'priority': 'medium',
                'impact': 'Better retention with less burnout',
                'current_value': f'{study_hours} hours',
                'target_value': '6-8 focused hours',
                'improvement_area': 'Study Efficiency'
            })
        
        # Add performance-level specific recommendations
        if performance_level == 'Low' and predicted_score < 60:
            recommendations.append({
                'category': 'Academic Foundation',
                'title': 'Build Strong Foundation',
                'description': 'Focus on fundamental concepts and seek tutoring if needed',
                'priority': 'high',
                'impact': 'Essential for reaching medium performance level',
                'current_value': f'Score: {predicted_score}',
                'target_value': '60+ points',
                'improvement_area': 'Foundation Building'
            })
        elif performance_level == 'Medium' and predicted_score < 75:
            recommendations.append({
                'category': 'Advanced Learning',
                'title': 'Master Key Concepts',
                'description': 'Focus on understanding rather than memorization',
                'priority': 'high',
                'impact': 'Key to reaching high performance level',
                'current_value': f'Score: {predicted_score}',
                'target_value': '75+ points',
                'improvement_area': 'Concept Mastery'
            })
        elif performance_level == 'High' and predicted_score < 85:
            recommendations.append({
                'category': 'Excellence',
                'title': 'Pursue Academic Excellence',
                'description': 'Challenge yourself with advanced material and critical analysis',
                'priority': 'medium',
                'impact': 'Path to exceptional performance',
                'current_value': f'Score: {predicted_score}',
                'target_value': '85+ points',
                'improvement_area': 'Advanced Achievement'
            })
        
        # Ensure we have recommendations
        if not recommendations:
            recommendations.append({
                'category': 'General',
                'title': 'Maintain Current Habits',
                'description': 'Your current approach is working well. Focus on consistency.',
                'priority': 'low',
                'impact': 'Sustained academic performance',
                'current_value': f'Score: {predicted_score}',
                'target_value': 'Consistent excellence',
                'improvement_area': 'Consistency'
            })
        
        # Sort by priority (high first, then medium, then low)
        priority_order = {'high': 0, 'medium': 1, 'low': 2}
        recommendations.sort(key=lambda x: priority_order[x['priority']])
        
        return recommendations