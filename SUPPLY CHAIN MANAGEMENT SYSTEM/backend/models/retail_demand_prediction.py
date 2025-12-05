"""
Retail Demand Prediction Model
Trains on retail_demand.csv (169K rows) for product demand forecasting
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

class RetailDemandModel:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.feature_columns = None
        
    def prepare_features(self, df):
        """Prepare features for retail demand prediction"""
        data = df.copy()
        
        # Parse date
        data['Date'] = pd.to_datetime(data['Date'], infer_datetime_format=True)
        data['year'] = data['Date'].dt.year
        data['month'] = data['Date'].dt.month
        data['day'] = data['Date'].dt.day
        data['day_of_week'] = data['Date'].dt.dayofweek
        data['quarter'] = data['Date'].dt.quarter
        
        # Encode categorical variables
        categorical_cols = ['Product_Code', 'Warehouse', 'Product_Category']
        
        for col in categorical_cols:
            if col in data.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    data[f'{col}_encoded'] = self.label_encoders[col].fit_transform(data[col].astype(str))
                else:
                    data[f'{col}_encoded'] = self.label_encoders[col].transform(data[col].astype(str))
        
        # Select features
        feature_cols = [
            'year', 'month', 'day', 'day_of_week', 'quarter',
            'Product_Code_encoded', 'Warehouse_encoded', 'Product_Category_encoded',
            'Open', 'Promo', 'StateHoliday', 'SchoolHoliday', 'Petrol_price'
        ]
        
        self.feature_columns = feature_cols
        return data[feature_cols]
    
    def train(self, data_path):
        """Train retail demand prediction model"""
        print("Loading retail demand data...")
        df = pd.read_csv(data_path)
        
        print(f"Dataset shape: {df.shape}")
        print(f"Unique products: {df['Product_Code'].nunique()}")
        print(f"Unique warehouses: {df['Warehouse'].nunique()}")
        
        # Prepare features and target
        X = self.prepare_features(df)
        y = df['Order_Demand']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        print(f"Training set size: {X_train.shape}")
        
        # Train XGBoost model
        print("Training XGBoost model for retail demand...")
        self.model = XGBRegressor(
            n_estimators=120,
            max_depth=8,
            learning_rate=0.08,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_pred = self.model.predict(X_train)
        test_pred = self.model.predict(X_test)
        
        print("\n=== Retail Demand Model Performance ===")
        print(f"Train MAE: {mean_absolute_error(y_train, train_pred):,.2f}")
        print(f"Test MAE: {mean_absolute_error(y_test, test_pred):,.2f}")
        print(f"Train R²: {r2_score(y_train, train_pred):.4f}")
        print(f"Test R²: {r2_score(y_test, test_pred):.4f}")
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n=== Top Features ===")
        print(feature_importance.head(8))
        
        return self.model
    
    def predict(self, input_data):
        """Predict retail demand"""
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
            'label_encoders': self.label_encoders,
            'feature_columns': self.feature_columns
        }, path)
        print(f"Model saved to {path}")
    
    def load(self, path):
        """Load model"""
        data = joblib.load(path)
        self.model = data['model']
        self.label_encoders = data['label_encoders']
        self.feature_columns = data['feature_columns']
        print(f"Model loaded from {path}")

if __name__ == "__main__":
    model = RetailDemandModel()
    model.train("../../DATA SETS/retail_demand.csv")
    model.save("../backend/models/retail_demand_model.pkl")
    print("\n✅ Retail Demand Model trained and saved!")
