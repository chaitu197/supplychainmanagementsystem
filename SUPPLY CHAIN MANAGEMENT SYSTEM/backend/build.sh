#!/bin/bash
# Render build script for backend

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Training ML models..."
cd models
python demand_forecast.py
python supplier_scoring.py
python route_optimization.py
python retail_demand_prediction.py
python supplychain_demand_forecast.py
python walmart_sales_forecast.py
cd ..

echo "Build complete!"
