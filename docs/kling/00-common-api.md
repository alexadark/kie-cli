# Common API Reference

This document covers the shared API endpoints used across all KIE AI Market models.

---

## Get Task Details

### Overview

Query the status and results of any task created in the Market models. This is a unified query interface that works with all models under the Market category.

### Endpoint

**Method:** GET
**URL:** `https://api.kie.ai/api/v1/jobs/recordInfo`

### Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

### Request Parameters

| Name     | Type   | Required | Description                                                   |
| -------- | ------ | -------- | ------------------------------------------------------------- |
| `taskId` | string | Yes      | The unique task identifier returned when you created the task |

### Example Request

```bash
curl -X GET "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=task_12345678" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Task States

| State        | Description                         |
| ------------ | ----------------------------------- |
| `waiting`    | Task queued and awaiting processing |
| `queuing`    | Task in processing queue            |
| `generating` | Currently being processed           |
| `success`    | Task completed successfully         |
| `fail`       | Task failed                         |

### Response Schema (Success - 200)

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "task_12345678",
    "model": "grok-imagine/text-to-image",
    "state": "success",
    "param": "{\"model\":\"grok-imagine/text-to-image\",\"callBackUrl\":\"...\",\"input\":{...}}",
    "resultJson": "{\"resultUrls\":[\"https://example.com/generated-content.jpg\"]}",
    "failCode": "",
    "failMsg": "",
    "costTime": 15000,
    "completeTime": 1698765432000,
    "createTime": 1698765400000,
    "updateTime": 1698765432000,
    "progress": 45
  }
}
```

### Response Fields

| Field          | Type            | Description                                                                          |
| -------------- | --------------- | ------------------------------------------------------------------------------------ |
| `taskId`       | string          | Unique task identifier                                                               |
| `model`        | string          | Model used (e.g., `grok-imagine/text-to-image`, `kling/v2-1-pro`)                    |
| `state`        | string          | Current task state (`waiting`, `queuing`, `generating`, `success`, `fail`)           |
| `param`        | string          | JSON string containing the original request parameters used to create the task       |
| `resultJson`   | string          | JSON string containing generated content URLs. Only present when state is `success`. |
| `failCode`     | string          | Error code if failed; empty string if successful                                     |
| `failMsg`      | string          | Error message if failed; empty string if successful                                  |
| `costTime`     | integer (int64) | Processing time in milliseconds (available when successful)                          |
| `completeTime` | integer (int64) | Completion timestamp (Unix timestamp in milliseconds)                                |
| `createTime`   | integer (int64) | Creation timestamp (Unix timestamp in milliseconds)                                  |
| `updateTime`   | integer (int64) | Update timestamp (Unix timestamp in milliseconds)                                    |
| `progress`     | integer         | Generation progress (0-100). Only returned when model is sora2 or sora2 pro.         |

### Result Structure

The `resultJson` field structure depends on `outputMediaType`:

- **Image/Media/Video:** `{"resultUrls": ["url1", "url2"]}`
- **Text:** `{"resultObject": {}}`

### HTTP Status Codes

| Code | Description                                          |
| ---- | ---------------------------------------------------- |
| 200  | Request successful                                   |
| 400  | Bad Request - Missing or invalid taskId parameter    |
| 401  | Unauthorized - Invalid or missing API key            |
| 404  | Task Not Found - The specified taskId does not exist |
| 422  | Validation Error                                     |
| 429  | Rate Limited - Too many requests                     |
| 500  | Server Error - Unexpected processing error           |

### Best Practices

- **Use callbacks for production:** Include `callBackUrl` when creating tasks to avoid polling.
- **Implement exponential backoff:** Start with 2-3 second intervals, increase gradually.
- **Handle timeouts:** Stop polling after 10-15 minutes.
- **Download results immediately:** Generated content URLs typically expire after 24 hours.

---

## Check Credits

### Endpoint

**Method:** GET
**URL:** `https://api.kie.ai/api/v1/chat/credit`

### Authentication

**Type:** Bearer Token (API Key)
**Header:** `Authorization: Bearer YOUR_API_KEY`

### Example Request

```bash
curl -X GET "https://api.kie.ai/api/v1/chat/credit" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## Webhook Verification

### Overview

KIE AI implements HMAC-SHA256 signature verification to authenticate webhook callbacks and prevent forged or replayed requests in production environments.

### Signature Generation Algorithm

The signature process follows three steps:

1. **Concatenate data**: Combine task ID and Unix timestamp (seconds) using format `taskId + "." + timestampSeconds`
2. **Calculate HMAC-SHA256**: Apply the algorithm using your webhook HMAC key
3. **Base64 encode**: Convert the resulting hash to Base64 format

### Required Headers

All authenticated webhook requests include:

| Header                | Description                                         |
| --------------------- | --------------------------------------------------- |
| `X-Webhook-Timestamp` | Unix timestamp (seconds) when the callback was sent |
| `X-Webhook-Signature` | Base64-encoded HMAC-SHA256 signature                |

### Verification Process

1. **Extract Headers**: Retrieve both signature headers from the incoming request.
2. **Generate Expected Signature**: Extract the `task_id` from the request body, concatenate with the timestamp, then compute the HMAC-SHA256 signature using your stored webhook HMAC key.
3. **Secure Comparison**: Use constant-time comparison (timing-safe functions) to prevent timing attacks when comparing computed versus received signatures.

### Example Webhook Request

```
POST /webhook-endpoint HTTP/1.1
X-Webhook-Timestamp: 1769670760
X-Webhook-Signature: KxDlpbbq0GDOKqm0+FuJpJWTzY8baHSjhEt4kwElqQI=
```

### Configuration

Store your `webhookHmacKey` securely using environment variables. Never commit this key to repositories. Generate and manage keys through the [KIE AI Settings Page](https://kie.ai).

### Implementation Notes

Complete code samples are available for Node.js (Express), Python (Flask), PHP, and Java - each demonstrating proper error handling, header validation, and secure signature comparison techniques.

---

## Create Task (Unified Endpoint)

All model generation tasks use the same endpoint:

**Method:** POST
**URL:** `https://api.kie.ai/api/v1/jobs/createTask`

### Common Request Structure

```json
{
  "model": "<model-identifier>",
  "callBackUrl": "https://your-domain.com/api/callback",
  "input": {
    // Model-specific parameters
  }
}
```

### Common Response Structure

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "task_<model>_<timestamp>"
  }
}
```

### Universal Status Codes

| Code | Meaning                                                   |
| ---- | --------------------------------------------------------- |
| 200  | Success - request processed successfully                  |
| 401  | Unauthorized - missing or invalid credentials             |
| 402  | Insufficient Credits - account lacks sufficient credits   |
| 404  | Not Found - requested resource or endpoint does not exist |
| 422  | Validation Error - request parameters failed validation   |
| 429  | Rate Limited - request limit exceeded                     |
| 455  | Service Unavailable - system undergoing maintenance       |
| 500  | Server Error - unexpected processing error                |
| 501  | Generation Failed - content generation task failed        |
| 505  | Feature Disabled - requested feature currently disabled   |
