# Kling 3.0

## Overview

Kling 3.0 is an advanced video generation model supporting both single-shot and multi-shot video creation with element references. It offers two generation modes (standard and pro) with different resolution options and optional sound effects.

## API Endpoint

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

## Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

## Key Features

- Dual generation modes: `std` (standard) and `pro` (higher resolution)
- Multi-shot support with up to 5 shots
- Element references using `@element_name` syntax
- Optional sound effects
- Aspect ratios: 16:9, 9:16, 1:1
- Duration: 3-15 seconds

## Resolution Mappings

### Standard Mode (`std`)

| Aspect Ratio | Resolution |
| ------------ | ---------- |
| 16:9         | 1280x720   |
| 9:16         | 720x1280   |
| 1:1          | 720x720    |

### Pro Mode (`pro`)

| Aspect Ratio | Resolution |
| ------------ | ---------- |
| 16:9         | 1920x1080  |
| 9:16         | 1080x1920  |
| 1:1          | 1080x1080  |

## Request Parameters

### Root Level

| Field         | Type         | Required | Description                              |
| ------------- | ------------ | -------- | ---------------------------------------- |
| `model`       | string       | Yes      | Must be `kling-3.0/video`                |
| `callBackUrl` | string (URI) | No       | Webhook URL for completion notifications |
| `input`       | object       | Yes      | Input parameters object                  |

### Input Object Fields

| Field            | Type    | Required | Description                                      | Values                           |
| ---------------- | ------- | -------- | ------------------------------------------------ | -------------------------------- |
| `prompt`         | string  | Yes\*    | Video generation prompt (\*for single-shot mode) | Any text                         |
| `image_urls`     | array   | No       | First/last frame image URLs                      | Array of URIs                    |
| `sound`          | boolean | No       | Enable sound effects                             | `true`/`false`; default: `false` |
| `duration`       | string  | Yes      | Total video duration                             | `3`-`15` (seconds)               |
| `aspect_ratio`   | string  | No\*\*   | Video aspect ratio (\*\*optional with images)    | `16:9`, `9:16`, `1:1`            |
| `mode`           | string  | Yes      | Generation mode                                  | `std`, `pro`                     |
| `multi_shots`    | boolean | Yes      | Enable multi-shot mode                           | `true`/`false`                   |
| `multi_prompt`   | array   | Yes\*    | Shot array (\*for multi-shot mode)               | Array of objects                 |
| `kling_elements` | array   | No       | Referenced elements                              | Array of objects                 |

### Multi-Prompt Array Objects

| Field      | Type    | Required | Description                  |
| ---------- | ------- | -------- | ---------------------------- |
| `prompt`   | string  | Yes      | Prompt text for shot         |
| `duration` | integer | Yes      | Shot duration (1-12 seconds) |

### Kling Elements Array Objects

| Field                | Type   | Required | Description                              |
| -------------------- | ------ | -------- | ---------------------------------------- |
| `name`               | string | Yes      | Element name (used with `@` in prompts)  |
| `description`        | string | Yes      | Element description                      |
| `element_input_urls` | array  | No       | Image URLs (2-50 JPG/PNG, max 10MB each) |

## Usage Examples

### Single-Shot with Element Reference

```json
{
  "model": "kling-3.0/video",
  "input": {
    "prompt": "In a bright rehearsal room, sunlight streams through the window@element_dog",
    "image_urls": [
      "https://static.aiquickdraw.com/tools/example/1764851002741_i0lEiI8I.png"
    ],
    "sound": true,
    "duration": "5",
    "aspect_ratio": "16:9",
    "mode": "pro",
    "multi_shots": false,
    "multi_prompt": [],
    "kling_elements": [
      {
        "name": "element_dog",
        "description": "dog",
        "element_input_urls": [
          "https://tempfileb.aiquickdraw.com/kieai/market/1770361808044_4RfUUJrI.jpeg"
        ]
      }
    ]
  }
}
```

### Multi-Shot Video

```json
{
  "model": "kling-3.0/video",
  "input": {
    "multi_shots": true,
    "image_urls": [
      "https://static.aiquickdraw.com/tools/example/1764851002741_i0lEiI8I.png"
    ],
    "duration": "5",
    "aspect_ratio": "16:9",
    "mode": "pro",
    "multi_prompt": [
      {
        "prompt": "a happy dog in running@element_cat",
        "duration": 3
      },
      {
        "prompt": "a happy dog play with a cat@element_dog",
        "duration": 3
      }
    ],
    "kling_elements": [
      {
        "name": "element_cat",
        "description": "cat",
        "element_input_urls": ["https://your-cdn.com/element_image.jpg"]
      }
    ]
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
    "taskId": "task_kling-3.0_1765187774173"
  }
}
```

### Error Response (500)

```json
{
  "code": 500,
  "msg": "Server error description",
  "data": null
}
```

### Response Fields

| Field         | Type    | Description                |
| ------------- | ------- | -------------------------- |
| `code`        | integer | Status code                |
| `msg`         | string  | Response message           |
| `data.taskId` | string  | Task ID for status queries |

## HTTP Status Codes

| Code | Meaning                            |
| ---- | ---------------------------------- |
| 200  | Success                            |
| 401  | Unauthorized (invalid credentials) |
| 402  | Insufficient credits               |
| 404  | Resource not found                 |
| 422  | Validation error                   |
| 429  | Rate limit exceeded                |
| 455  | Service unavailable                |
| 500  | Server error                       |
| 501  | Generation failed                  |
| 505  | Feature disabled                   |

## Notes

- **Aspect Ratio Auto-Adaptation:** When providing `image_urls`, aspect ratio is optional and automatically adapts to uploaded images.
- **File Requirements:** JPG/PNG only, max 10MB per file, 2-50 files per element.
- **Multi-Shot Limitations:** Only first frame image supported; max 5 shots; individual shot durations 1-12 seconds.
- **Sound Effects:** Defaults to enabled in multi-shot mode.
- **Production Use:** Use `callBackUrl` for automatic notifications instead of polling.
- **Element References:** Use `@element_name` syntax in prompts; name must match definition exactly.

## Related Resources

- Market Overview: Explore all available models
- Common API: Check credits and account usage
- File Upload API: Upload images/videos and retrieve URLs
- Get Task Details: Query task status and retrieve results
- Webhook Verification: Implement signature verification for callbacks
