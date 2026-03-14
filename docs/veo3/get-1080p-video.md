# Veo 3.1 - Get 1080P Video

## Endpoint

**GET** `https://api.kie.ai/api/v1/veo/get-1080p-video`

Retrieves the high-definition 1080P version of a Veo 3.1 video generation task.

## Authentication

```
Authorization: Bearer YOUR_API_KEY
```

## Query Parameters

| Parameter | Type    | Required | Description                                     |
| --------- | ------- | -------- | ----------------------------------------------- |
| `taskId`  | string  | Yes      | Task identifier (e.g., `veo_task_abcdef123456`) |
| `index`   | integer | No       | Video index (default: 0)                        |

## Response

**Success (200):**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "resultUrl": "https://tempfile.aiquickdraw.com/p/42f4f8facbb040c0ade87c27cb2d5e58_1749711595.mp4"
  }
}
```

## Notes

- Processing typically requires ~1-3 minutes depending on load
- Non-200 responses indicate the video isn't ready; retry every 20-30 seconds
- The original generation task must succeed before requesting 1080P

## HTTP Status Codes

| Code | Meaning             |
| ---- | ------------------- |
| 200  | Success             |
| 401  | Unauthorized        |
| 404  | Not Found           |
| 422  | Validation Error    |
| 429  | Rate Limited        |
| 451  | Image fetch failed  |
| 455  | Service unavailable |
| 500  | Server Error        |
