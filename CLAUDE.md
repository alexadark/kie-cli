# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**kie-cli** is a TypeScript CLI tool for generating images and videos via the [Kie.AI](https://kie.ai) unified API. It wraps three providers behind a single interface:

- **Kling** (video): 12 models including 3.0, 2.6, v2.5 turbo, v2.1 master/pro/standard, AI avatars, motion control
- **Veo 3** (video): Google Veo 3.1 with text-to-video, image-to-video, extend, upscale (1080p/4K)
- **Nano Banana 2** (image): Google image generation with search grounding, up to 4K resolution

All providers share `https://api.kie.ai/api/v1` as base URL and use Bearer token auth.

## API Architecture

### Unified Task Pattern

All generation follows an async task pattern:

1. **Create task** → returns `taskId`
2. **Poll status** → `waiting` → `queuing` → `generating` → `success`/`fail`
3. **Optional webhook** → `callBackUrl` parameter for push notifications

### Endpoints

| Action        | Kling / Nano Banana            | Veo 3                              |
| ------------- | ------------------------------ | ---------------------------------- |
| Create        | `POST /jobs/createTask`        | `POST /veo/generate`               |
| Status        | `GET /jobs/recordInfo?taskId=` | `GET /veo/record-info?taskId=`     |
| Credits       | `GET /chat/credit`             | `GET /chat/credit`                 |
| Extend        | N/A                            | `POST /veo/extend`                 |
| Upscale 1080p | N/A                            | `GET /veo/get-1080p-video?taskId=` |
| Upscale 4K    | N/A                            | `POST /veo/get-4k-video`           |

### Model IDs (for `model` field in createTask)

**Kling:**

- `kling-3.0/video` - latest, multi-shot, 3-15s duration, elements support
- `kling-2.6/text-to-video`, `kling-2.6/image-to-video`, `kling-2.6/motion-control`
- `kling/v2-5-turbo-text-to-video-pro`, `kling/v2-5-turbo-image-to-video-pro`
- `kling/v2-1-master-text-to-video`, `kling/v2-1-master-image-to-video`
- `kling/v2-1-pro`, `kling/v2-1-standard`
- `kling/ai-avatar-standard`, `kling/ai-avatar-pro`

**Veo 3:** `veo3` (quality) or `veo3_fast` (default) - set via `model` param in `/veo/generate`

**Nano Banana:** `nano-banana-2` - set via `model` param in `/jobs/createTask`

### Webhook Verification (Kling)

HMAC-SHA256: sign `taskId + "." + timestamp` with API key, compare against `X-Webhook-Signature` header.

## Provider Defaults

Global default aspect ratio is `9:16` (TikTok vertical). Resolution defaults to the lowest available per provider.

| Provider      | Default Model          | Aspect Ratio | Resolution | Extra         |
| ------------- | ---------------------- | ------------ | ---------- | ------------- |
| Kling         | `kling-2.6` (standard) | `9:16`       | standard   |               |
| Veo 3         | `veo3_fast`            | `9:16`       | 1080P      |               |
| Nano Banana 2 | `nano-banana-2`        | `9:16`       | `1K`       | format: `jpg` |

See `docs/DEFAULTS.md` for full options per provider.

## API Documentation

Full API docs are in `docs/` organized by provider:

- `docs/kling/` - 14 files covering all Kling models + common API
- `docs/veo3/` - 7 files covering generate, extend, upscale, callbacks
- `docs/nano-banana/` - 1 file for Nano Banana 2 image generation

Always reference these docs when implementing or modifying API integrations.

## Environment

- `KIE_API_KEY` - Kie.AI API key (required for all requests)
