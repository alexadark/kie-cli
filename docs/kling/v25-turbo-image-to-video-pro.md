# Kling V2.5 Turbo Image to Video Pro

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

Obtain API keys from the [API Key management page](https://kie.ai/api-key).

## Request Parameters

### Root Level Parameters

| Parameter     | Type         | Required | Description                                                                |
| ------------- | ------------ | -------- | -------------------------------------------------------------------------- |
| `model`       | string       | Yes      | Model identifier; must be `kling/v2-1-master-image-to-video`               |
| `callBackUrl` | string (URI) | No       | Webhook URL for task completion notifications (recommended for production) |
| `input`       | object       | Yes      | Contains generation parameters                                             |

### Input Object Parameters

| Parameter         | Type   | Required | Max Length | Description                                                     | Values        |
| ----------------- | ------ | -------- | ---------- | --------------------------------------------------------------- | ------------- |
| `prompt`          | string | Yes      | 5000 chars | Describes the video to generate                                 | Any text      |
| `image_url`       | string | Yes      | -          | URL of the reference image; accepts JPEG, PNG, WebP; max 10.0MB | Valid URL     |
| `duration`        | string | No       | -          | Video length in seconds; default is `'5'`                       | `'5'`, `'10'` |
| `negative_prompt` | string | No       | 500 chars  | Elements to exclude from generation                             | Any text      |
| `cfg_scale`       | number | No       | -          | Classifier Free Guidance scale (0-1, step 0.1); default 0.5     | 0 to 1        |

## Request Example

```json
{
  "model": "kling/v2-1-master-image-to-video",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "A team of paratroopers descends into enemy territory, as they pass through clouds, the camera switches to a slow pan above the battlefield lighting up with",
    "image_url": "https://file.aiquickdraw.com/custom-page/akr/section-images/1755256297923kmjpynul.png",
    "duration": "5",
    "negative_prompt": "blur, distort, and low quality",
    "cfg_scale": 0.5
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
    "taskId": "task_kling_1765187759663"
  }
}
```

### Response Fields

| Field         | Type    | Description                                                      |
| ------------- | ------- | ---------------------------------------------------------------- |
| `code`        | integer | HTTP status code                                                 |
| `msg`         | string  | Response message or error description                            |
| `data.taskId` | string  | Task identifier for status queries via Get Task Details endpoint |

## HTTP Status Codes

| Code | Meaning                                                 |
| ---- | ------------------------------------------------------- |
| 200  | Success - request processed successfully                |
| 401  | Unauthorized - missing or invalid credentials           |
| 402  | Insufficient Credits - account lacks required credits   |
| 404  | Not Found - resource or endpoint doesn't exist          |
| 422  | Validation Error - request parameters failed validation |
| 429  | Rate Limited - request limit exceeded                   |
| 455  | Service Unavailable - system undergoing maintenance     |
| 500  | Server Error - unexpected processing error              |
| 501  | Generation Failed - content generation task failed      |
| 505  | Feature Disabled - requested feature currently disabled |

## Notes

- **Callback Security:** See the [Webhook Verification Guide](/common-api/webhook-verification) for signature verification implementation.
- **Recommended Approach:** Use callbacks instead of polling for production environments.
- **Task Status:** Use the unified query endpoint to check progress and retrieve results.
- **Image Requirements:** File URL required after upload (not file content); supports JPEG, PNG, WebP formats with 10.0MB maximum size.
- **API Key Security:** Protect API keys; reset immediately if compromised.
