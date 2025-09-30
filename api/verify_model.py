import hashlib
import os

def get_file_hash(filename):
    with open(filename, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

# Get paths
api_model = 'xgboost_model.joblib'
test_model = '../xgboost_model.joblib'

# Check if files exist
if not os.path.exists(api_model):
    print(f"API model file not found: {api_model}")
if not os.path.exists(test_model):
    print(f"Test model file not found: {test_model}")

# Get hashes
api_hash = get_file_hash(api_model)
test_hash = get_file_hash(test_model)

print(f"API model hash: {api_hash}")
print(f"Test model hash: {test_hash}")
print(f"Models are {'identical' if api_hash == test_hash else 'different'}") 