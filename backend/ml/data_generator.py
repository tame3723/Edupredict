import pandas as pd
import numpy as np
from datetime import datetime
import json

class StudentDataGenerator:
    def __init__(self, n_samples=5000, random_state=42):
        self.n_samples = n_samples
        self.random_state = random_state
        np.random.seed(random_state)
    
    def generate_realistic_dataset(self):
        """Generate comprehensive college student performance dataset with STRONG patterns"""
        
        print("🎯 Generating enhanced student dataset with STRONG correlations...")
        
        # Create student archetypes with clear patterns
        high_performers = int(self.n_samples * 0.25)
        average_performers = int(self.n_samples * 0.50)
        low_performers = int(self.n_samples * 0.25)
        
        data = {
            # ==================== CORE ACADEMIC FACTORS (STRONG IMPACT) ====================
            'study_hours_daily': self._generate_with_pattern(high=7.5, avg=4.0, low=2.0, 
                                                           high_perf=high_performers, 
                                                           avg_perf=average_performers, 
                                                           low_perf=low_performers),
            
            'attendance_rate': self._generate_with_pattern(high=95, avg=80, low=65,
                                                         high_perf=high_performers, 
                                                         avg_perf=average_performers, 
                                                         low_perf=low_performers),
            
            'homework_completion': self._generate_with_pattern(high=95, avg=75, low=55,
                                                             high_perf=high_performers, 
                                                             avg_perf=average_performers, 
                                                             low_perf=low_performers),
            
            'class_participation': self._generate_with_pattern(high=9, avg=6, low=3,
                                                             high_perf=high_performers, 
                                                             avg_perf=average_performers, 
                                                             low_perf=low_performers),
            
            'assignment_quality': self._generate_with_pattern(high=9, avg=6, low=4,
                                                            high_perf=high_performers, 
                                                            avg_perf=average_performers, 
                                                            low_perf=low_performers),
            
            # ==================== COGNITIVE FACTORS (STRONG IMPACT) ====================
            'working_memory': self._generate_with_pattern(high=8.5, avg=6.5, low=4.5,
                                                        high_perf=high_performers, 
                                                        avg_perf=average_performers, 
                                                        low_perf=low_performers),
            
            'critical_thinking': self._generate_with_pattern(high=9, avg=6, low=4,
                                                           high_perf=high_performers, 
                                                           avg_perf=average_performers, 
                                                           low_perf=low_performers),
            
            'academic_aptitude': self._generate_with_pattern(high=85, avg=70, low=55,
                                                           high_perf=high_performers, 
                                                           avg_perf=average_performers, 
                                                           low_perf=low_performers),
            
            # ==================== LEARNING STRATEGIES (MODERATE IMPACT) ====================
            'time_management': self._generate_with_pattern(high=8, avg=6, low=4,
                                                         high_perf=high_performers, 
                                                         avg_perf=average_performers, 
                                                         low_perf=low_performers),
            
            'study_consistency': self._generate_with_pattern(high=8, avg=6, low=4,
                                                           high_perf=high_performers, 
                                                           avg_perf=average_performers, 
                                                           low_perf=low_performers),
            
            'motivation_level': self._generate_with_pattern(high=9, avg=6, low=4,
                                                          high_perf=high_performers, 
                                                          avg_perf=average_performers, 
                                                          low_perf=low_performers),
            
            # ==================== PERSONAL FACTORS (MODERATE IMPACT) ====================
            'sleep_hours': self._generate_with_pattern(high=7.5, avg=6.5, low=5.5,
                                                     high_perf=high_performers, 
                                                     avg_perf=average_performers, 
                                                     low_perf=low_performers),
            
            'stress_management': self._generate_with_pattern(high=8, avg=6, low=4,
                                                           high_perf=high_performers, 
                                                           avg_perf=average_performers, 
                                                           low_perf=low_performers),
            
            'focus_concentration': self._generate_with_pattern(high=8, avg=6, low=4,
                                                             high_perf=high_performers, 
                                                             avg_perf=average_performers, 
                                                             low_perf=low_performers),
            
            # ==================== SUPPORT FACTORS (WEAKER IMPACT) ====================
            'peer_support': self._generate_with_pattern(high=8, avg=6, low=4,
                                                      high_perf=high_performers, 
                                                      avg_perf=average_performers, 
                                                      low_perf=low_performers),
            
            'faculty_support': np.random.normal(7, 1.5, self.n_samples).clip(3, 10),
            'school_resources': np.random.normal(6, 1.5, self.n_samples).clip(2, 10),
            
            # ==================== DEMOGRAPHIC (NO IMPACT ON SCORES) ====================
            'age': np.random.randint(18, 25, self.n_samples),
            'gender': np.random.choice(['Male', 'Female'], self.n_samples, p=[0.48, 0.52]),
            'extracurricular_hours': np.random.poisson(5, self.n_samples).clip(0, 20),
        }
        
        df = pd.DataFrame(data)
        
        # Generate target variables with VERY STRONG patterns
        df['final_score'] = self._calculate_strong_scores(df)
        df['performance_level'] = self._categorize_performance(df['final_score'])
        
        # Add timestamp
        df['created_at'] = datetime.now()
        
        # Print feature analysis
        self._analyze_features(df)
        
        return df

    def _generate_with_pattern(self, high, avg, low, high_perf, avg_perf, low_perf):
        """Generate features with clear high/medium/low performer patterns"""
        high_values = np.random.normal(high, high*0.15, high_perf).clip(high*0.7, high*1.3)
        avg_values = np.random.normal(avg, avg*0.2, avg_perf).clip(avg*0.6, avg*1.4)
        low_values = np.random.normal(low, low*0.25, low_perf).clip(low*0.5, low*1.5)
        
        combined = np.concatenate([high_values, avg_values, low_values])
        np.random.shuffle(combined)
        return combined

    def _calculate_strong_scores(self, df):
        """Calculate scores with VERY STRONG, CLEAR patterns"""
        
        # MAJOR factors with strong weights
        academic_impact = (
            (df['study_hours_daily'] - 4.5) * 4.0 +           # VERY STRONG
            (df['attendance_rate'] - 80) * 0.6 +              # STRONG
            (df['homework_completion'] - 75) * 0.5 +          # STRONG
            (df['class_participation'] - 6) * 3.5 +           # VERY STRONG
            (df['assignment_quality'] - 6) * 3.0              # STRONG
        ) * 0.50  # 50% weight
        
        # Cognitive factors
        cognitive_impact = (
            (df['working_memory'] - 6.5) * 2.5 +              # STRONG
            (df['critical_thinking'] - 6) * 2.8 +             # STRONG
            (df['academic_aptitude'] - 70) * 0.4              # MODERATE
        ) * 0.25  # 25% weight
        
        # Learning strategies
        learning_impact = (
            (df['time_management'] - 6) * 2.0 +               # MODERATE
            (df['study_consistency'] - 6) * 1.8 +             # MODERATE
            (df['motivation_level'] - 6) * 1.5                # MODERATE
        ) * 0.15  # 15% weight
        
        # Personal factors
        personal_impact = (
            (df['sleep_hours'] - 6.5) * 1.2 +                 # MODERATE
            (df['stress_management'] - 6) * 1.0 +             # WEAK
            (df['focus_concentration'] - 6) * 1.5             # MODERATE
        ) * 0.10  # 10% weight
        
        # Combine all factors
        total_impact = academic_impact + cognitive_impact + learning_impact + personal_impact
        
        # Base score with minimal randomness
        base_score = 70 + (total_impact * 0.8)
        
        # Add small amount of randomness
        final_score = base_score + np.random.normal(0, 3, len(df))
        
        return final_score.clip(40, 98).round(1)
    
    def _categorize_performance(self, scores):
        """Categorize scores into performance levels"""
        return pd.cut(scores, bins=[0, 65, 75, 85, 100], 
                    labels=['Low', 'Medium', 'High', 'Excellent'], 
                    include_lowest=True)
    
    def _analyze_features(self, df):
        """Analyze feature correlations and distributions"""
        print("\n🔍 FEATURE ANALYSIS:")
        
        # Select only numerical features for correlation
        numerical_features = df.select_dtypes(include=[np.number]).columns
        numerical_features = [f for f in numerical_features if f not in ['final_score', 'age']]
        
        correlations = df[numerical_features + ['final_score']].corr()['final_score'].sort_values(ascending=False)
        feature_correlations = correlations.drop('final_score')
        
        print("\n📈 Top 10 Feature Correlations with Final Score:")
        for feature, corr in feature_correlations.head(10).items():
            strength = "VERY STRONG" if abs(corr) > 0.6 else "STRONG" if abs(corr) > 0.4 else "MODERATE" if abs(corr) > 0.2 else "WEAK"
            print(f"  {feature:.<25} {corr:>6.3f} ({strength})")
        
        print(f"\n📊 Performance Distribution:")
        dist = df['performance_level'].value_counts().sort_index()
        for level, count in dist.items():
            percentage = (count / len(df)) * 100
            print(f"  {level:.<12} {count:>4} students ({percentage:.1f}%)")
        
        print(f"\n🎯 Score Statistics:")
        stats = {
            'Mean': df['final_score'].mean(),
            'Std': df['final_score'].std(),
            'Min': df['final_score'].min(),
            '25%': df['final_score'].quantile(0.25),
            '50%': df['final_score'].quantile(0.5),
            '75%': df['final_score'].quantile(0.75),
            'Max': df['final_score'].max()
        }
        
        for stat, value in stats.items():
            print(f"  {stat}: {value:.1f}")
    
    def save_dataset(self, filename='data/student_dataset.csv'):
        """Save generated dataset"""
        df = self.generate_realistic_dataset()
        df.to_csv(filename, index=False)
        print(f"\n✅ Dataset saved with {len(df)} samples to {filename}")
        return df

# Generate sample data
if __name__ == "__main__":
    generator = StudentDataGenerator(n_samples=5000)
    df = generator.save_dataset()