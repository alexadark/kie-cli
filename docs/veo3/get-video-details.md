# Veo 3.1 - Get Video Details

## Endpoint

**GET** `https://api.kie.ai/api/v1/veo/record-info`

Retrieves execution status and results for all Veo 3.1 video tasks.

## Authentication

```
Authorization: Bearer YOUR_API_KEY
```

## Query Parameters

| Parameter | Type   | Required | Description                                            |
| --------- | ------ | -------- | ------------------------------------------------------ |
| `taskId`  | string | Yes      | Unique task identifier (e.g., `veo_task_abcdef123456`) |

## Supported Task Types

- Regular video generation (text-to-video, image-to-video)
- Video extension operations
- 1080P upgrade tasks
- 4K upgrade tasks

## Success Status Flags

| Flag | Meaning                          |
| ---- | -------------------------------- |
| 0    | Processing in progress           |
| 1    | Completed successfully           |
| 2    | Failed                           |
| 3    | Generation failed after creation |

## Response Schema

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "string",
    "paramJson": "string (JSON format)",
    "createTime": "number",
    "completeTime": "number",
    "successFlag": 0,
    "errorCode": null,
    "errorMessage": null,
    "fallbackFlag": false,
    "response": {
      "taskId": "string",
      "resultUrls": ["string"],
      "originUrls": ["string"],
      "resolution": "string"
    }
  }
}
```

## Key Response Fields

- **fallbackFlag**: Indicates fallback model usage (legacy, regular generation only)
- **resultUrls**: Generated video file locations
- **originUrls**: Original videos (non-16:9 aspect ratios only)

## HTTP Status Codes

| Code | Meaning                                                                  |
| ---- | ------------------------------------------------------------------------ |
| 200  | Success                                                                  |
| 400  | Policy violation, unsupported language, or image fetch failure           |
| 401  | Missing/invalid authentication                                           |
| 404  | Resource not found                                                       |
| 422  | Validation error, null record, stale data (>14 days), or missing results |
| 451  | Image fetch failure                                                      |
| 455  | System maintenance                                                       |
| 500  | Server error or timeout                                                  |
