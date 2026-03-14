# kie-cli

CLI for [Kie.AI](https://kie.ai) - Generate images and videos with multiple AI models.

## Supported Models

| Provider          | Type  | Models                                                    |
| ----------------- | ----- | --------------------------------------------------------- |
| **Kling**         | Video | 3.0, 2.6, v2.5 Turbo, v2.1 Master/Pro/Standard, AI Avatar |
| **Veo 3**         | Video | veo3 (quality), veo3_fast                                 |
| **Nano Banana 2** | Image | nano-banana-2 (up to 4K, Google Search grounding)         |

## Installation

```bash
npm install -g kie-cli
```

## Setup

```bash
# Set your API key (interactive, masked input)
kie auth

# Verify current key
kie auth --show
```

The key is stored in `~/.config/kie/config.json`. The `KIE_API_KEY` environment variable can also be used and takes priority over the stored key.

## Quick Start

```bash
# Generate a video (default: Kling 2.6, 9:16, 5s)
kie gen "a cat playing piano"

# Generate and wait for result
kie gen "a sunset over the ocean" --wait

# Generate with Veo 3
kie gen "a cinematic drone shot" --provider veo3

# Generate an image
kie gen "a watercolor cat" --provider nano-banana

# Image-to-video
kie gen "animate this scene" --image https://example.com/photo.jpg

# Check task status
kie status abc123

# Check credits
kie credits
```

## Commands

### `kie gen <prompt>`

Generate an image or video.

| Flag                 | Description                           | Default |
| -------------------- | ------------------------------------- | ------- |
| `-p, --provider`     | `kling`, `veo3`, `nano-banana`        | `kling` |
| `-m, --model`        | Model ID (see Model Reference below)  | auto    |
| `-a, --aspect-ratio` | Aspect ratio                          | `9:16`  |
| `-d, --duration`     | Video duration in seconds             | `5`     |
| `-i, --image`        | Input image URL (image-to-video)      | -       |
| `--tail-image`       | End frame image (kling v2.1 pro only) | -       |
| `--sound`            | Enable sound (kling 2.6/3.0)          | off     |
| `--negative-prompt`  | Negative prompt (kling v2.1/v2.5)     | -       |
| `--cfg-scale`        | CFG scale 0-1 (kling v2.1/v2.5)       | `0.5`   |
| `--mode`             | Quality: `std`, `pro` (kling 3.0)     | `std`   |
| `--resolution`       | `1K`, `2K`, `4K` (nano-banana)        | `1K`    |
| `--format`           | `jpg`, `png` (nano-banana)            | `jpg`   |
| `--seed`             | Random seed (veo3)                    | -       |
| `--google-search`    | Google search grounding (nano-banana) | off     |
| `--callback`         | Webhook callback URL                  | -       |
| `-w, --wait`         | Poll until generation completes       | off     |

### `kie auth`

Set your API key interactively (masked input). Use `--show` to view current key status. Stored in `~/.config/kie/config.json`.

### `kie status <taskId>`

Check generation status. Provider is auto-detected from the task ID format.

### `kie credits`

Display remaining API credits.

### `kie extend <taskId> <prompt>`

Extend a Veo 3 video with additional content.

| Flag          | Description         | Default |
| ------------- | ------------------- | ------- |
| `-m, --model` | `fast`, `quality`   | `fast`  |
| `--seed`      | Random seed         | -       |
| `--callback`  | Webhook URL         | -       |
| `-w, --wait`  | Poll until complete | off     |

### `kie upscale <taskId>`

Upscale a Veo 3 video to higher resolution.

| Flag            | Description              | Default |
| --------------- | ------------------------ | ------- |
| `-q, --quality` | `1080p`, `4k`            | `1080p` |
| `--index`       | Video index              | `0`     |
| `--callback`    | Webhook URL (4K only)    | -       |
| `-w, --wait`    | Poll until complete (4K) | off     |

## Model Reference

### Kling

| Model ID                              | Type                                     |
| ------------------------------------- | ---------------------------------------- |
| `kling-3.0/video`                     | Text/Image-to-video (latest, multi-shot) |
| `kling-2.6/text-to-video`             | Text-to-video (default)                  |
| `kling-2.6/image-to-video`            | Image-to-video                           |
| `kling-2.6/motion-control`            | Motion control                           |
| `kling/v2-5-turbo-text-to-video-pro`  | Text-to-video (fast)                     |
| `kling/v2-5-turbo-image-to-video-pro` | Image-to-video (fast)                    |
| `kling/v2-1-master-text-to-video`     | Text-to-video (high quality)             |
| `kling/v2-1-master-image-to-video`    | Image-to-video (high quality)            |
| `kling/v2-1-pro`                      | Image-to-video + tail frame              |
| `kling/v2-1-standard`                 | Image-to-video (standard)                |
| `kling/ai-avatar-standard`            | AI Avatar                                |
| `kling/ai-avatar-pro`                 | AI Avatar (high quality)                 |

### Veo 3

| Model ID    | Description               |
| ----------- | ------------------------- |
| `veo3_fast` | Fast generation (default) |
| `veo3`      | Higher quality            |

### Nano Banana 2

| Model ID        | Description      |
| --------------- | ---------------- |
| `nano-banana-2` | Image generation |

## Defaults

| Setting      | Default                  |
| ------------ | ------------------------ |
| Provider     | `kling`                  |
| Aspect Ratio | `9:16` (TikTok vertical) |
| Duration     | `5` seconds              |
| Resolution   | Lowest per provider      |

## Development

```bash
# Install dependencies
npm install

# Run in dev mode
npm run dev -- gen "test prompt"

# Build
npm run build

# Link globally
npm link
```

## License

MIT
