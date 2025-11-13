#!/usr/bin/env python3
"""
Setup script for EduPredict backend
"""

import os
import subprocess
import sys

def run_command(command, description):
    print(f"🔧 {description}...")
    try:
        subprocess.run(command, shell=True, check=True)
        print(f"✅ {description} completed")
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        sys.exit(1)

def main():
    print("🚀 Setting up EduPredict Backend...")
    
    # Create virtual environment
    if not os.path.exists('venv'):
        run_command('python -m venv venv', 'Creating virtual environment')
    
    # Install dependencies
    if os.name == 'nt':  # Windows
        pip_cmd = 'venv\\Scripts\\pip'
    else:  # Unix/Linux/Mac
        pip_cmd = 'venv/bin/pip'
    
    run_command(f'{pip_cmd} install -r requirements.txt', 'Installing dependencies')
    
    # Create necessary directories
    directories = ['data', 'models', 'ml', 'logs']
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created directory: {directory}")
    
    print("\n🎉 Backend setup completed successfully!")
    print("\n📝 Next steps:")
    print("1. Activate virtual environment:")
    if os.name == 'nt':
        print("   venv\\Scripts\\activate")
    else:
        print("   source venv/bin/activate")
    print("2. Run the backend: python run.py")
    print("3. The API will be available at http://localhost:5000")

if __name__ == '__main__':
    main()