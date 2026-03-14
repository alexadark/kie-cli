# Kling V2.5 Turbo Text to Video Pro

## Overview

API endpoint for generating videos from text descriptions using the Kling V2.5 Turbo model.

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

## Request Parameters

### Required Fields

| Parameter | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| `model`   | string | Yes      | Must be `kling/v2-5-turbo-text-to-video-pro` |
| `input`   | object | Yes      | Contains generation parameters               |

### Optional Fields

| Parameter     | Type         | Required | Description                                                                                                                                  |
| ------------- | ------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `callBackUrl` | string (URI) | No       | Webhook endpoint for task completion notifications. When provided, the system POSTs results to this URL instead of requiring status polling. |

### Input Object

| Parameter         | Type   | Required | Description                           | Constraints                                           |
| ----------------- | ------ | -------- | ------------------------------------- | ----------------------------------------------------- |
| `prompt`          | string | Yes      | Text description of video to generate | Max 2500 characters                                   |
| `duration`        | string | No       | Video length in seconds               | Enum: `'5'`, `'10'` (default: `'5'`)                  |
| `aspect_ratio`    | string | No       | Video frame aspect ratio              | Enum: `'16:9'`, `'9:16'`, `'1:1'` (default: `'16:9'`) |
| `negative_prompt` | string | No       | Content to avoid in generation        | Max 2500 characters                                   |
| `cfg_scale`       | number | No       | Classifier Free Guidance scale        | Range: 0-1, step 0.1 (default: 0.5)                   |

## Request Example

```json
{
  "model": "kling/v2-5-turbo-text-to-video-pro",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "Real-time playback. Wide shot of a ruined city...",
    "duration": "5",
    "aspect_ratio": "16:9",
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
    "taskId": "task_kling_1765184398475"
  }
}
```

### Response Fields

| Field         | Type    | Description                                    |
| ------------- | ------- | ---------------------------------------------- |
| `code`        | integer | Status code indicating result                  |
| `msg`         | string  | Response message or error description          |
| `data.taskId` | string  | Task identifier for querying generation status |

## HTTP Status Codes

| Code | Meaning                                        |
| ---- | ---------------------------------------------- |
| 200  | Success                                        |
| 401  | Unauthorized - invalid credentials             |
| 402  | Insufficient Credits                           |
| 404  | Not Found - resource doesn't exist             |
| 422  | Validation Error - parameter validation failed |
| 429  | Rate Limited - request limit exceeded          |
| 455  | Service Unavailable - maintenance              |
| 500  | Server Error - unexpected issue                |
| 501  | Generation Failed - task failed                |
| 505  | Feature Disabled - feature unavailable         |

## Notes

- Use the returned `taskId` with the "Get Task Details" endpoint to check progress and retrieve results.
- For production environments, utilize `callBackUrl` for automatic notifications rather than polling.
- Refer to the Webhook Verification Guide for implementing callback security signatures.
- API Key must be obtained from the [API Key management page](https://kie.ai/api-key).
