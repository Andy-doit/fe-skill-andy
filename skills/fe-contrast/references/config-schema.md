# verify-contrast.mjs — config schema

Colours: `"#RRGGBB"`, `"#RGB"`, or `{ "r": 0-255, "g": 0-255, "b": 0-255 }`.

```jsonc
{
  "title": "Report title",              // optional
  "level": "AA",                        // "AA" (default) or "AAA"; --level overrides
  "pairs": [                            // optional: explicit fg/bg checks
    {
      "name": "Body text",              // label in the report
      "fg": "#111827",
      "bg": "#FFFFFF",
      "size": "normal",                 // "normal" | "large" (≥ 24px, or ≥ 18.66px bold) | "ui" (non-text, 3:1)
      "bgAlpha": 0.8,                   // optional: bg is translucent with this alpha...
      "under": "#0E3261"                // ...over this colour (required when bgAlpha is set)
    }
  ],
  "header": {                           // optional: translucent header over page sections while scrolling
    "surface": "#FAF9F6",               // header background colour (before alpha)
    "alphas": { "top": 0.55, "scrolled": 0.86 },
    "texts": { "regular": "#0D0D0D", "active": "#123B6E" },
    "size": "normal",
    "scroll": { "min": 0, "max": 3500, "step": 100, "scrolledThreshold": 24 },
    "sections": [ { "name": "Hero", "color": "#FAF9F6", "range": [0, 600] } ]
  }
}
```

At least one of `pairs` or `header` must be present.

Thresholds used (WCAG 2.2, unchanged from 2.1 for contrast):

| size | AA | AAA |
|---|---|---|
| normal | 4.5:1 | 7:1 |
| large | 3:1 | 4.5:1 |
| ui (1.4.11 non-text) | 3:1 | 3:1 |

Limitations: `backdrop-filter: blur()` is not modelled (blur averages the colours under the header; test the darkest and lightest section colours as worst cases). Gradients and images: test each extreme colour as a separate pair.
