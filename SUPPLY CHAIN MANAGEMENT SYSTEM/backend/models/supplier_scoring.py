"""
Supplier Scoring Model using Random Forest
Trains on supply_chain_master.csv to score and rank suppliers
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
import joblib
import os

class SupplierScoringModel:
    def __init__(self):
        self.model = None
        self.feature_columns = None
        
    def prepare_features(self, df):
        """Prepare features for training"""
        data = df.copy()
        
        # Select relevant features for supplier scoring
        feature_cols = [
            'price_per_unit', 'quality_score', 'delivery_time_days',
            'on_time_delivery_rate', 'defect_rate', 'return_rate',
            'lead_time_variance', 'forecast_accuracy', 'seasonality_index',
            'demand_volatility_index', 'order_frequency_monthly',
            'avg_order_volume', 'payment_term_days', 'offer_validity_days',
            'items_requested', 'items_offered', 'temporal_month',
            'supplier_reliability_score'
        ]
        
        self.feature_columns = feature_cols
        return data[feature_cols]
    
    def calculate_supplier_score(self, row):
        """Calculate AI supplier score (0-100)"""
        score = 0
        
        # Quality metrics (40 points)
        score += (1 - row['defect_rate']) * 20  # Lower defect rate is better
        score += (1 - row['return_rate']) * 20  # Lower return rate is better
        
        # Delivery metrics (30 points)
        score += row['on_time_delivery_rate'] * 20  # Higher on-time rate is better
        score += max(0, (30 - row['delivery_time_days']) / 30) * 10  # Faster delivery is better
        
        # Reliability metrics (30 points)
        score += row['forecast_accuracy'] * 15  # Higher accuracy is better
        score += row['supplier_reliability_score'] * 15  # Higher reliability is better
        
        return min(100, max(0, score))
    
    def train(self, data_path):
        """Train the supplier scoring model"""
        print("Loading data...")
        df = pd.read_csv(data_path)
        
        print(f"Dataset shape: {df.shape}")
        
        # Prepare features and target
        X = self.prepare_features(df)
        y = df['selected_supplier_flag']  # Binary: 1 if supplier was selected, 0 otherwise
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"Training set size: {X_train.shape}")
        print(f"Test set size: {X_test.shape}")
        print(f"Class distribution: {y.value_counts().to_dict()}")
        
        # Train Random Forest model
        print("Training Random Forest model...")
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_pred = self.model.predict(X_train)
        test_pred = self.model.predict(X_test)
        train_proba = self.model.predict_proba(X_train)[:, 1]
        test_proba = self.model.predict_proba(X_test)[:, 1]
        
        print("\n=== Model Performance ===")
        print("Training Set:")
        print(classification_report(y_train, train_pred))
        print(f"ROC-AUC: {roc_auc_score(y_train, train_proba):.4f}")
        
        print("\nTest Set:")
        print(classification_report(y_test, test_pred))
        print(f"ROC-AUC: {roc_auc_score(y_test, test_proba):.4f}")
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n=== Top 10 Important Features ===")
        print(feature_importance.head(10))
        
        return self.model
    
    def score_suppliers(self, supplier_data):
        """Score suppliers and return rankings"""
        if self.model is None:
            raise ValueError("Model not trained yet!")
        
        X = self.prepare_features(supplier_data)
        
        # Get probability of being selected (this is our AI score base)
        selection_probability = self.model.predict_proba(X)[:, 1]
        
        # Calculate comprehensive supplier scores
        scores = []
        for idx, row in supplier_data.iterrows():
            ai_score = self.calculate_supplier_score(row)
            
            # Determine risk level
            if ai_score >= 85:
                risk_level = "Low"
            elif ai_score >= 70:
                risk_level = "Medium"
            else:
                risk_level = "High"
            
            scores.append({
                'supplier_id': f"SUP-{idx:04d}",
                'ai_score': round(ai_score, 1),
                'selection_probability': round(selection_probability[idx] * 100, 1),
                'risk_level': risk_level,
                'on_time_delivery_rate': round(row['on_time_delivery_rate'] * 100, 1),
                'defect_rate': round(row['defect_rate'] * 100, 2),
                'delivery_time_days': int(row['delivery_time_days']),
                'quality_score': round(row['quality_score'], 2)
            })
        
        return sorted(scores, key=lambda x: x['ai_score'], reverse=True)
    
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
    # Train the model
    model = SupplierScoringModel()
    data_path = "../../DATA SETS/supply_chain_master.csv"
    
    model.train(data_path)
    model.save("../backend/models/supplier_scoring_model.pkl")
    
    print("\n✅ Supplier Scoring Model trained and saved!")
