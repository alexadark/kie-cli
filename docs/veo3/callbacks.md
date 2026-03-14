# Veo 3.1 - Callbacks

## Overview

The Veo 3.1 API provides a webhook callback system that automatically notifies your server when video generation tasks complete.

Callback requests:

- Method: POST
- Content-Type: application/json
- Timeout: 15 seconds
- Retries: up to 3 times

## Callback Triggers

1. Successful video generation completion
2. Task failure
3. Processing errors

## Response Schemas

### Success (code: 200)

```json
{
  "code": 200,
  "msg": "Veo3.1 video generated successfully.",
  "data": {
    "taskId": "veo_task_abcdef123456",
    "promptJson": "{...}",
    "info": {
      "resultUrls": ["http://example.com/video1.mp4"],
      "originUrls": ["http://example.com/original_video1.mp4"],
      "resolution": "1080p"
    },
    "fallbackFlag": false
  }
}
```

### Failure (code: 400)

```json
{
  "code": 400,
  "msg": "Your prompt was flagged as violating content policies.",
  "data": {
    "taskId": "veo_task_abcdef123456",
    "fallbackFlag": false
  }
}
```

### Fallback Failure (code: 422)

```json
{
  "code": 422,
  "msg": "Your request was rejected by Flow...",
  "data": {
    "taskId": "veo_task_abcdef123456",
    "fallbackFlag": false
  }
}
```

## Callback Fields

| Parameter              | Type    | Description                         |
| ---------------------- | ------- | ----------------------------------- |
| `code`                 | integer | Task processing result indicator    |
| `msg`                  | string  | Detailed status description         |
| `data.taskId`          | string  | Task identifier                     |
| `data.info.resultUrls` | array   | Generated video URLs (success only) |
| `data.info.originUrls` | array   | Original video URLs (non-16:9 only) |
| `data.info.resolution` | string  | Output video resolution             |
| `data.fallbackFlag`    | boolean | Indicates backup model usage        |

## 4K Video Callbacks

Include `callBackUrl` when calling the Get 4K Video endpoint.

**Success:**

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "veo_task_abcdef123456",
    "resultUrls": ["https://file.aiquickdraw.com/v/example.mp4"],
    "imageUrls": ["https://file.aiquickdraw.com/v/example.jpg"]
  }
}
```

## Best Practices

- Use HTTPS for callback URLs
- Return HTTP 200 immediately, process async
- Implement idempotent processing (same taskId may trigger multiple callbacks)
- Download videos promptly (URLs have validity periods)
- Callback URL must be publicly accessible
- Server must respond within 15 seconds
- Implement webhook signature verification (see common API docs)

## Alternative

If callbacks are not possible, poll via Get Video Details endpoint every 30 seconds.
