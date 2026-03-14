# Kling V2.1 Master Text to Video

## Overview

This API enables text-to-video generation using the Kling V2.1 Master model. The endpoint processes generation tasks asynchronously and supports callback notifications or status polling.

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

## Request Parameters

### Top-Level Properties

| Field         | Type         | Required | Description                                                               |
| ------------- | ------------ | -------- | ------------------------------------------------------------------------- |
| `model`       | string       | Yes      | Model identifier; must be `kling/v2-1-master-text-to-video`               |
| `callBackUrl` | string (URI) | No       | Webhook URL for task completion notifications; recommended for production |
| `input`       | object       | Yes      | Input parameters for video generation                                     |

### Input Object Properties

| Field             | Type   | Required | Description                                         | Constraints                                          |
| ----------------- | ------ | -------- | --------------------------------------------------- | ---------------------------------------------------- |
| `prompt`          | string | Yes      | Text describing the desired video                   | Max 5000 characters                                  |
| `duration`        | string | No       | Video length in seconds                             | Enum: `'5'`, `'10'`; default: `'5'`                  |
| `aspect_ratio`    | string | No       | Video frame aspect ratio                            | Enum: `'16:9'`, `'9:16'`, `'1:1'`; default: `'16:9'` |
| `negative_prompt` | string | No       | Elements to exclude from generation                 | Max 500 characters                                   |
| `cfg_scale`       | number | No       | Classifier Free Guidance scale for prompt adherence | Min: 0, Max: 1, Step: 0.1; default: 0.5              |

## Request Example

```json
{
  "model": "kling/v2-1-master-text-to-video",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "First-person view from a soldier jumping from a transport plane - the camera shakes with turbulence, oxygen mask reflections flicker - as the clouds part, the battlefield below pulses with anti-air fire and missile trails.",
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
    "taskId": "task_kling_1765187781310"
  }
}
```

### Response Properties

| Field         | Type    | Description                               |
| ------------- | ------- | ----------------------------------------- |
| `code`        | integer | HTTP status code                          |
| `msg`         | string  | Response message or error description     |
| `data`        | object  | Response data object                      |
| `data.taskId` | string  | Unique task identifier for status queries |

## HTTP Status Codes

| Code | Meaning                                                 |
| ---- | ------------------------------------------------------- |
| 200  | Success - request processed successfully                |
| 401  | Unauthorized - missing or invalid credentials           |
| 402  | Insufficient Credits - account lacks required credits   |
| 404  | Not Found - resource or endpoint does not exist         |
| 422  | Validation Error - request parameters failed validation |
| 429  | Rate Limited - request limit exceeded                   |
| 455  | Service Unavailable - system undergoing maintenance     |
| 500  | Server Error - unexpected processing error              |
| 501  | Generation Failed - content generation task failed      |
| 505  | Feature Disabled - requested feature currently disabled |

## Notes

- **Callback Implementation:** System POSTs task status and results to the provided URL upon completion; should accept POST requests with JSON payload.
- **Status Checking:** Use the "Get Task Details" endpoint to query progress and retrieve results via the returned `taskId`.
- **Webhook Security:** Implement signature verification per the Webhook Verification Guide for callback endpoint security.
- **Production Recommendation:** Use callbacks instead of polling status endpoints for production systems.
- **API Key Management:** Obtain keys from the [API Key management page](https://kie.ai/api-key); reset immediately if compromised.
