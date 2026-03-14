# Kling 2.6 Image to Video

## Overview

This API endpoint enables video generation from images using the Kling 2.6 model. The service creates videos based on image inputs and text prompts.

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

Obtain API keys from the [API Key management page](https://kie.ai/api-key).

## Request Parameters

### Root Level Parameters

| Parameter     | Type         | Required | Description                                                                              |
| ------------- | ------------ | -------- | ---------------------------------------------------------------------------------------- |
| `model`       | string       | Yes      | Model identifier; must be `kling-2.6/image-to-video`                                     |
| `callBackUrl` | string (URI) | No       | Webhook endpoint for task completion notifications; system POSTs results as JSON payload |
| `input`       | object       | Yes      | Container for generation task parameters                                                 |

### Input Object Parameters

| Parameter    | Type    | Required | Description                                                                     |
| ------------ | ------- | -------- | ------------------------------------------------------------------------------- |
| `prompt`     | string  | Yes      | Text description for video generation (max 1000 characters)                     |
| `image_urls` | array   | Yes      | Image URLs for video source (max 1 image; supported: JPEG, PNG, WebP; max 10MB) |
| `sound`      | boolean | Yes      | Whether generated video includes audio (`true`/`false`)                         |
| `duration`   | string  | Yes      | Video length in seconds; allowed values: `'5'` or `'10'`                        |

## Request Example

```json
{
  "model": "kling-2.6/image-to-video",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "In a bright rehearsal room, sunlight streams through the windows...",
    "image_urls": [
      "https://static.aiquickdraw.com/tools/example/1764851002741_i0lEiI8I.png"
    ],
    "sound": false,
    "duration": "5"
  }
}
```

## Response Schema

### Success Response (HTTP 200)

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "task_kling-2.6_1765182405025"
  }
}
```

### Response Fields

| Field         | Type    | Description                                                  |
| ------------- | ------- | ------------------------------------------------------------ |
| `code`        | integer | HTTP status code                                             |
| `msg`         | string  | Response message or error description                        |
| `data.taskId` | string  | Task identifier for status queries via task details endpoint |

## HTTP Status Codes

| Code | Meaning                                                    |
| ---- | ---------------------------------------------------------- |
| 200  | Success - request processed successfully                   |
| 401  | Unauthorized - missing or invalid credentials              |
| 402  | Insufficient Credits - account lacks required credits      |
| 404  | Not Found - resource or endpoint does not exist            |
| 422  | Validation Error - request parameters failed validation    |
| 429  | Rate Limited - request limit exceeded                      |
| 455  | Service Unavailable - system undergoing maintenance        |
| 500  | Server Error - unexpected processing error                 |
| 501  | Generation Failed - content generation task failed         |
| 505  | Feature Disabled - requested feature currently unavailable |

## Notes

- For production use, employ the `callBackUrl` parameter for automatic completion notifications rather than polling.
- After submission, query the unified task details endpoint to check progress and retrieve results.
- Implement webhook signature verification for callback security.
- Protect API keys; reset immediately if compromised.
