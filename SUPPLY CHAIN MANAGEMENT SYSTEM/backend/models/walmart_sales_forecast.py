"""
Walmart Sales Forecasting Model using LSTM/XGBoost
Trains on walmart_forecast/train.csv and walmart_sales.csv
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

class WalmartSalesForecastModel:
    def __init__(self):
        self.model = None
        self.feature_columns = None
        
    def prepare_features(self, df):
        """Prepare features for Walmart sales prediction"""
        data = df.copy()
        
        # Parse date
        data['Date'] = pd.to_datetime(data['Date'], dayfirst=True)
        data['year'] = data['Date'].dt.year
        data['month'] = data['Date'].dt.month
        data['week'] = data['Date'].dt.isocalendar().week
        data['day_of_week'] = data['Date'].dt.dayofweek
        
        # Select features
        feature_cols = [
            'Store', 'year', 'month', 'week', 'day_of_week',
            'Holiday_Flag', 'Temperature', 'Fuel_Price', 'CPI', 'Unemployment'
        ]
        
        self.feature_columns = feature_cols
        return data[feature_cols]
    
    def train(self, data_path):
        """Train Walmart sales forecasting model"""
        print("Loading Walmart sales data...")
        df = pd.read_csv(data_path)
        
        print(f"Dataset shape: {df.shape}")
        
        # Prepare features and target
        X = self.prepare_features(df)
        y = df['Weekly_Sales']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        print(f"Training set size: {X_train.shape}")
        
        # Train XGBoost model
        print("Training XGBoost model for Walmart sales...")
        self.model = XGBRegressor(
            n_estimators=150,
            max_depth=7,
            learning_rate=0.05,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_pred = self.model.predict(X_train)
        test_pred = self.model.predict(X_test)
        
        print("\n=== Walmart Sales Model Performance ===")
        print(f"Train MAE: ${mean_absolute_error(y_train, train_pred):,.2f}")
        print(f"Test MAE: ${mean_absolute_error(y_test, test_pred):,.2f}")
        print(f"Train RMSE: ${np.sqrt(mean_squared_error(y_train, train_pred)):,.2f}")
        print(f"Test RMSE: ${np.sqrt(mean_squared_error(y_test, test_pred)):,.2f}")
        print(f"Train R²: {r2_score(y_train, train_pred):.4f}")
        print(f"Test R²: {r2_score(y_test, test_pred):.4f}")
        
        return self.model
    
    def predict(self, input_data):
        """Predict Walmart sales"""
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
    model = WalmartSalesForecastModel()
    model.train("../../DATA SETS/walmart_sales.csv")
    model.save("../backend/models/walmart_sales_model.pkl")
    print("\n✅ Walmart Sales Forecasting Model trained and saved!")
