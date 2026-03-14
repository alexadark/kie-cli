# Kling AI Avatar Pro

## Overview

The Kling AI Avatar Pro API enables generation of avatar videos by combining an image, audio file, and prompt text.

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

Obtain your API Key from the [API Key management page](https://kie.ai/api-key).

## Request Parameters

### Root Level

| Field         | Type         | Required | Description                                                           |
| ------------- | ------------ | -------- | --------------------------------------------------------------------- |
| `model`       | string       | Yes      | Must be `kling/ai-avatar-pro`                                         |
| `callBackUrl` | string (URI) | No       | Webhook URL for completion notifications (recommended for production) |
| `input`       | object       | Yes      | Generation task parameters                                            |

### Input Object

| Field       | Type   | Required | Description       | Constraints                                |
| ----------- | ------ | -------- | ----------------- | ------------------------------------------ |
| `image_url` | string | Yes      | Avatar image URL  | Max 10MB; accepts JPEG, PNG, WebP          |
| `audio_url` | string | Yes      | Audio file URL    | Max 10MB; accepts MPEG, WAV, AAC, MP4, OGG |
| `prompt`    | string | Yes      | Generation prompt | Max 5,000 characters                       |

## Request Example

```json
{
  "model": "kling/ai-avatar-pro",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "image_url": "https://file.aiquickdraw.com/custom-page/akr/section-images/175792685809077e8h8k3.png",
    "audio_url": "https://file.aiquickdraw.com/custom-page/akr/section-images/1757925802302srqfkcqh.mp3",
    "prompt": ""
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
    "taskId": "task_kling_1765186008504"
  }
}
```

### Response Fields

| Field         | Type    | Description                           |
| ------------- | ------- | ------------------------------------- |
| `code`        | integer | Status code                           |
| `msg`         | string  | Response message or error description |
| `data`        | object  | Response payload                      |
| `data.taskId` | string  | Task identifier for status queries    |

## HTTP Status Codes

| Code | Meaning                                    |
| ---- | ------------------------------------------ |
| 200  | Success                                    |
| 401  | Unauthorized (missing/invalid credentials) |
| 402  | Insufficient Credits                       |
| 404  | Resource not found                         |
| 422  | Validation Error                           |
| 429  | Rate Limited                               |
| 455  | Service Unavailable                        |
| 500  | Server Error                               |
| 501  | Generation Failed                          |
| 505  | Feature Disabled                           |

## Notes

- After task submission, use the "Get Task Details" endpoint to monitor progress and retrieve results.
- Production environments should use `callBackUrl` for automatic completion notifications instead of polling.
- Webhook callbacks include generated content URLs and task information.
- Implement webhook verification using provided signature verification guidance.
- Returned `taskId` enables status queries via the Get Task Details endpoint.
