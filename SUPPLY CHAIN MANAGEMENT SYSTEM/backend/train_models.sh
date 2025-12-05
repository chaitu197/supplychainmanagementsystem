#!/bin/bash

# Train all ML models for AI Supply Chain System

echo "🚀 Training AI Supply Chain ML Models..."
echo "=========================================="
echo ""

cd "$(dirname "$0")/models"

echo "📊 Model 1/6: Demand Forecasting (inventory_forecast.csv - 73K rows)"
python3 demand_forecast.py
echo ""

echo "📊 Model 2/6: Supplier Scoring (supply_chain_master.csv - 3K rows)"
python3 supplier_scoring.py
echo ""

echo "📊 Model 3/6: Route Optimization (vehicle_routing.csv - 4.5K rows)"
python3 route_optimization.py
echo ""

echo "📊 Model 4/6: Walmart Sales Forecasting (walmart_sales.csv - 6.4K rows)"
python3 walmart_sales_forecast.py
echo ""

echo "📊 Model 5/6: Retail Demand Prediction (retail_demand.csv - 169K rows)"
python3 retail_demand_prediction.py
echo ""

echo "📊 Model 6/6: Supply Chain Demand Forecast (supplychain_demand.csv - 5K rows)"
python3 supplychain_demand_forecast.py
echo ""

echo "=========================================="
echo "✅ All 6 ML models trained successfully!"
echo ""
echo "📁 Models saved in: backend/models/"
echo "   - demand_forecast_model.pkl"
echo "   - supplier_scoring_model.pkl"
echo "   - route_optimization_model.pkl"
echo "   - walmart_sales_model.pkl"
echo "   - retail_demand_model.pkl"
echo "   - supplychain_demand_model.pkl"
echo ""
echo "🚀 To start the API server, run:"
echo "   cd api && python3 main.py"
