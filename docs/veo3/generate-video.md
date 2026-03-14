# Veo 3.1 - Generate Video

## Endpoint

**POST** `https://api.kie.ai/api/v1/veo/generate`

Generates videos using Google's Veo 3.1 AI model.

## Authentication

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## Request Body Parameters

| Parameter           | Type    | Required | Description                                                             |
| ------------------- | ------- | -------- | ----------------------------------------------------------------------- |
| `prompt`            | string  | Yes      | Text describing desired video content                                   |
| `imageUrls`         | array   | No       | 1-2 image URLs for image-to-video modes                                 |
| `model`             | string  | No       | `veo3` (Quality) or `veo3_fast` (default)                               |
| `generationType`    | string  | No       | `TEXT_2_VIDEO`, `FIRST_AND_LAST_FRAMES_2_VIDEO`, or `REFERENCE_2_VIDEO` |
| `aspect_ratio`      | string  | No       | `16:9` (default), `9:16`, or `Auto`                                     |
| `seeds`             | integer | No       | Random seed (10000-99999) for reproducible results                      |
| `callBackUrl`       | string  | No       | POST endpoint for completion notifications                              |
| `enableFallback`    | boolean | No       | Deprecated; defaults to false                                           |
| `enableTranslation` | boolean | No       | Auto-translate prompts to English (default: true)                       |
| `watermark`         | string  | No       | Text watermark for generated video                                      |

## Generation Modes

- **TEXT_2_VIDEO**: Text prompts only
- **FIRST_AND_LAST_FRAMES_2_VIDEO**: 1-2 images; system generates transition
- **REFERENCE_2_VIDEO**: 1-3 reference images (veo3_fast only)

## Models

- **veo3**: Flagship quality model, highest fidelity
- **veo3_fast**: Cost-efficient variant with strong visual results

## Aspect Ratios & Output Quality

| Format | Resolutions | Notes                         |
| ------ | ----------- | ----------------------------- |
| 16:9   | 1080P, 4K   | Landscape                     |
| 9:16   | 1080P, 4K   | Portrait/vertical             |
| Auto   | 1080P, 4K   | System decides based on input |

4K requires extra credits (~2x Fast mode cost).

## Response

**Success (200):**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "veo_task_abcdef123456"
  }
}
```

## Error Codes

| Code | Meaning                        |
| ---- | ------------------------------ |
| 200  | Success                        |
| 400  | 1080P processing (1-2 minutes) |
| 401  | Unauthorized                   |
| 402  | Insufficient credits           |
| 404  | Not found                      |
| 422  | Validation error               |
| 429  | Rate limited                   |
| 455  | Service unavailable            |
| 500  | Server error                   |
| 501  | Generation failed              |
| 505  | Feature disabled               |

## Callback Response

**POST to callBackUrl** upon completion:

```json
{
  "code": 200,
  "msg": "Veo3.1 video generated successfully.",
  "data": {
    "taskId": "veo_task_abcdef123456",
    "info": {
      "resultUrls": ["http://example.com/video1.mp4"],
      "originUrls": ["http://example.com/original_video1.mp4"],
      "resolution": "1080p"
    },
    "fallbackFlag": false
  }
}
```

## Example Request

```json
{
  "prompt": "A dog playing in a park",
  "imageUrls": ["http://example.com/image1.jpg"],
  "model": "veo3_fast",
  "aspect_ratio": "9:16",
  "seeds": 12345,
  "enableTranslation": true,
  "callBackUrl": "http://your-callback-url.com/complete"
}
```

## Notes

- Native 9:16 vertical video output
- Multilingual prompt support by default
- Audio included with all videos
- Generation takes 2-5 minutes
