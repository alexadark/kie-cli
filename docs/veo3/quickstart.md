# Veo 3.1 - Quickstart

## Overview

The Veo 3.1 API provides AI video generation through:

- **Text-to-Video**: Generate videos from descriptive text prompts
- **Image-to-Video**: Bring static images to life
- **HD Support**: 1080P and 4K video generation
- **Vertical Video**: Native 9:16 support

## Authentication

All requests require an API key from the [API Key Management Page](https://kie.ai/api-key).

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Base URL:** `https://api.kie.ai`

## Endpoints

| Endpoint                      | Method | Purpose                      |
| ----------------------------- | ------ | ---------------------------- |
| `/api/v1/veo/generate`        | POST   | Submit video generation task |
| `/api/v1/veo/extend`          | POST   | Extend an existing video     |
| `/api/v1/veo/record-info`     | GET    | Check task status            |
| `/api/v1/veo/get-1080p-video` | GET    | Retrieve 1080P video         |
| `/api/v1/veo/get-4k-video`    | POST   | Retrieve 4K video            |

## Task Status Flags

| Flag | Meaning                          |
| ---- | -------------------------------- |
| 0    | Processing                       |
| 1    | Completed                        |
| 2    | Failed                           |
| 3    | Generation failed after creation |

## Models

- **veo3_fast** (default): Cost-efficient, strong visual results
- **veo3**: Flagship quality, highest fidelity

## Workflow

1. Submit generation request -> receive `taskId`
2. Either poll `record-info` every 30s or use `callBackUrl` webhook
3. On completion, optionally request 1080P or 4K upgrade
4. Download video URLs promptly (they expire after 14 days)
