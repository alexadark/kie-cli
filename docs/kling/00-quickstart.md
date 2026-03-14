# KIE AI Market - Quickstart

## Overview

Explore and integrate cutting-edge AI models for image generation, video creation, and audio processing through unified APIs.

The Market provides access to a comprehensive collection of state-of-the-art AI models through a unified API platform.

## Getting Started

1. **Choose Your Model**: Select the AI model that best fits your use case
2. **Get API Key**: Visit the [API Key Management Page](https://kie.ai/api-key) for credentials
3. **Integrate**: Follow model-specific documentation
4. **Start Creating**: Begin generating content using your chosen AI model

## Authentication

### Authorization Header

```
Authorization: Bearer YOUR_API_KEY
```

**Security Warning:** Keep your API Key strictly confidential. Never expose it in client-side code or public repositories.

## Base URLs and Endpoints

### Create Task

```
POST https://api.kie.ai/api/v1/jobs/createTask
```

### Query Task Status

```
GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId={taskId}
```

### Check Credits

```
GET https://api.kie.ai/api/v1/chat/credit
```

## Available Models

### Image Models

- **Z-image**: Creative generation with artistic styles (v4.0, v4.5)
- **Grok Imagine**: Photorealistic images, text-to-image, upscaling
- **Flux-2**: Text-to-image and image-to-image generation
- **Google Imagen**: Imagen4 Fast/Ultra capabilities
- **Ideogram**: Character consistency features
- **Qwen**: Multilingual generation and editing
- **Recraft**: Professional upscaling and background removal
- **Topaz**: Enhancement and upscaling tools

### Video Models

- **Kling**: Video generation and AI avatars (v2.1, v2.5, v2.6, v3.0)
- **Sora2**: Text and image-to-video generation
- **Bytedance**: Fast video generation (v1 Pro/Lite)
- **Hailuo**: Multiple style capabilities
- **Wan**: Turbo performance options
- **Grok Imagine Video**: Text/image-to-video

### Audio Models

- **ElevenLabs**: Text-to-speech, speech-to-text, audio isolation

### Chat Models

- **Gemini 2.5 Flash**: Fast completions with reasoning
- **Gemini 2.5 Pro**: Advanced reasoning and long-context

## Pricing Structure

- **Image Models**: 10-50 credits per generation
- **Video Models**: 100-500 credits per generation
- **Language Models**: Per-token pricing

## Additional Features

- **Webhook Callbacks**: Optional notifications eliminate polling requirements
- **Unified API Structure**: All models follow a consistent API structure for ease of integration

## Support

- **Email**: support@kie.ai
- **Community**: Discord and Telegram available from the dashboard
- **Resources**: Model-specific guides in navigation

## Platform Links

- **Market/Models**: https://kie.ai/market
- **Pricing**: https://kie.ai/pricing
- **API Key Management**: https://kie.ai/api-key
- **Task Logs and History**: https://kie.ai/logs
