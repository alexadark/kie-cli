# Kling V2.1 Standard

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

## Request Parameters

### Required Fields

| Field   | Type   | Required | Description                    |
| ------- | ------ | -------- | ------------------------------ |
| `model` | string | Yes      | Must be `kling/v2-1-standard`  |
| `input` | object | Yes      | Contains generation parameters |

### Optional Fields

| Field         | Type         | Required | Description                                                                                                                                             |
| ------------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `callBackUrl` | string (URI) | No       | The URL to receive generation task completion updates. Optional but recommended for production use. System POSTs task status when generation completes. |

### Input Object

| Field             | Type   | Required | Constraints               | Description                                                                                                          |
| ----------------- | ------ | -------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `prompt`          | string | Yes      | Max 5000 characters       | Text describing desired video content                                                                                |
| `image_url`       | string | Yes      | Max 10.0MB                | URL of the image to be used for the video (File URL after upload, not file content; Accepted types: JPEG, PNG, WebP) |
| `duration`        | string | No       | Enum: `'5'`, `'10'`       | Video duration in seconds; default: `'5'`                                                                            |
| `negative_prompt` | string | No       | Max 500 characters        | Elements to avoid in generated video                                                                                 |
| `cfg_scale`       | number | No       | Min: 0, Max: 1, Step: 0.1 | Classifier Free Guidance scale controlling prompt adherence; default: 0.5                                            |

## Request Example

```json
{
  "model": "kling/v2-1-standard",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "A cinematic scene of a warrior standing on a cliff overlooking a vast battlefield",
    "image_url": "https://file.aiquickdraw.com/custom-page/akr/section-images/1754892534386c8wt0qfs.webp",
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
    "taskId": "task_kling_1765187766581"
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

| Code | Meaning                                    |
| ---- | ------------------------------------------ |
| 200  | Success                                    |
| 401  | Unauthorized - missing/invalid credentials |
| 402  | Insufficient Credits                       |
| 404  | Not Found                                  |
| 422  | Validation Error                           |
| 429  | Rate Limited                               |
| 455  | Service Unavailable                        |
| 500  | Server Error                               |
| 501  | Generation Failed                          |
| 505  | Feature Disabled                           |

## Notes

- For production use, we recommend using the `callBackUrl` parameter to receive automatic notifications when generation completes, rather than polling the status endpoint.
- To ensure callback security, see the [Webhook Verification Guide](/common-api/webhook-verification) for signature verification implementation.
- Query task status using the unified endpoint and returned `taskId`.
- API Key management available at the [API Key page](https://kie.ai/api-key).
