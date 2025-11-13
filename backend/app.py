from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os
from datetime import datetime
import logging
from ml.predictor import EnsemblePredictor
from ml.data_generator import StudentDataGenerator
from ml.model_trainer import ModelTrainer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global predictor instance
predictor = None

def initialize_app():
    """Initialize the application and ML models"""
    global predictor
    
    try:
        # Check if models exist, if not train them
        model_dir = 'models/'
        data_path = 'data/student_dataset.csv'
        
        if not os.path.exists(model_dir) or not os.listdir(model_dir):
            logger.info("🔄 No trained models found. Starting training pipeline...")
            
            # Create data directory if needed
            os.makedirs('data', exist_ok=True)
            
            # Generate dataset if it doesn't exist
            if not os.path.exists(data_path):
                logger.info("📊 Generating synthetic student dataset...")
                generator = StudentDataGenerator(n_samples=2000)
                df = generator.generate_realistic_dataset()
                generator.save_dataset(df, data_path)
            
            # Train models
            trainer = ModelTrainer()
            X, y_reg, y_clf_encoded, y_clf_original = trainer.load_and_preprocess_data(data_path)
            trainer.train_models(X, y_reg, y_clf_encoded)
            trainer.save_models(model_dir)
            trainer.plot_feature_importance(model_dir)
            
            predictor = trainer.create_ensemble_predictor()
            
        else:
            logger.info("📦 Loading pre-trained models...")
            predictor = EnsemblePredictor(model_dir=model_dir)
        
        logger.info("✅ Application initialized successfully")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize application: {e}")
        raise

@app.route('/')
def home():
    """Home endpoint"""
    return jsonify({
        'message': 'EduPredict API - Student Performance Prediction',
        'status': 'running',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': predictor is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict_performance():
    """Predict student performance"""
    try:
        data = request.json
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Make prediction
        result = predictor.predict(data)
        
        # Add metadata
        if result['success']:
            result['timestamp'] = datetime.now().isoformat()
            result['request_id'] = f"PRED_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Prediction endpoint error: {e}")
        return jsonify({
            'success': False,
            'error': f'Prediction failed: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/batch-predict', methods=['POST'])
def batch_predict():
    """Batch prediction for multiple students"""
    try:
        data = request.json
        
        if not data or 'students' not in data:
            return jsonify({
                'success': False,
                'error': 'No students data provided'
            }), 400
        
        students = data['students']
        
        if not isinstance(students, list):
            return jsonify({
                'success': False,
                'error': 'Students data must be a list'
            }), 400
        
        # Process batch prediction
        batch_result = predictor.batch_predict(students)
        batch_result['success'] = True
        batch_result['timestamp'] = datetime.now().isoformat()
        batch_result['request_id'] = f"BATCH_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        return jsonify(batch_result)
        
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        return jsonify({
            'success': False,
            'error': f'Batch prediction failed: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/generate-sample-data', methods=['GET'])
def generate_sample_data():
    """Generate sample student data for testing"""
    try:
        n_samples = request.args.get('count', 10, type=int)
        
        generator = StudentDataGenerator(n_samples=n_samples)
        df = generator.generate_realistic_dataset()
        
        # Convert to frontend format
        sample_students = []
        for _, row in df.head(n_samples).iterrows():
            student = {
                'age': int(row['age']),
                'studyHours': float(row['study_hours_daily']),
                'attendance': float(row['attendance_rate']),
                'homeworkCompletion': float(row['homework_completion']),
                'previousScores': float(row['previous_scores']),
                'sleepHours': float(row['sleep_hours']),
                'extracurricularHours': int(row['extracurricular_hours']),
                'travelTime': int(row['travel_time_minutes']),
                'parentalSupport': int(row['parental_support_level']),
                'schoolResources': int(row['school_resources_rating']),
                'motivationLevel': int(row['motivation_level']),
                'stressLevel': int(row['stress_level']),
                'gender': row['gender'],
                'parentEducation': row['parent_education'],
                'familyIncome': row['family_income'],
                'learningStyle': row['learning_style'],
                'hasTutor': bool(row['has_tutor']),
                'internetAccess': bool(row['internet_access'])
            }
            sample_students.append(student)
        
        return jsonify({
            'success': True,
            'sample_size': len(sample_students),
            'students': sample_students,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Sample data generation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/model-info', methods=['GET'])
def model_info():
    """Get information about the trained models"""
    try:
        if predictor is None:
            return jsonify({
                'success': False,
                'error': 'Models not loaded'
            }), 400
        
        # Load training results if available
        results_path = 'models/training_results.pkl'
        training_results = {}
        if os.path.exists(results_path):
            training_results = joblib.load(results_path)
        
        return jsonify({
            'success': True,
            'model_info': {
                'type': 'Ensemble Predictor (XGBoost + LightGBM + CatBoost)',
                'regression_models': list(predictor.regression_models.keys()),
                'classification_models': list(predictor.classification_models.keys()),
                'feature_count': len(predictor.feature_columns),
                'training_results': training_results
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Model info error: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/retrain', methods=['POST'])
def retrain_models():
    """Retrain models with new data"""
    try:
        # This would typically involve new data, but for now we'll retrain with existing
        data_path = 'data/student_dataset.csv'
        
        trainer = ModelTrainer()
        X, y_reg, y_clf_encoded, y_clf_original = trainer.load_and_preprocess_data(data_path)
        trainer.train_models(X, y_reg, y_clf_encoded)
        trainer.save_models()
        
        # Update global predictor
        global predictor
        predictor = trainer.create_ensemble_predictor()
        
        return jsonify({
            'success': True,
            'message': 'Models retrained successfully',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Model retraining error: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    print("🚀 Starting EduPredict Backend Server...")
    initialize_app()
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )