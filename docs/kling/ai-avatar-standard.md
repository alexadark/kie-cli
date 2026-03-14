# Kling AI Avatar Standard

## Overview

The Kling AI Avatar Standard API enables video generation from avatar images and audio files.

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

Obtain your API Key from the [API Key management page](https://kie.ai/api-key).

## Request Parameters

### Required Fields

| Parameter | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| `model`   | string | Yes      | Must be `kling/ai-avatar-standard`       |
| `input`   | object | Yes      | Container for generation task parameters |

### Optional Fields

| Parameter     | Type         | Required | Description                                                                                                               |
| ------------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `callBackUrl` | string (URI) | No       | Webhook endpoint for task completion notifications. Recommended for production environments as an alternative to polling. |

### Input Object

| Field       | Type   | Required | Description             | Constraints                                |
| ----------- | ------ | -------- | ----------------------- | ------------------------------------------ |
| `image_url` | string | Yes      | Avatar image URL        | Max 10MB; accepts JPEG, PNG, WebP          |
| `audio_url` | string | Yes      | Audio file URL          | Max 10MB; accepts MPEG, WAV, AAC, MP4, OGG |
| `prompt`    | string | Yes      | Generation instructions | Max 5000 characters                        |

## Request Example

```json
{
  "model": "kling/ai-avatar-standard",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "image_url": "https://file.aiquickdraw.com/custom-page/akr/section-images/17579268936223zs9l3dt.png",
    "audio_url": "https://file.aiquickdraw.com/custom-page/akr/section-images/17579258340109gghun47.mp3",
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
    "taskId": "task_kling_1765185996677"
  }
}
```

### Response Fields

| Field         | Type    | Description                        |
| ------------- | ------- | ---------------------------------- |
| `code`        | integer | Status code                        |
| `msg`         | string  | Response message                   |
| `data.taskId` | string  | Task identifier for status queries |

## HTTP Status Codes

| Code | Meaning                                    |
| ---- | ------------------------------------------ |
| 200  | Success                                    |
| 401  | Unauthorized (missing/invalid credentials) |
| 402  | Insufficient Credits                       |
| 404  | Not Found                                  |
| 422  | Validation Error                           |
| 429  | Rate Limited                               |
| 455  | Service Unavailable                        |
| 500  | Server Error                               |
| 501  | Generation Failed                          |
| 505  | Feature Disabled                           |

## Notes

- Use the "Get Task Details" endpoint to monitor progress and retrieve results.
- For production, callback URLs are recommended over polling the status endpoint.
- Implement webhook verification using the provided signature verification guide.
- Do not share your API Key; reset immediately if compromised.
