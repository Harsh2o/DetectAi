# API Reference

DetectAi exposes a RESTful API via FastAPI. The live Swagger documentation is available at:

🔗 **[https://detectai-api-fsftcaf4hyfqhqfc.koreacentral-01.azurewebsites.net/docs](https://detectai-api-fsftcaf4hyfqhqfc.koreacentral-01.azurewebsites.net/docs)**

## Base URL

```
https://detectai-api-fsftcaf4hyfqhqfc.koreacentral-01.azurewebsites.net
```

## Endpoints

### Health Check

```http
GET /
```

**Response:**
```json
{ "status": "Online - Enterprise Text & Image Engines Active" }
```

---

### Text Detection

```http
POST /detect/text
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "The essay you want to analyze..."
}
```

**Response:**
```json
{
  "verdict": "AI-Generated",
  "confidence": 0.97,
  "engine_scores": {
    "transformer": 0.95,
    "perplexity": 0.88,
    "stylometry": 0.92,
    "embeddings": 0.91,
    "humanization": 0.85
  },
  "explanation": [...],
  "calibrated": true
}
```

---

### Image Detection

```http
POST /detect/image
Content-Type: multipart/form-data
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `file` | `binary` | Yes | Image file (JPEG, PNG, WebP) |

**Response:**
```json
{
  "status": "processing",
  "task_id": "84f22d0f-3a64-4d60-91e9-f8cac8abe452",
  "message": "Image sent to Task Queue."
}
```

---

### Video Detection

```http
POST /detect/video
Content-Type: multipart/form-data
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `file` | `binary` | Yes | Video file (MP4, MOV, AVI) |

**Response:**
```json
{
  "verdict": "AI-Generated",
  "confidence": 0.94,
  "branch_scores": {
    "vit_ensemble": 0.96,
    "temporal_consistency": 0.91,
    "motion_physics": 0.88,
    "depth_physics": 0.93,
    "semantic_drift": 0.87,
    "fft_score": 0.92,
    "prnu_score": 0.85,
    "audio_physics": 0.79,
    "advanced_heuristics": 0.90
  }
}
```

---

### Audio Detection

```http
POST /detect/audio
Content-Type: multipart/form-data
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `file` | `binary` | Yes | Audio file (WAV, MP3, FLAC) |

---

### Scan History

```http
GET /api/history/scans?user_id={user_id}
```

Returns the full scan history for a given user.

## Authentication

The API is currently open (no API key required). The frontend uses **Clerk** for user authentication and session management.

## Rate Limits

No rate limits are enforced at this time. For production use at scale, configure rate limiting via Azure API Management or a reverse proxy.
