# KIE CLI - Provider Defaults

## Global Defaults

| Setting      | Default                       | Options                  |
| ------------ | ----------------------------- | ------------------------ |
| Aspect Ratio | `9:16` (TikTok vertical)      | `16:9`, `1:1`            |
| Resolution   | Lowest available per provider | See per-provider options |

## Per-Provider Defaults

### Kling

| Setting      | Default           | Options                             |
| ------------ | ----------------- | ----------------------------------- |
| Model        | `kling-3.0/video` | All v2.1, v2.5, v2.6, v3.0 variants |
| Aspect Ratio | `9:16`            | `16:9`, `1:1`                       |
| Duration     | `10`              | `3`-`15` seconds                    |
| Mode         | `std` (720p)      | `pro` (1080p)                       |

### Veo 3

| Setting      | Default     | Options          |
| ------------ | ----------- | ---------------- |
| Model        | `veo3_fast` | `veo3` (quality) |
| Aspect Ratio | `9:16`      | `16:9`, `Auto`   |
| Resolution   | 1080P       | 4K               |

### Nano Banana 2

| Setting       | Default         | Options                                                                                             |
| ------------- | --------------- | --------------------------------------------------------------------------------------------------- |
| Model         | `nano-banana-2` | -                                                                                                   |
| Aspect Ratio  | `9:16`          | `1:1`, `16:9`, `1:4`, `1:8`, `2:3`, `3:2`, `3:4`, `4:1`, `4:3`, `4:5`, `5:4`, `8:1`, `21:9`, `auto` |
| Resolution    | `1K`            | `2K`, `4K`                                                                                          |
| Output Format | `jpg`           | `png`                                                                                               |

## Notes

- All providers share the same base URL: `https://api.kie.ai`
- Authentication: `Authorization: Bearer YOUR_API_KEY`
- All tasks are async: submit -> get `taskId` -> poll or callback
