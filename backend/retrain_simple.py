#!/usr/bin/env python3
"""
Simple script to regenerate dataset and retrain models
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ml.data_generator import StudentDataGenerator
from ml.model_trainer import ModelTrainer

def main():
    print("🔄 Regenerating dataset with college-focused scoring...")
    
    # Create directories
    os.makedirs('data', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    # Generate new dataset - FIXED: save_dataset now takes only filename
    generator = StudentDataGenerator(n_samples=5000)  # Increased sample size
    df = generator.save_dataset('data/student_dataset.csv')  # Fixed method call
    
    print("🔥 Retraining models...")
    
    # Train models
    trainer = ModelTrainer()
    X, y_reg, y_clf_encoded, y_clf_original = trainer.load_and_preprocess_data()
    trainer.train_models(X, y_reg, y_clf_encoded)
    trainer.save_models()
    
    print("🎉 Retraining completed!")
    print("📊 New models should now produce realistic college scores (70-90+ for good students)")

if __name__ == "__main__":
    main()