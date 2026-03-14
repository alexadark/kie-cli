# Veo 3.1 - Get 4K Video

## Endpoint

**POST** `https://api.kie.ai/api/v1/veo/get-4k-video`

Retrieves ultra-high-definition 4K versions of Veo 3.1 video generation tasks.

## Authentication

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## Request Parameters

| Parameter     | Type         | Required | Description                              |
| ------------- | ------------ | -------- | ---------------------------------------- |
| `taskId`      | string       | Yes      | Task ID (e.g., `veo_task_abcdef123456`)  |
| `index`       | integer      | No       | Video index (default: 0)                 |
| `callBackUrl` | string (URI) | No       | Webhook URL for completion notifications |

## Response

**Success (200):**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "veo_task_abcdef123456",
    "resultUrls": ["https://file.aiquickdraw.com/v/example.mp4"],
    "imageUrls": ["https://file.aiquickdraw.com/v/example.jpg"]
  }
}
```

**Processing (422):**
Returns "4k is processing. It should be ready in 5-10 minutes"

## Callback Response

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "veo_task_abcdef123456",
    "resultUrls": ["https://file.aiquickdraw.com/v/example.mp4"],
    "imageUrls": ["https://file.aiquickdraw.com/v/example.jpg"]
  }
}
```

**Failure callback (500):**

```json
{
  "code": 500,
  "msg": "error description",
  "data": {
    "taskId": "veo_task_abcdef123456"
  }
}
```

## Notes

- Processing time: typically 5-10 minutes
- Credit cost: ~2x Fast mode generation cost
- Supported aspect ratios: 16:9 and 9:16
- 4K files are large; URLs may expire - download promptly

## HTTP Status Codes

| Code | Meaning                       |
| ---- | ----------------------------- |
| 200  | Success                       |
| 401  | Unauthorized                  |
| 404  | Not Found                     |
| 422  | Validation Error / Processing |
| 429  | Rate Limited                  |
| 451  | Image Fetch Failed            |
| 455  | Service Unavailable           |
| 500  | Server Error                  |
