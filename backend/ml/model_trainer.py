import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score, classification_report, mean_absolute_error, r2_score
from sklearn.utils.class_weight import compute_class_weight
import xgboost as xgb
from lightgbm import LGBMClassifier
from catboost import CatBoostRegressor
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Import the data generator
from ml.data_generator import StudentDataGenerator

class ModelTrainer:
    def __init__(self):
        self.regression_models = {}
        self.classification_models = {}
        self.scalers = {}
        self.encoders = {}
        self.feature_columns = []
        self.results = {}
        
    def load_and_preprocess_data(self, data_path='data/student_dataset.csv'):
        """Load and preprocess the dataset, generate if missing"""
        
        # Create data directory if it doesn't exist
        os.makedirs('data', exist_ok=True)
        
        # Generate dataset if it doesn't exist
        if not os.path.exists(data_path):
            print("📊 Dataset not found. Generating new college student dataset...")
            generator = StudentDataGenerator(n_samples=5000)
            df = generator.save_dataset(data_path)
        else:
            df = pd.read_csv(data_path)
            
        print(f"📁 Loaded dataset with {len(df)} samples")
        
        # Get all numerical features (exclude targets and non-predictive columns)
        exclude_columns = ['final_score', 'performance_level', 'created_at', 'improvement_potential']
        numerical_features = [col for col in df.select_dtypes(include=[np.number]).columns 
                             if col not in exclude_columns]
        
        categorical_features = [col for col in df.select_dtypes(include=['object']).columns 
                               if col not in exclude_columns]
        
        # Prepare features - only use features that actually exist in the dataset
        available_numerical = [f for f in numerical_features if f in df.columns]
        available_categorical = [f for f in categorical_features if f in df.columns]
        
        print(f"🔧 Using {len(available_numerical)} numerical features and {len(available_categorical)} categorical features")
        
        X_numerical = df[available_numerical]
        
        # Encode categorical variables
        X_categorical = df[available_categorical].copy()
        for col in available_categorical:
            self.encoders[col] = LabelEncoder()
            X_categorical[col] = self.encoders[col].fit_transform(X_categorical[col])
        
        # Combine features
        X = pd.concat([X_numerical, X_categorical], axis=1)
        self.feature_columns = X.columns.tolist()
        
        # Prepare targets
        y_regression = df['final_score']
        y_classification = df['performance_level']
        
        # Encode classification target
        self.encoders['performance_level'] = LabelEncoder()
        y_classification_encoded = self.encoders['performance_level'].fit_transform(y_classification)
        
        print(f"🔧 Features: {len(self.feature_columns)}, Regression target: {y_regression.shape}, Classification target: {y_classification_encoded.shape}")
        
        return X, y_regression, y_classification_encoded, y_classification

    def train_models(self, X, y_reg, y_clf):
        """Train regression and classification models with optimized parameters"""
        
        # Split data
        X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
            X, y_reg, y_clf, test_size=0.2, random_state=42
        )
        
        print("🔥 Training Regression Models...")
        
        # XGBoost Regressor with optimized parameters
        xgb_reg = xgb.XGBRegressor(
            n_estimators=300,
            max_depth=8,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
        xgb_reg.fit(X_train, y_reg_train)
        self.regression_models['xgboost'] = xgb_reg
        
        # CatBoost Regressor with optimized parameters
        catboost_reg = CatBoostRegressor(
            iterations=300,
            depth=8,
            learning_rate=0.05,
            l2_leaf_reg=3,
            random_seed=42,
            verbose=False
        )
        catboost_reg.fit(X_train, y_reg_train)
        self.regression_models['catboost'] = catboost_reg
        
        print("🔥 Training Classification Models...")
        
        # Calculate class weights for imbalanced classes
        class_weights = compute_class_weight(
            'balanced', 
            classes=np.unique(y_clf_train), 
            y=y_clf_train
        )
        class_weight_dict = dict(enumerate(class_weights))

        # LightGBM Classifier with OPTIMIZED parameters to prevent "no splits" warnings
        lgbm_clf = LGBMClassifier(
            n_estimators=200,
            max_depth=7,
            learning_rate=0.05,
            num_leaves=31,              # Explicitly set to prevent warnings
            min_child_samples=20,        # Prevent overfitting on small leaves
            subsample=0.8,
            colsample_bytree=0.8,
            reg_alpha=0.1,              # L1 regularization
            reg_lambda=0.1,             # L2 regularization
            random_state=42,
            class_weight=class_weight_dict,
            verbose=-1                  # Suppress LightGBM output
        )
        lgbm_clf.fit(X_train, y_clf_train)
        self.classification_models['lightgbm'] = lgbm_clf
        
        # XGBoost Classifier with optimized parameters
        xgb_clf = xgb.XGBClassifier(
            n_estimators=200,
            max_depth=7,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            reg_alpha=0.1,
            reg_lambda=0.1,
            random_state=42,
            # Remove scale_pos_weight since we're using multiclass
            verbosity=0  # Suppress XGBoost warnings
        )
        xgb_clf.fit(X_train, y_clf_train)
        self.classification_models['xgboost'] = xgb_clf
        
        # Evaluate models
        self._evaluate_models(X_test, y_reg_test, y_clf_test)
        
        return X_test, y_reg_test, y_clf_test
    
    def _evaluate_models(self, X_test, y_reg_test, y_clf_test):
        """Comprehensive model evaluation"""
        
        print("\n" + "="*50)
        print("📊 MODEL EVALUATION RESULTS")
        print("="*50)
        
        # Regression Evaluation
        print("\n🎯 REGRESSION MODELS:")
        for name, model in self.regression_models.items():
            y_pred = model.predict(X_test)
            mae = mean_absolute_error(y_reg_test, y_pred)
            r2 = r2_score(y_reg_test, y_pred)
            self.results[f'{name}_regression'] = {'MAE': mae, 'R2': r2}
            print(f"  {name.upper():<10} | MAE: {mae:.2f} | R²: {r2:.3f}")
        
        # Classification Evaluation
        print("\n🎯 CLASSIFICATION MODELS:")
        for name, model in self.classification_models.items():
            y_pred = model.predict(X_test)
            accuracy = accuracy_score(y_clf_test, y_pred)
            self.results[f'{name}_classification'] = {'Accuracy': accuracy}
            print(f"  {name.upper():<10} | Accuracy: {accuracy:.3f}")
            
            # Detailed classification report for the best model
            if name == 'lightgbm':
                print(f"\n📋 Detailed Classification Report for {name.upper()}:")
                # Get the actual classes present in the test data
                unique_classes = np.unique(y_clf_test)
                available_classes = self.encoders['performance_level'].classes_[unique_classes]
                print(classification_report(y_clf_test, y_pred, labels=unique_classes, target_names=available_classes, zero_division=0))
    
    def create_ensemble_predictor(self):
        """Create ensemble predictor for production"""
        from ml.predictor import EnsemblePredictor
        
        ensemble_predictor = EnsemblePredictor(
            regression_models=self.regression_models,
            classification_models=self.classification_models,
            feature_columns=self.feature_columns,
            encoders=self.encoders
        )
        
        return ensemble_predictor
    
    def save_models(self, model_dir='models/'):
        """Save all trained models and preprocessing objects"""
        os.makedirs(model_dir, exist_ok=True)
        
        # Save models
        for name, model in self.regression_models.items():
            joblib.dump(model, f'{model_dir}/{name}_regressor.pkl')
        
        for name, model in self.classification_models.items():
            joblib.dump(model, f'{model_dir}/{name}_classifier.pkl')
        
        # Save preprocessing objects
        joblib.dump(self.encoders, f'{model_dir}/encoders.pkl')
        joblib.dump(self.feature_columns, f'{model_dir}/feature_columns.pkl')
        joblib.dump(self.results, f'{model_dir}/training_results.pkl')
        
        print(f"✅ All models saved to {model_dir}")
    
    def plot_feature_importance(self, model_dir='models/'):
        """Plot and save feature importance"""
        # Get feature importance from XGBoost regressor
        xgb_model = self.regression_models['xgboost']
        feature_importance = xgb_model.feature_importances_
        
        # Create feature importance DataFrame
        importance_df = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': feature_importance
        }).sort_values('importance', ascending=True)
        
        # Plot
        plt.figure(figsize=(12, 10))
        plt.barh(importance_df['feature'], importance_df['importance'])
        plt.xlabel('Feature Importance')
        plt.title('XGBoost Feature Importance for Student Performance Prediction')
        plt.tight_layout()
        
        # Save plot
        os.makedirs(model_dir, exist_ok=True)
        plt.savefig(f'{model_dir}/feature_importance.png', dpi=300, bbox_inches='tight')
        plt.close()
        
        print("✅ Feature importance plot saved")
        
        # Print top features
        print("\n🔝 Top 10 Most Important Features:")
        top_features = importance_df.nlargest(10, 'importance')
        for _, row in top_features.iterrows():
            print(f"  {row['feature']}: {row['importance']:.4f}")

# Training pipeline
if __name__ == "__main__":
    print("🚀 Starting Model Training Pipeline...")
    
    # Initialize trainer
    trainer = ModelTrainer()
    
    # Load and preprocess data
    X, y_reg, y_clf_encoded, y_clf_original = trainer.load_and_preprocess_data()
    
    # Train models
    X_test, y_reg_test, y_clf_test = trainer.train_models(X, y_reg, y_clf_encoded)
    
    # Save models and artifacts
    trainer.save_models()
    trainer.plot_feature_importance()
    
    print("\n🎉 Model training completed successfully!")
    print("📁 Models and artifacts saved in 'models/' directory")