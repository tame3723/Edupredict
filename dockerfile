FROM python:3.11-slim

# Install system dependencies required by LightGBM
RUN apt-get update && apt-get install -y \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories (if your app needs them)
RUN mkdir -p models data

# Expose port (Railway uses PORT env variable, but your app uses 5000)
EXPOSE 5000

# Use your existing run.py script
CMD ["python", "run.py"]
