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
    
    # Get port from Railway environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    
    # Disable debug mode in production
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    print(f"\n🌐 Starting server at http://{host}:{port}")
    print("📚 API Documentation available at /")
    print("⏹️  Press Ctrl+C to stop the server\n")
    
    app.run(
        host=host,
        port=port,
        debug=debug,  # False in production
        threaded=True
    )
