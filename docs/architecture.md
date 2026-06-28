# System Architecture

DetectAi is a **multi-modal AI content detection platform** built on a modular, branch-and-fuse architecture. Each media type (text, image, video, audio) is processed through an independent detection pipeline composed of specialized analysis branches whose signals are fused into a single confidence verdict.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                        │
│   Landing Page · Dashboard · Analytics · History · SEO Pages        │
│          Clerk Auth · Vercel Analytics · Schema.org JSON-LD         │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FASTAPI GATEWAY (Azure App Service)              │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐          │
│  │ /detect/ │  │ /detect/ │  │ /detect/ │  │ /detect/  │          │
│  │   text   │  │  image   │  │  video   │  │   audio   │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘          │
│       │              │              │               │               │
│       ▼              ▼              ▼               ▼               │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌──────────┐          │
│  │  Text   │   │  Image  │   │  Video  │   │  Audio   │          │
│  │ Engine  │   │ Engine  │   │ Engine  │   │  Engine  │          │
│  │(5 branch│   │(6 branch│   │(9 branch│   │(spectral │          │
│  │ensemble)│   │ fusion) │   │ fusion) │   │analysis) │          │
│  └─────────┘   └─────────┘   └─────────┘   └──────────┘          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │                   Shared Services                         │      │
│  │  SQLite History DB · Redis Cache · Celery Task Queue      │      │
│  └──────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

## Detection Engines

### Text Detection Engine (5-Branch Ensemble)

| Branch | Model / Technique | Purpose |
|--------|-------------------|---------|
| `transformer` | RoBERTa (fine-tuned) | Primary neural classifier for AI-generated text |
| `perplexity` | GPT-2 token log-probs | Measures linguistic surprise — AI text has lower perplexity |
| `stylometry` | Statistical features | Analyzes sentence-length variance, vocabulary richness, POS ratios |
| `embeddings` | Sentence-BERT cosine | Detects semantic uniformity common in LLM outputs |
| `humanization` | Paraphrase detection | Catches text that was AI-generated then lightly rewritten |

All branch scores feed into a **LightGBM meta-classifier** (`text/ensemble/lightgbm.py`) with isotonic calibration for well-calibrated probability outputs. The system also provides **per-sentence explainability** highlighting which passages triggered the AI flag.

### Image Detection Engine (6-Branch Fusion)

| Branch | Technique | Purpose |
|--------|-----------|---------|
| `deep_classifier` | ViT (Vision Transformer) | Primary neural classifier |
| `ela` | Error Level Analysis | Detects compression inconsistencies from generative models |
| `fft_cnn` | FFT Spectral Analysis | Identifies frequency-domain artifacts (GAN fingerprints) |
| `metadata` | EXIF Inspection | Checks for missing/synthetic camera metadata |
| `prnu_residual` | Photo Response Non-Uniformity | Sensor noise pattern analysis |
| `advanced_heuristics` | Statistical heuristics | Color histogram, edge density, symmetry analysis |

Branch outputs are combined via **weighted confidence fusion** (`image/fusion.py`). The router implements **perceptual hashing** for cache deduplication, avoiding redundant computation on re-uploaded images.

### Video Detection Engine (9-Branch Fusion)

| Branch | Technique | Purpose |
|--------|-----------|---------|
| `vit_ensemble` | ViT + DinoV2 | Per-frame visual authenticity scoring |
| `temporal_consistency` | Frame-to-frame diff | Detects unnatural temporal smoothness |
| `motion_physics` | Optical flow analysis | Validates physical plausibility of motion |
| `depth_physics` | MiDaS depth estimation | Checks 3D depth consistency across frames |
| `semantic_drift` | CLIP embeddings | Detects meaning drift between frames |
| `fft_score` | Spectral analysis | Frequency-domain artifact detection |
| `prnu_score` | Sensor noise | Camera fingerprint validation |
| `audio_physics` | Audio sync check | Validates audio-visual synchronization |
| `advanced_heuristics` | Statistical features | Bitrate, resolution, codec anomaly detection |

The video engine processes frames using a **RAFT optical flow model** for motion analysis and **DinoV2** for semantic feature extraction. The 9 branch scores are fused with a weighted ensemble.

### Audio Detection Engine

| Component | Technique | Purpose |
|-----------|-----------|---------|
| `tasks` | Spectral Feature Extraction | Extracts MFCCs, spectral centroid, zero-crossing rate, chroma |
| `calibrate` | Random Forest + Calibration | Calibrated classifier with Platt scaling |

The audio engine extracts 8 spectral features from uploaded audio files and runs them through a calibrated Random Forest model trained to distinguish human speech from AI-synthesized voice clones (ElevenLabs, Bark, etc.).

## Preprocessing Pipeline

### Text Preprocessors
- **`chunking.py`** — Splits long documents into overlapping 512-token windows for per-chunk analysis
- **`language.py`** — Language detection and filtering (English-optimized, with multilingual fallback)

### Explainability
- **`explanations.py`** — Per-sentence attribution that highlights exactly which passages were flagged as AI-generated, with confidence scores per sentence

## Infrastructure

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite, Framer Motion | SPA with dark-mode UI and micro-animations |
| **Authentication** | Clerk | OAuth, SSO, session management |
| **Backend** | FastAPI, Python 3.11 | Async REST API gateway |
| **ML Models** | PyTorch, HuggingFace Transformers | ViT, RoBERTa, DinoV2, RAFT, MiDaS |
| **Task Queue** | Celery + Redis | Async job processing for heavy inference |
| **Database** | SQLite | Scan history persistence |
| **Hosting** | Azure App Service (B3) | 4-core, 7GB RAM for model hosting |
| **CDN/Frontend** | Vercel | Edge-deployed React app with analytics |
| **CI/CD** | GitHub Actions | Automated Azure deployment on push |
