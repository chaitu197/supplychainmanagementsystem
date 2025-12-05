"""
Supply Chain Demand Forecasting Model
Trains on supplychain_demand.csv for future demand prediction
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

class SupplyChainDemandModel:
    def __init__(self):
        self.model = None
        self.feature_columns = None
        
    def prepare_features(self, df):
        """Prepare features for supply chain demand prediction"""
        data = df.copy()
        
        # Parse date
        data['date'] = pd.to_datetime(data['date'])
        data['year'] = data['date'].dt.year
        data['month'] = data['date'].dt.month
        data['day'] = data['date'].dt.day
        data['day_of_week'] = data['date'].dt.dayofweek
        data['quarter'] = data['date'].dt.quarter
        
        # Select features
        feature_cols = [
            'year', 'month', 'day', 'day_of_week', 'quarter',
            'product_id', 'sales_units', 'holiday_season', 'promotion_applied',
            'competitor_price_index', 'economic_index', 'weather_impact',
            'price', 'discount_percentage', 'sales_revenue',
            'region_Europe', 'region_North America',
            'store_type_Retail', 'store_type_Wholesale',
            'category_Cabinets', 'category_Chairs', 'category_Sofas', 'category_Tables'
        ]
        
        self.feature_columns = feature_cols
        return data[feature_cols]
    
    def train(self, data_path):
        """Train supply chain demand model"""
        print("Loading supply chain demand data...")
        df = pd.read_csv(data_path)
        
        print(f"Dataset shape: {df.shape}")
        
        # Prepare features and target
        X = self.prepare_features(df)
        y = df['future_demand']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        print(f"Training set size: {X_train.shape}")
        
        # Train XGBoost model
        print("Training XGBoost model for supply chain demand...")
        self.model = XGBRegressor(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_pred = self.model.predict(X_train)
        test_pred = self.model.predict(X_test)
        
        print("\n=== Supply Chain Demand Model Performance ===")
        print(f"Train MAE: {mean_absolute_error(y_train, train_pred):.2f}")
        print(f"Test MAE: {mean_absolute_error(y_test, test_pred):.2f}")
        print(f"Train R²: {r2_score(y_train, train_pred):.4f}")
        print(f"Test R²: {r2_score(y_test, test_pred):.4f}")
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n=== Top 10 Important Features ===")
        print(feature_importance.head(10))
        
        return self.model
    
    def predict(self, input_data):
        """Predict future demand"""
        if self.model is None:
            raise ValueError("Model not trained yet!")
        
        X = self.prepare_features(input_data)
        predictions = self.model.predict(X)
        
        return predictions
    
    def save(self, path):
        """Save model"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump({
            'model': self.model,
            'feature_columns': self.feature_columns
        }, path)
        print(f"Model saved to {path}")
    
    def load(self, path):
        """Load model"""
        data = joblib.load(path)
        self.model = data['model']
        self.feature_columns = data['feature_columns']
        print(f"Model loaded from {path}")

if __name__ == "__main__":
    model = SupplyChainDemandModel()
    model.train("../../DATA SETS/supplychain_demand.csv")
    model.save("../backend/models/supplychain_demand_model.pkl")
    print("\n✅ Supply Chain Demand Model trained and saved!")
