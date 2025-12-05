# AI Supply Chain ML Models - Dataset Mapping

## 📊 Complete Dataset to Model Mapping

### Model 1: **Demand Forecasting Model** 
- **Dataset**: `inventory_forecast.csv` (73,101 rows)
- **Algorithm**: XGBoost Regressor
- **Purpose**: Predict future demand for products across stores
- **Features**: Date, Store ID, Product ID, Category, Region, Inventory Level, Units Sold, Price, Discount, Weather, Holidays, Competitor Pricing, Seasonality
- **Target**: `Demand Forecast`
- **Use Case**: Powers the Forecasting page in the frontend

---

### Model 2: **Supplier Scoring Model**
- **Dataset**: `supply_chain_master.csv` (3,090 rows)
- **Algorithm**: Random Forest Classifier
- **Purpose**: Score and rank suppliers based on reliability, quality, and performance
- **Features**: Price per unit, Quality score, Delivery time, On-time delivery rate, Defect rate, Return rate, Lead time variance, Forecast accuracy, Supplier reliability score
- **Target**: `selected_supplier_flag` (binary classification)
- **Use Case**: Powers the Procurement page supplier scorecard

---

### Model 3: **Route Optimization Model**
- **Dataset**: `vehicle_routing.csv` (4,550 rows)
- **Algorithm**: Gradient Boosting Regressor
- **Purpose**: Optimize delivery routes and predict computational time
- **Features**: Distance metrics (min/avg/max from depot and non-depot), Demand metrics, Number of customers, Vehicle capacity
- **Target**: `computational_time`
- **Use Case**: Powers the Logistics page route optimization

---

### Model 4: **Walmart Sales Forecasting Model**
- **Dataset**: `walmart_sales.csv` (6,435 rows)
- **Algorithm**: XGBoost Regressor
- **Purpose**: Forecast weekly sales for Walmart stores
- **Features**: Store ID, Date features (year/month/week/day), Holiday flag, Temperature, Fuel price, CPI, Unemployment rate
- **Target**: `Weekly_Sales`
- **Use Case**: Additional forecasting capability for retail chains

---

### Model 5: **Retail Demand Prediction Model**
- **Dataset**: `retail_demand.csv` (169,212 rows) - **LARGEST DATASET**
- **Algorithm**: XGBoost Regressor
- **Purpose**: Predict order demand for products across warehouses
- **Features**: Product Code, Warehouse, Product Category, Date features, Store open status, Promotions, Holidays (state/school), Petrol price
- **Target**: `Order_Demand`
- **Use Case**: Powers inventory reorder suggestions and demand analytics

---

### Model 6: **Supply Chain Demand Forecast Model**
- **Dataset**: `supplychain_demand.csv` (5,000 rows)
- **Algorithm**: XGBoost Regressor
- **Purpose**: Predict future demand considering economic and competitive factors
- **Features**: Product ID, Sales units, Holiday season, Promotions, Competitor price index, Economic index, Weather impact, Price, Discount, Sales revenue, Region (Europe/North America), Store type (Retail/Wholesale), Category (Cabinets/Chairs/Sofas/Tables)
- **Target**: `future_demand`
- **Use Case**: Strategic demand planning with economic indicators

---

## 📁 Additional Datasets (Not Yet Used)

### 7. `walmart_forecast/` directory (4 files)
- **Files**: `train.csv` (12.8 MB), `test.csv` (2.6 MB), `features.csv`, `stores.csv`
- **Potential Use**: Advanced Walmart-specific forecasting with department-level granularity
- **Note**: Can be integrated into Model 4 for enhanced accuracy

### 8. `route_optimization/` directory (3 files)
- **Files**: `order_large.csv`, `order_small.csv`, `distance.csv`
- **Potential Use**: Advanced route optimization with real order data and distance matrices
- **Note**: Can enhance Model 3 with actual distance calculations

---

## 🎯 Model Summary

| Model | Dataset | Rows | Algorithm | Purpose |
|-------|---------|------|-----------|---------|
| 1. Demand Forecasting | inventory_forecast.csv | 73,101 | XGBoost | Product demand prediction |
| 2. Supplier Scoring | supply_chain_master.csv | 3,090 | Random Forest | Supplier ranking |
| 3. Route Optimization | vehicle_routing.csv | 4,550 | Gradient Boosting | Delivery route optimization |
| 4. Walmart Sales | walmart_sales.csv | 6,435 | XGBoost | Weekly sales forecasting |
| 5. Retail Demand | retail_demand.csv | 169,212 | XGBoost | Order demand prediction |
| 6. Supply Chain Demand | supplychain_demand.csv | 5,000 | XGBoost | Future demand with economics |

**Total Training Data**: 261,388 rows across 6 models

---

## 🚀 How to Train All Models

```bash
cd backend
chmod +x train_models.sh
./train_models.sh
```

This will train all 6 models sequentially and save them as `.pkl` files in `backend/models/`.

---

## 🔌 API Integration

All models are integrated into the FastAPI backend (`backend/api/main.py`) with endpoints:

- `POST /api/forecast-demand` → Uses Models 1, 5, 6
- `GET /api/supplier-scores` → Uses Model 2
- `POST /api/optimize-route` → Uses Model 3
- `GET /api/dashboard-metrics` → Aggregates data from all models
- `GET /api/reorder-suggestions` → Uses Models 1, 5, 6

---

## 📈 Model Performance Expectations

- **Demand Forecasting**: R² > 0.85, MAE < 50 units
- **Supplier Scoring**: ROC-AUC > 0.80, Accuracy > 75%
- **Route Optimization**: R² > 0.75, MAE < 2 minutes
- **Walmart Sales**: R² > 0.90, MAE < $50,000
- **Retail Demand**: R² > 0.80, MAE < 5,000 units
- **Supply Chain Demand**: R² > 0.85, MAE < 20 units
