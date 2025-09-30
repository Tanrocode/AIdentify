import sys
sys.path.append('..')  # Add parent directory to path
from test_xgboost import extract_features as test_extract_features
from app import create_app

app = create_app()
api_extract_features = app.extract_features

test_text = """
This insight drew me to artificial intelligence—a tool capable of overcoming resource limitations while enabling rapid content creation. Motivated by its potential, I co-authored two publications exploring machine learning, steganography, and content authenticity. Yet, I felt compelled to take the impact further, which led to the creation of Cookr: an AI-powered, free educational platform that merges TikTok-style accessibility with personalized learning experiences. In just six months, Cookr reached 20,000 users in over 60 countries. While the platform gained traction, we faced hurdles in marketing, securing funding, and implementing features like reel generation. Despite setbacks from unsuccessful campaigns and grant applications, our persistence paid off—earning me finalist recognition in the Congressional App Challenge for two consecutive years."""

# Extract features using both methods
test_features = test_extract_features(test_text)
api_features = api_extract_features(test_text)

print("Test features:")
for feature, value in test_features.items():
    print(f"{feature}: {value:.4f}")

print("\nAPI features:")
for feature, value in api_features.items():
    print(f"{feature}: {value:.4f}")

# Compare features
print("\nFeature differences:")
for feature in test_features:
    test_val = test_features[feature]
    api_val = api_features[feature]
    diff = abs(test_val - api_val)
    print(f"{feature}: {diff:.6f}") 