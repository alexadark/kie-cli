# Veo 3.1 - Extend Video

## Endpoint

**POST** `https://api.kie.ai/api/v1/veo/extend`

Extends existing Veo 3.1 videos by generating new content based on original footage and text prompts.

## Authentication

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## Request Parameters

| Parameter     | Type    | Required | Description                                                         |
| ------------- | ------- | -------- | ------------------------------------------------------------------- |
| `taskId`      | string  | Yes      | Original video generation task ID (format: `veo_task_abcdef123456`) |
| `prompt`      | string  | Yes      | Text describing desired extension                                   |
| `seeds`       | integer | No       | Random seed (10000-99999)                                           |
| `model`       | string  | No       | `fast` (default) or `quality`                                       |
| `watermark`   | string  | No       | Optional watermark text                                             |
| `callBackUrl` | string  | No       | Webhook URL for completion notification                             |

## Response

**Success (200):**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "veo_extend_task_xyz789"
  }
}
```

## Callback Response

```json
{
  "code": 200,
  "msg": "Veo3.1 video extension successful",
  "data": {
    "taskId": "veo_extend_task_xyz789",
    "info": {
      "resultUrls": ["http://example.com/extended_video1.mp4"],
      "originUrls": ["http://example.com/original_video1.mp4"],
      "resolution": "1080p"
    },
    "fallbackFlag": false
  }
}
```

## Error Codes

| Code | Meaning                                   |
| ---- | ----------------------------------------- |
| 200  | Success                                   |
| 400  | Content policy violation or invalid input |
| 401  | Missing/invalid authentication            |
| 402  | Insufficient credits                      |
| 404  | Original video/task not found             |
| 422  | Parameter validation failed               |
| 429  | Rate limit exceeded                       |
| 455  | Service maintenance                       |
| 500  | Server error                              |
| 501  | Extension task failed                     |
| 505  | Feature disabled                          |

## Constraints

- Can only extend videos generated through the Veo 3.1 API
- Processing time: several minutes to 10+ minutes
- Generated video URLs have time limits; download promptly
- English prompts recommended for optimal results
