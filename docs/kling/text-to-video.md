# Kling 2.6 Text to Video

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

Obtain API keys from the [API Key management page](https://kie.ai/api-key).

## Request Parameters

### Required Parameters

| Parameter | Type   | Required | Description                                           |
| --------- | ------ | -------- | ----------------------------------------------------- |
| `model`   | string | Yes      | Model identifier. Must be `"kling-2.6/text-to-video"` |
| `input`   | object | Yes      | Container for generation task parameters              |

### Optional Parameters

| Parameter     | Type         | Required | Description                                                                                                                           |
| ------------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `callBackUrl` | string (URI) | No       | Webhook URL for task completion notifications. Recommended for production use. System POSTs task status and results to this endpoint. |

## Input Object

| Field          | Type    | Required | Description                            | Constraints                                  |
| -------------- | ------- | -------- | -------------------------------------- | -------------------------------------------- |
| `prompt`       | string  | Yes      | Text prompt for video generation       | Maximum 1,000 characters                     |
| `sound`        | boolean | Yes      | Whether generated video contains audio | `true` or `false`                            |
| `aspect_ratio` | string  | Yes      | Video aspect ratio                     | Enum: `1:1`, `16:9`, `9:16` (default: `1:1`) |
| `duration`     | string  | Yes      | Video duration in seconds              | Enum: `5`, `10` (default: `5`)               |

## Request Example

```json
{
  "model": "kling-2.6/text-to-video",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "Scene: A fashion live-streaming sales setting, with clothes hanging on racks and the host's figure reflected in a full-length mirror. Lines: [African female host] turns around to showcase the hoodie's cut. [African female host, in a cheerful tone] says: '360-degree flawless tailoring, slimming and versatile.' She then [African female host] leans closer to the camera. [African female host, in a lively tone] says: 'Double-sided fleece fabric, $30 off immediately when you order now.'",
    "sound": false,
    "aspect_ratio": "1:1",
    "duration": "5"
  }
}
```

## Response Schema

### Success Response (200)

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "task_kling-2.6_1765182425861"
  }
}
```

### Response Fields

| Field         | Type    | Description                                                       |
| ------------- | ------- | ----------------------------------------------------------------- |
| `code`        | integer | HTTP status code                                                  |
| `msg`         | string  | Response message or error description                             |
| `data.taskId` | string  | Task identifier for querying status via Get Task Details endpoint |

## HTTP Status Codes

| Code | Meaning                                                   |
| ---- | --------------------------------------------------------- |
| 200  | Success - request processed successfully                  |
| 401  | Unauthorized - missing or invalid credentials             |
| 402  | Insufficient Credits - account lacks sufficient credits   |
| 404  | Not Found - requested resource or endpoint does not exist |
| 422  | Validation Error - request parameters failed validation   |
| 429  | Rate Limited - request limit exceeded                     |
| 455  | Service Unavailable - system undergoing maintenance       |
| 500  | Server Error - unexpected processing error                |
| 501  | Generation Failed - content generation task failed        |
| 505  | Feature Disabled - requested feature currently disabled   |

## Notes

- **Production Recommendation:** Use the `callBackUrl` parameter for automatic completion notifications rather than polling.
- **Task Tracking:** Use returned `taskId` with the Get Task Details endpoint to check progress.
- **Webhook Security:** Implement signature verification as outlined in the Webhook Verification Guide.
- **Callback Format:** Endpoint must support receiving POST requests with JSON payloads.
- **API Key Management:** Available at https://kie.ai/api-key; reset immediately if compromised.
