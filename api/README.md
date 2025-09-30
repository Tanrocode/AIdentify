## API Endpoints

### POST /analyze
Analyzes text to determine if it was written by AI or a human.

**Request Body:**
```json
{
    "text": "Your text to analyze"
}
```

**Response:**
```json
{
    "overall": {
        "prediction": "GPT/Human",
        "confidence": {
            "gpt": 75.5,
            "human": 24.5
        }
    },
    "sentences": [
        {
            "text": "Sentence text",
            "prediction": "GPT/Human",
            "confidence": {
                "gpt": 80.0,
                "human": 20.0
            }
        }
    ]
}
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python app.py
   ```

## Deployment

The API is configured for deployment on Render. The `render.yaml` file contains the necessary configuration.

## License

MIT License 