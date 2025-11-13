# EduPredict Backend

AI-powered student performance prediction backend using ensemble machine learning.

## 🚀 Quick Start

### Option 1: Automated Setup
```bash
python setup.py
```
### Option 2: Manual
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Unix/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend
python run.py


 API Endpoints
GET / - Home page

GET /api/health - Health check

POST /api/predict - Single prediction

POST /api/batch-predict - Multiple predictions

GET /api/generate-sample-data - Sample data

GET /api/model-info - Model information

POST /api/retrain - Retrain models