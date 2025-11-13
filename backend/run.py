#!/usr/bin/env python3
"""
EduPredict Backend Startup Script
Run this to start the backend server
"""

import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, initialize_app

if __name__ == '__main__':
    print("=" * 60)
    print("🎓 EduPredict Backend Server")
    print("=" * 60)
    
    # Initialize application
    initialize_app()
    
    # Start Flask development server
    print("\n🌐 Starting server at http://localhost:5000")
    print("📚 API Documentation available at http://localhost:5000")
    print("⏹️  Press Ctrl+C to stop the server\n")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )