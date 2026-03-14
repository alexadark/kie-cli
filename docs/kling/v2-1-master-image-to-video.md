# Kling V2.1 Master Image to Video

## Overview

The Kling V2.1 Master Image to Video API enables conversion of static images into dynamic videos using AI generation technology.

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

Obtain your API Key from the [API Key management page](https://kie.ai/api-key).

## Request Parameters

### Root Object

| Field         | Type         | Required | Description                                                                                  |
| ------------- | ------------ | -------- | -------------------------------------------------------------------------------------------- |
| `model`       | string       | Yes      | Model identifier; must be `kling/v2-1-master-image-to-video`                                 |
| `callBackUrl` | string (URI) | No       | Webhook URL for completion notifications; POST requests with JSON payload containing results |
| `input`       | object       | Yes      | Generation task parameters                                                                   |

### Input Object

| Field             | Type   | Required | Description                            | Constraints                                     |
| ----------------- | ------ | -------- | -------------------------------------- | ----------------------------------------------- |
| `prompt`          | string | Yes      | Text describing the video              | Max 5000 characters                             |
| `image_url`       | string | Yes      | Image URL for video generation         | Accepted types: JPEG, PNG, WebP; max 10MB       |
| `duration`        | string | No       | Video duration in seconds              | Allowed values: `'5'` or `'10'`; default: `'5'` |
| `negative_prompt` | string | No       | Elements to exclude from video         | Max 500 characters                              |
| `cfg_scale`       | number | No       | CFG scale controlling prompt adherence | Range 0-1, step 0.1; default: 0.5               |

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

| Field         | Type    | Description                               |
| ------------- | ------- | ----------------------------------------- |
| `code`        | integer | HTTP status code                          |
| `msg`         | string  | Response message or error description     |
| `data.taskId` | string  | Unique task identifier for status queries |

## HTTP Status Codes

| Code | Meaning                            |
| ---- | ---------------------------------- |
| 200  | Success                            |
| 401  | Unauthorized - invalid credentials |
| 402  | Insufficient Credits               |
| 404  | Not Found                          |
| 422  | Validation Error                   |
| 429  | Rate Limited                       |
| 455  | Service Unavailable                |
| 500  | Server Error                       |
| 501  | Generation Failed                  |
| 505  | Feature Disabled                   |

## Notes

- After task submission, use the Get Task Details endpoint to monitor progress and retrieve generated video URLs.
- Alternatively, configure `callBackUrl` for automatic notifications.
- Implement webhook signature verification for callback security.
