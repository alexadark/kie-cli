# Kling 2.6 Motion Control

## Overview

The Kling 2.6 Motion-Control API enables video generation by applying motion patterns from a reference video to a static image, creating animated content with controlled subject movement.

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

Obtain API keys from the [API Key management page](https://kie.ai/api-key).

## Pre-requisites: File Upload

Before making requests, upload files using the File Upload API to obtain URLs.

### Reference Image Requirements

- **Formats:** JPEG, PNG, JPG
- **Max Size:** 10MB
- **Content:** Subject's head, shoulders, and torso clearly visible
- **Dimensions:** Minimum 300px, aspect ratio 2:5 to 5:2

### Motion Video Requirements

- **Formats:** MP4, QuickTime, Matroska
- **Duration:** 3-30 seconds
- **Max Size:** 100MB
- **Content:** Subject's head, shoulders, and torso clearly visible

## Request Parameters

| Parameter     | Type         | Required | Description                                   | Values                     |
| ------------- | ------------ | -------- | --------------------------------------------- | -------------------------- |
| `model`       | string       | Yes      | Model identifier                              | `kling-2.6/motion-control` |
| `callBackUrl` | string (URI) | No       | Webhook URL for task completion notifications | Valid URL                  |
| `input`       | object       | Yes      | Generation task parameters                    | See below                  |

### Input Object

| Parameter               | Type   | Required | Description                        | Constraints           |
| ----------------------- | ------ | -------- | ---------------------------------- | --------------------- |
| `prompt`                | string | No       | Text description of desired output | Max 2500 characters   |
| `input_urls`            | array  | Yes      | Single image URL array             | File URL after upload |
| `video_urls`            | array  | Yes      | Single video URL array             | File URL after upload |
| `character_orientation` | string | Yes      | Subject orientation reference      | `image` or `video`    |
| `mode`                  | string | Yes      | Output resolution                  | `720p` or `1080p`     |

### Character Orientation Details

- **`image`**: Match subject orientation from reference image (max 10s video output)
- **`video`**: Match subject orientation from motion video (max 30s video output)

## Request Example

```json
{
  "model": "kling-2.6/motion-control",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "The cartoon character is dancing.",
    "input_urls": [
      "https://static.aiquickdraw.com/tools/example/1767694885407_pObJoMcy.png"
    ],
    "video_urls": [
      "https://static.aiquickdraw.com/tools/example/1767525918769_QyvTNib2.mp4"
    ],
    "character_orientation": "image",
    "mode": "720p"
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
    "taskId": "task_kling-2.6_1767693973938"
  }
}
```

### Response Fields

| Field         | Type    | Description                                              |
| ------------- | ------- | -------------------------------------------------------- |
| `code`        | integer | Status code                                              |
| `msg`         | string  | Response message or error description                    |
| `data.taskId` | string  | Task ID for status queries via Get Task Details endpoint |

## HTTP Status Codes

| Code | Meaning                                        |
| ---- | ---------------------------------------------- |
| 200  | Success                                        |
| 401  | Unauthorized - Invalid/missing credentials     |
| 402  | Insufficient Credits - Account balance too low |
| 404  | Not Found - Resource doesn't exist             |
| 422  | Validation Error - Invalid parameters          |
| 429  | Rate Limited - Request quota exceeded          |
| 455  | Service Unavailable - System maintenance       |
| 500  | Server Error - Unexpected error                |
| 501  | Generation Failed - Task processing failed     |
| 505  | Feature Disabled - Feature unavailable         |

## Notes

- **Callback Recommendations:** For production environments, use the `callBackUrl` parameter to receive automatic notifications when generation completes, rather than polling the status endpoint.
- **Webhook Security:** Implement signature verification using the Webhook Verification Guide before processing callbacks.
- **Query Task Status:** Use the unified Get Task Details endpoint to check progress and retrieve results using the returned `taskId`.
- **File Constraints:** Maximum one image and one video per request.
