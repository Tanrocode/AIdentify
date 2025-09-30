import numpy as np
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk import pos_tag
from nltk.corpus import wordnet

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