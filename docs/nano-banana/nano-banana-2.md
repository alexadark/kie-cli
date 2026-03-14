# Nano Banana 2 - Image Generation

## Endpoint

**POST** `https://api.kie.ai/api/v1/jobs/createTask`

Image generation using Google's Nano Banana 2 model.

## Authentication

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## Request Body

| Parameter     | Type         | Required | Description                                   |
| ------------- | ------------ | -------- | --------------------------------------------- |
| `model`       | string       | Yes      | Must be `nano-banana-2`                       |
| `input`       | object       | Yes      | Generation parameters (see below)             |
| `callBackUrl` | string (URI) | No       | Webhook endpoint for completion notifications |

## Input Parameters

| Parameter       | Type    | Required | Description                                                                                                                           |
| --------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `prompt`        | string  | Yes      | Text description for image generation (max 20,000 chars)                                                                              |
| `image_input`   | array   | No       | Up to 14 input images for transformation/reference. JPEG, PNG, WebP. Max 30MB per image. Must be URLs.                                |
| `google_search` | boolean | No       | Enable Google Web Search grounding for real-time info (default: `false`)                                                              |
| `aspect_ratio`  | string  | No       | Default: `auto`. Options: `1:1`, `1:4`, `1:8`, `2:3`, `3:2`, `3:4`, `4:1`, `4:3`, `4:5`, `5:4`, `8:1`, `9:16`, `16:9`, `21:9`, `auto` |
| `resolution`    | string  | No       | Default: `1K`. Options: `1K`, `2K`, `4K`                                                                                              |
| `output_format` | string  | No       | Default: `jpg`. Options: `png`, `jpg`                                                                                                 |

## Example Request

```json
{
  "model": "nano-banana-2",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    "prompt": "A stylish banana hero in sunglasses leaping from a sci-fi launchpad",
    "image_input": [],
    "google_search": false,
    "aspect_ratio": "9:16",
    "resolution": "1K",
    "output_format": "jpg"
  }
}
```

## Response Codes

| Code | Meaning                            |
| ---- | ---------------------------------- |
| 200  | Success - returns `taskId`         |
| 401  | Unauthorized - Invalid credentials |
| 402  | Insufficient Credits               |
| 404  | Resource not found                 |
| 422  | Validation Error                   |
| 429  | Rate Limited                       |
| 455  | Service Unavailable                |
| 500  | Server Error                       |
| 501  | Generation Failed                  |
| 505  | Feature Disabled                   |

## Task Status

Use the common Get Task Detail endpoint to check status:
**GET** `https://api.kie.ai/api/v1/jobs/recordInfo?taskId={taskId}`

## Supported Aspect Ratios

`1:1`, `1:4`, `1:8`, `2:3`, `3:2`, `3:4`, `4:1`, `4:3`, `4:5`, `5:4`, `8:1`, `9:16`, `16:9`, `21:9`, `auto`

## Supported Resolutions

`1K` (default), `2K`, `4K`
