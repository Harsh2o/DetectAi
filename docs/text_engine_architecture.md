# DetectAI: Text Engine Architecture

## Overview
The Text Modality of DetectAI is a high-performance, ensemble-based detection engine designed to mathematically differentiate human writing from Large Language Model (LLM) generation. It uses a hybrid approach, combining zero-cost Serverless Cloud Inference with local Natural Language Processing (NLP) heuristics and an XGBoost Meta-Classifier.

## 1. Core Architecture (`backend/text/router.py`)
The main entry point for the Text Engine is built on **FastAPI**. 
When text is submitted, it is passed concurrently through five independent analysis sub-engines. The output of these sub-engines generates a 9-dimensional feature vector, which is then evaluated by the Meta-Classifier to produce the final probability score.

### Key Capabilities:
- **Chunk-Level Highlighting**: Text is chunked sentence-by-sentence. High-variance chunks trigger a `Mixed` classification (detecting human text injected with AI paragraphs).
- **Radar Metrics**: Outputs normalized metrics (0-100) for UI visualization (Syntax Variance, Burstiness, Semantic Consistency, Entropy, Neural Signal).
- **Adversarial Overrides**: Dense, academic human text (e.g., 50+ word sentences) that mathematically resembles AI is safely overridden to `Uncertain` (50%) to prevent false positives.

---

## 2. The Five Sub-Engines

### A. The Neural Backbone (`transformer.py`)
The primary deep-learning interceptor.
- **Cloud-First Architecture**: Instantly fires the text to the **HuggingFace Serverless Inference API** using `Hello-SimpleAI/chatgpt-detector-roberta`. This provides GPU-accelerated neural detection at $0 cost.
- **Local Fallback**: If the cloud API rate-limits or times out, it gracefully falls back to a local TensorFlow/Keras implementation of the same model.
- **Corporate Tropes Interceptor**: Hardcoded heuristics to catch generic AI corporate-speak ("transformative force", "automate repetitive processes") that often slip past base models.

### B. Stylometry Engine (`stylometry.py`)
Analyzes the structural fingerprint of the author.
- Uses **NLTK** and **SpaCy** to generate syntax trees.
- Measures Sentence Variance (AI has highly uniform sentence lengths; humans vary wildly).
- Calculates Type-Token Ratios (Vocabulary richness) and Punctuation Ratios.

### C. Perplexity Engine (`perplexity.py`)
Measures the predictability of the text.
- **Entropy**: How predictable the next word is.
- **Burstiness**: The variance in sentence complexity over time. Human text is highly "bursty", while AI is flat and consistent.

### D. Embeddings Engine (`embeddings.py`)
Measures semantic drift and consistency.
- Uses local `sentence-transformers/all-mpnet-base-v2`.
- Generates 768-dimensional vector embeddings for every sentence and measures the Cosine Similarity between them. AI text is highly cohesive (high similarity), whereas human text naturally drifts off-topic.

### E. Humanization / Stealth Engine (`humanization.py`)
Defends against "Stealth AI" prompts ("write like a normal person on Reddit").
- Detects **Forced Subjectivity** (e.g., "If someone had told me...", "I still have mixed feelings").
- Detects **Spinner Artifacts** from tools like QuillBot (e.g., "swiftly altering", "manner in which").

---

## 3. XGBoost Meta-Classifier
The final decision layer.
- Takes the 9 features extracted from the engines.
- Weights the baseline mathematical heuristics against the Neural Score (currently heavily weighted towards Neural at 75% due to the massive efficacy of the Serverless API).
- Instantly flags "Humanized" AI overrides to bypass the XGBoost model when Stealth AI is positively identified.

## 4. Dependencies Used
- `fastapi`
- `transformers` (HuggingFace)
- `xgboost`
- `sentence-transformers`
- `spacy` (en_core_web_sm)
- `nltk`
- `numpy`, `scikit-learn`
