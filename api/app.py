from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from joblib import load
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk import pos_tag
from nltk.corpus import wordnet
import traceback
import logging
import os
from feature_extraction import extract_features

def create_app():
    # Configure logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    # Download necessary NLTK resources
    try:
        nltk_data_path = os.path.join(os.path.dirname(__file__), 'nltk_data')
        os.makedirs(nltk_data_path, exist_ok=True)
        nltk.data.path.append(nltk_data_path)
        for resource in ['punkt', 'averaged_perceptron_tagger', 'wordnet']:
            try:
                nltk.data.find(f'tokenizers/{resource}')
            except LookupError:
                logger.info(f"Downloading {resource}...")
                nltk.download(resource, download_dir=nltk_data_path)
        logger.info("NLTK resources downloaded successfully")
    except Exception as e:
        logger.error(f"Error downloading NLTK resources: {str(e)}")
        raise

    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    # Load models
    try:
        model_path = os.path.join(os.path.dirname(__file__))
        app.svm_model = load(os.path.join(model_path, 'new_svm_recalculated.joblib'))
        app.xgb_model = load(os.path.join(model_path, 'xgboost_model.joblib'))
        logger.info("Models loaded successfully")
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        raise
    

    def calculate_verb_ratio(pos_tags):
        verb_count = sum(1 for word, tag in pos_tags if tag.startswith('VB'))
        return verb_count / len(pos_tags) if len(pos_tags) > 0 else 0

    def calculate_capital_letter_ratio(text):
        capital_count = sum(1 for char in text if char.isupper())
        return capital_count / len(text) if len(text) > 0 else 0

    def calculate_lowercase_letter_ratio(text):
        lowercase_count = sum(1 for char in text if char.islower())
        return lowercase_count / len(text) if len(text) > 0 else 0

    def calculate_lexical_diversity(text):
        words = [word.lower() for word in word_tokenize(text) if word.isalnum()]
        unique_words = set(words)
        return len(unique_words) / len(words) if len(words) > 0 else 0

    def calculate_homonym_frequency(text):
        words = [word.lower() for word in word_tokenize(text) if word.isalnum()]
        homonym_count = 0
        for word in words:
            synsets = wordnet.synsets(word)
            if len(synsets) > 1:
                for i in range(len(synsets)):
                    for j in range(i + 1, len(synsets)):
                        if synsets[i].path_similarity(synsets[j]) is None or synsets[i].path_similarity(synsets[j]) < 0.2:
                            homonym_count += 1
                            break
        return homonym_count

    def calculate_synonym_frequency(text):
        words = [word.lower() for word in word_tokenize(text) if word.isalnum()]
        synonym_count = 0
        for word in words:
            synsets = wordnet.synsets(word)
            if synsets:
                synonym_count += 1
        return synonym_count

    def calculate_burstiness(text):
        sentences = sent_tokenize(text)
        word_counts = [len([w for w in word_tokenize(s) if w.isalnum()]) for s in sentences]
        mean_wc = np.mean(word_counts)
        std_wc = np.std(word_counts)
        return abs(std_wc) / mean_wc if mean_wc > 0 else 0

    def calculate_sentence_count(text):
        return len(sent_tokenize(text))

    def calculate_negation_ratio(text):
        words = word_tokenize(text.lower())
        negation_words = {"not", "no", "never", "n't", "without", "neither", "nor"}
        negation_count = sum(1 for word in words if word in negation_words)
        return negation_count / len(words) if len(words) > 0 else 0

    def calculate_word_count(text):
        return len([w for w in word_tokenize(text) if w.isalnum()])

    def extract_features(text):
        pos_tags = pos_tag(word_tokenize(text))
        return {
            'verb_ratio': calculate_verb_ratio(pos_tags),
            'capital_letter_ratio': calculate_capital_letter_ratio(text),
            'lowercase_letter_ratio': calculate_lowercase_letter_ratio(text),
            'lexical_diversity': calculate_lexical_diversity(text),
            'homonym_frequency': calculate_homonym_frequency(text),
            'synonym_frequency': calculate_synonym_frequency(text),
            'burstiness': calculate_burstiness(text),
            'sentence_count': calculate_sentence_count(text),
            'negation_ratio': calculate_negation_ratio(text),
            'word_count': calculate_word_count(text)
        }

    @app.route('/analyze', methods=['POST'])
    def analyze_text():
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No JSON data provided"}), 400

            # Check for secret key in header
            if request.headers.get("X-API-KEY") != SECRET_KEY:
                return jsonify({"error": "Unauthorized"}), 401

            text = data.get('text', '')
            model_type = data.get('model', 'svm')  # Default to SVM if not specified
            
            if not text:
                return jsonify({'error': 'No text provided'}), 400
            
            # Split text into sentences
            sentences = sent_tokenize(text)
            
            if not sentences:
                return jsonify({
                    'prediction': 'Unknown',
                    'confidence': 0.0,
                    'sentence_predictions': [],
                    'model_used': model_type
                })
            
            # Get base GPT probability for full text
            overall_features = extract_features(text)
            feature_columns = [
                'verb_ratio',
                'capital_letter_ratio',
                'lowercase_letter_ratio',
                'lexical_diversity',
                'homonym_frequency',
                'synonym_frequency',
                'burstiness',
                'sentence_count',
                'negation_ratio',
                'word_count'
            ]
            overall_feature_vector = [overall_features[feature] for feature in feature_columns]
            
            if model_type.lower() == 'xgb':
                overall_pred = app.xgb_model.predict([overall_feature_vector])[0]
                overall_prob = app.xgb_model.predict_proba([overall_feature_vector])[0]
                overall_prediction = 'Human' if overall_pred == 1 else 'GPT'
                overall_confidence = overall_prob[1] * 100 if overall_pred == 1 else overall_prob[0] * 100
                base_gpt_prob = overall_prob[0]  # Store base GPT probability
            else:  # SVM
                overall_pred = app.svm_model.predict([overall_feature_vector])[0]
                overall_decision = app.svm_model.decision_function([overall_feature_vector])[0]
                overall_confidence = 1 / (1 + np.exp(-overall_decision))
                if overall_pred == 0:  # If predicted as GPT, invert the probability
                    overall_confidence = 1 - overall_confidence
                overall_confidence *= 100
                overall_prediction = 'Human' if overall_pred == 1 else 'GPT'
                base_gpt_prob = 1 - overall_confidence/100  # Store base GPT probability
            
            sentence_predictions = []
            
            # Analyze each sentence by removing it and checking GPT probability
            for sentence in sentences:
                if not sentence.strip():  # Skip empty sentences
                    continue
                
                # Create text without this sentence
                text_without_sentence = text.replace(sentence, '').strip()
                if not text_without_sentence:  # Skip if removing sentence leaves nothing
                    continue
                
                # Get features and prediction for text without this sentence
                features_without = extract_features(text_without_sentence)
                feature_vector_without = [features_without[feature] for feature in feature_columns]
                
                if model_type.lower() == 'xgb':
                    prob_without = app.xgb_model.predict_proba([feature_vector_without])[0]
                    gpt_prob_without = prob_without[0]  # GPT probability without this sentence
                else:  # SVM
                    decision_without = app.svm_model.decision_function([feature_vector_without])[0]
                    prob_without = 1 / (1 + np.exp(-decision_without))
                    gpt_prob_without = 1 - prob_without  # GPT probability without this sentence
                
                # If GPT probability increased when removing the sentence, it was likely Human
                # If GPT probability decreased when removing the sentence, it was likely GPT
                is_gpt = gpt_prob_without < base_gpt_prob
                
                # Calculate confidence based on the difference in probabilities
                confidence_diff = abs(gpt_prob_without - base_gpt_prob)
                confidence = min(confidence_diff * 200, 100)  # Scale the difference to a percentage
                
                sentence_predictions.append({
                    'sentence': sentence,
                    'is_gpt': int(is_gpt),  # Convert boolean to integer
                    'confidence': float(confidence)
                })
            
            result = {
                'prediction': overall_prediction,
                'confidence': float(overall_confidence),
                'sentence_predictions': sentence_predictions,
                'model_used': model_type
            }
            
            logger.info(f"Final result: {result}")
            return jsonify(result)

        except Exception as e:
            logger.error(f"Error in analyze_text: {str(e)}")
            logger.error(traceback.format_exc())
            return jsonify({
                "error": "Internal server error",
                "details": str(e)
            }), 500

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 