# Kling V2.1 Pro

## Overview

Video generation API endpoint for creating videos using the Kling V2.1 Pro model with text prompts and image inputs.

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

Obtain API Key from the [API Key management page](https://kie.ai/api-key).

## Request Parameters

### Root Level

| Parameter     | Type         | Required | Description                                                                                                                                                  |
| ------------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `model`       | string       | Yes      | Model identifier. Must be `kling/v2-1-pro`                                                                                                                   |
| `callBackUrl` | string (URI) | No       | Webhook URL for receiving task completion notifications. Recommended for production use. System will POST task status and results when generation completes. |
| `input`       | object       | Yes      | Contains generation parameters                                                                                                                               |

### Input Object

| Field             | Type   | Required | Description                                  | Constraints                                 |
| ----------------- | ------ | -------- | -------------------------------------------- | ------------------------------------------- |
| `prompt`          | string | Yes      | Text prompt describing the video to generate | Max 5000 characters                         |
| `image_url`       | string | Yes      | URL of starting image for video generation   | Accepted types: JPEG, PNG, WebP; max 10.0MB |
| `duration`        | string | No       | Video duration in seconds                    | Enum: `'5'`, `'10'`; default: `'5'`         |
| `negative_prompt` | string | No       | Terms to avoid in generated video            | Max 500 characters                          |
| `cfg_scale`       | number | No       | CFG scale controlling adherence to prompt    | Min: 0, Max: 1, Step: 0.1; default: 0.5     |
| `tail_image_url`  | string | No       | URL of image for video end frame             | Accepted types: JPEG, PNG, WebP; max 10.0MB |

## Request Example

```json
{
  "model": "kling/v2-1-pro",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "POV shot of a gravity surfer diving between ancient ruins suspended midair, glowing moss lights the path, the board hisses as it carves through thin mist, echoes rise with speed",
    "image_url": "https://file.aiquickdraw.com/custom-page/akr/section-images/1754892534386c8wt0qfs.webp",
    "duration": "5",
    "negative_prompt": "blur, distort, and low quality",
    "cfg_scale": 0.5,
    "tail_image_url": ""
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
    "taskId": "task_kling_1765187774173"
  }
}
```

### Response Fields

| Field         | Type    | Description                                                       |
| ------------- | ------- | ----------------------------------------------------------------- |
| `code`        | integer | Response status code                                              |
| `msg`         | string  | Response message or error description                             |
| `data.taskId` | string  | Task identifier for querying status via Get Task Details endpoint |

## HTTP Status Codes

| Code | Meaning                                                      |
| ---- | ------------------------------------------------------------ |
| 200  | Success - Request processed successfully                     |
| 401  | Unauthorized - Missing or invalid authentication credentials |
| 402  | Insufficient Credits - Account lacks required credits        |
| 404  | Not Found - Requested resource or endpoint does not exist    |
| 422  | Validation Error - Request parameters failed validation      |
| 429  | Rate Limited - Request limit exceeded                        |
| 455  | Service Unavailable - System undergoing maintenance          |
| 500  | Server Error - Unexpected error during processing            |
| 501  | Generation Failed - Content generation task failed           |
| 505  | Feature Disabled - Requested feature currently disabled      |

## Notes

- **Callback Implementation:** For production deployments, using the `callBackUrl` parameter is recommended over polling the status endpoint.
- **Webhook Verification:** See [Webhook Verification Guide](/common-api/webhook-verification) for signature verification implementation.
- **Task Query:** Use the unified "Get Task Details" endpoint to check progress and retrieve results.
- **Tail Image:** The `tail_image_url` parameter allows specifying an end frame for the generated video.
- **API Key Security:** Protect your API Key and reset immediately if compromised.
