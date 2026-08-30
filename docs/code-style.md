# Gaya Kode

## JavaScript
Gunakan Biome 2.5.10 dan Node 22.

```bash
npm run format
npm run lint
npm run fix
npm run check
```

## CSS
Gunakan Tailwind CSS 4, design token `@theme`, `@layer`, dan utility langsung pada markup. CSS manual hanya untuk kebutuhan yang tidak praktis dengan utility.

## PHP
Ikuti gaya CodeIgniter 4. View merender data yang disuplai CMS, selalu escape output, dan tidak melakukan query atau business logic.

## Playground
`playground/data/demo.json` boleh memakai nilai demo, tetapi bentuk field harus mengikuti data yang disuplai CMS.
