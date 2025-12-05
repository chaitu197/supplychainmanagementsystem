"""
Demand Forecasting Model using XGBoost
Trains on inventory_forecast.csv to predict future demand
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

class DemandForecastModel:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self.feature_columns = None
        
    def prepare_features(self, df):
        """Prepare features for training"""
        # Create copy to avoid modifying original
        data = df.copy()
        
        # Convert date to datetime features
        data['Date'] = pd.to_datetime(data['Date'])
        data['year'] = data['Date'].dt.year
        data['month'] = data['Date'].dt.month
        data['day'] = data['Date'].dt.day
        data['day_of_week'] = data['Date'].dt.dayofweek
        data['quarter'] = data['Date'].dt.quarter
        
        # Encode categorical variables
        categorical_cols = ['Store ID', 'Product ID', 'Category', 'Region', 
                           'Weather Condition', 'Seasonality']
        
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
            'Store ID_encoded', 'Product ID_encoded', 'Category_encoded', 
            'Region_encoded', 'Weather Condition_encoded', 'Seasonality_encoded',
            'Inventory Level', 'Units Sold', 'Units Ordered',
            'Price', 'Discount', 'Holiday/Promotion', 'Competitor Pricing'
        ]
        
        self.feature_columns = feature_cols
        return data[feature_cols]
    
    def train(self, data_path):
        """Train the demand forecasting model"""
        print("Loading data...")
        df = pd.read_csv(data_path)
        
        print(f"Dataset shape: {df.shape}")
        print(f"Columns: {df.columns.tolist()}")
        
        # Prepare features and target
        X = self.prepare_features(df)
        y = df['Demand Forecast']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        print(f"Training set size: {X_train.shape}")
        print(f"Test set size: {X_test.shape}")
        
        # Train XGBoost model
        print("Training XGBoost model...")
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
        
        print("\n=== Model Performance ===")
        print(f"Train MAE: {mean_absolute_error(y_train, train_pred):.2f}")
        print(f"Test MAE: {mean_absolute_error(y_test, test_pred):.2f}")
        print(f"Train RMSE: {np.sqrt(mean_squared_error(y_train, train_pred)):.2f}")
        print(f"Test RMSE: {np.sqrt(mean_squared_error(y_test, test_pred)):.2f}")
        print(f"Train R²: {r2_score(y_train, train_pred):.4f}")
        print(f"Test R²: {r2_score(y_test, test_pred):.4f}")
        
        return self.model
    
    def predict(self, input_data):
        """Make predictions on new data"""
        if self.model is None:
            raise ValueError("Model not trained yet!")
        
        X = self.prepare_features(input_data)
        predictions = self.model.predict(X)
        
        # Add confidence intervals (simple approach using std)
        std = predictions.std()
        lower_bound = predictions - 1.96 * std
        upper_bound = predictions + 1.96 * std
        
        return {
            'predicted': predictions.tolist(),
            'lower': lower_bound.tolist(),
            'upper': upper_bound.tolist()
        }
    
    def save(self, path):
        """Save model and encoders"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump({
            'model': self.model,
            'label_encoders': self.label_encoders,
            'feature_columns': self.feature_columns
        }, path)
        print(f"Model saved to {path}")
    
    def load(self, path):
        """Load model and encoders"""
        data = joblib.load(path)
        self.model = data['model']
        self.label_encoders = data['label_encoders']
        self.feature_columns = data['feature_columns']
        print(f"Model loaded from {path}")

if __name__ == "__main__":
    # Train the model
    model = DemandForecastModel()
    data_path = "../../DATA SETS/inventory_forecast.csv"
    
    model.train(data_path)
    model.save("../backend/models/demand_forecast_model.pkl")
    
    print("\n✅ Demand Forecasting Model trained and saved!")
