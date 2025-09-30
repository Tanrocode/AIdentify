import xgboost as xgb
import numpy as np
import joblib
import sys

print("Python version:", sys.version)
print("XGBoost version:", xgb.__version__)
print("NumPy version:", np.__version__)
print("Joblib version:", joblib.__version__)

# Load and print model info
model = joblib.load('xgboost_model.joblib')
print("\nModel type:", type(model))
print("Model parameters:", model.get_params()) 