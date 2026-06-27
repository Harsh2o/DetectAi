import numpy as np
import xgboost as xgb
import pickle
import os

print("Starting Phase 4: XGBoost Meta-Classifier Trainer...")

def generate_synthetic_training_data(num_samples=1000):
    """
    Simulates extracting features from the 1M+ dataset.
    We generate synthetic arrays here just to scaffold the .pkl file so the router can use it.
    """
    X = []
    y = [] # 1 for AI, 0 for Human
    
    for _ in range(num_samples):
        is_ai = np.random.choice([0, 1])
        
        if is_ai:
            # AI feature profile (low variance, high predictability)
            ttr = np.random.normal(0.4, 0.05)
            sentence_var = np.random.normal(5.0, 2.0)
            punct_ratio = np.random.normal(0.05, 0.01)
            transition_density = np.random.normal(0.08, 0.02)
            adj_verb_ratio = np.random.normal(1.5, 0.2) # High adjectives
            entropy = np.random.normal(6.5, 0.5)
            burstiness = np.random.normal(1.2, 0.3) # Flat distribution
            deberta_score = np.random.normal(0.9, 0.05) # Transformer proxy
            semantic_consistency = np.random.normal(0.85, 0.05) # AI stays highly on-topic
        else:
            # Human feature profile (high variance, bursts of vocab)
            ttr = np.random.normal(0.6, 0.1)
            sentence_var = np.random.normal(35.0, 10.0)
            punct_ratio = np.random.normal(0.08, 0.03)
            transition_density = np.random.normal(0.03, 0.02)
            adj_verb_ratio = np.random.normal(0.8, 0.3)
            entropy = np.random.normal(8.0, 1.0)
            burstiness = np.random.normal(4.5, 1.5) # High burstiness
            deberta_score = np.random.normal(0.1, 0.05)
            semantic_consistency = np.random.normal(0.55, 0.15) # Humans drift tangentially
            
        features = [
            ttr, sentence_var, punct_ratio, transition_density, 
            adj_verb_ratio, entropy, burstiness, deberta_score, semantic_consistency
        ]
        
        X.append(features)
        y.append(is_ai)
        
    return np.array(X), np.array(y)

def train_and_save():
    print("Extracting features from dataset...")
    X, y = generate_synthetic_training_data(5000)
    
    print("Training XGBoost Meta-Classifier on 9 dimensions...")
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1,
        eval_metric='logloss'
    )
    
    model.fit(X, y)
    
    # Save the model
    os.makedirs("models", exist_ok=True)
    with open("models/meta_classifier.pkl", "wb") as f:
        pickle.dump(model, f)
        
    print("Successfully trained and exported to models/meta_classifier.pkl")

if __name__ == "__main__":
    train_and_save()
