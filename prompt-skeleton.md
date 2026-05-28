# Prompt Skeleton — social-design-brief (versão ChatGPT)

Template do prompt que vai dentro de `PROMPT.md`. Substituir `{{placeholders}}` em cada gen.

> **Diferenças em relação ao skeleton da `social-design` (Higgsfield):**
> - Mais conversacional, menos CSS-like
> - Instrui anexos primeiro
> - Aspect ratio descrito em palavras
> - CRITICAL block no fim com acentos mapeados

## Estrutura padrão (sempre nesta ordem)

```
You are generating a {{TIPO_DA_PEÇA}} for {{MARCA}} ({{DESCRIÇÃO_CURTA_DA_MARCA}}).
Output format: vertical {{ASPECT_RATIO}} ratio image (e.g., 1024x1280 for 4:5).

USE THE ATTACHED IMAGES AS FOLLOWS:
- Attached image #1 — LAYOUT REFERENCE (composition, prop placement, mood). Match the structure but adapt all colors/typography to the brand below.
- Attached image #2 — LOGO. Use as visual style reference for the brand mark.
- Attached image #3 — PERSON FACE (if present). Preserve face features exactly; do not stylize or change age.

INSPIRED BY THE LAYOUT IN THE FIRST ATTACHED IMAGE — {{DESCRIÇÃO_CURTA_DA_REF_ORIGINAL}}.

ADAPT FOR {{MARCA}}:
- {{ADAPTAÇÃO_1}}
- {{ADAPTAÇÃO_2}}
- {{ADAPTAÇÃO_3}}

BRAND IDENTITY {{MARCA}}:
- Primary background: {{BG_DESCRIPTION}} (exact color {{BG_HEX}})
- Primary accent: {{ACCENT_DESCRIPTION}} (exact color {{ACCENT_HEX}})
- Secondary text color: {{TEXT_DESCRIPTION}} (exact color {{TEXT_HEX}})
- Typography: {{TYPOGRAPHY_DESCRIPTION}}
- Mood: {{MOOD_DESCRIPTION}}. Should feel like {{MOOD_REFERENCES}}. NOT {{O_QUE_NAO_QUERER}}.

LAYOUT (top to bottom):
- TOP: {{TOP_CONTENT}}
- HERO / CENTER: {{HERO_CONTENT}}
- BOTTOM: {{BOTTOM_CONTENT}}

HERO SUBJECT(S) (the main visual element):
- {{HERO_DETAILED_DESCRIPTION}}

PROPS / SECONDARY ELEMENTS:
- {{PROP_1}}
- {{PROP_2}}

BACKGROUND DETAIL: {{BACKGROUND_DESCRIPTION}}

STYLE: {{ESTILO_VISUAL}}. Realistic documentary photography (NOT cartoon, NOT 3D illustration, NOT AI-generated-looking).

EXACT PORTUGUESE TEXT TO RENDER (use these strings exactly, preserving every accent):
- Eyebrow: '{{EYEBROW_TEXT}}'
- Headline: '{{HEADLINE_TEXT}}'
- Body: '{{BODY_TEXT}}'
- CTA: '{{CTA_TEXT}}'
- Footer: '{{FOOTER_TEXT}}'

CRITICAL — Render every accent exactly as written. Do not change spelling, do not translate. Preserve every: {{LIST_OF_ACCENTS_USED}}.

Generate ONE image. Vertical {{ASPECT_RATIO}}. High quality.
```

## Exemplo preenchido (Poster Plywood NBR 5410)

```
You are generating an editorial documentary social media ad for "Como Aplicar a NBR 5410" (a Brazilian electrical engineering course about norm application).
Output format: vertical 4:5 ratio image (1024x1280).

USE THE ATTACHED IMAGES AS FOLLOWS:
- Attached image #1 — LAYOUT REFERENCE (a printed poster taped to a concrete pole, urban documentary). Match the structure but adapt to a poster pinned to a wooden plywood board in a Brazilian construction site.
- Attached image #2 — LOGO. Use as visual style reference for the NBR 5410 brand mark (red shield with Brazilian outlet icon).

INSPIRED BY THE LAYOUT IN THE FIRST ATTACHED IMAGE — a printed paper poster fixed to a vertical surface with visible tape strips, soft-focus background, headline in mixed red+black bold sans-serif, CTA pill at the bottom.

ADAPT FOR NBR 5410:
- Poster pinned to wooden OSB plywood board (NOT a pole — use thumbtacks + transparent packing tape).
- Background: Brazilian residential construction site interior, blurred natural daylight, a real residential electrical panel (QDC) partially visible to the right with 4-6 simple white DIN-rail breakers.
- ONLY Brazilian NBR 14136 outlets if visible (3 round pins). NEVER American or European plugs.
- Logo in top-left of poster: small red shield with outlet icon.

BRAND IDENTITY NBR 5410:
- Primary background: warm cream off-white (exact color #FAF8F5, not pure white).
- Primary accent: vibrant red (exact color #DC2626).
- Secondary text: deep ink near-black (exact color #0C1119) on poster, muted slate (#475569) for body.
- Typography: bold geometric sans-serif similar to Manrope for headline; clean humanist sans-serif similar to Inter for body; uppercase monospaced similar to JetBrains Mono for eyebrow and CTA.
- Mood: editorial premium institutional, documentary outdoor authenticity. Should feel like Stripe / Linear / Mercury design language. NOT cinematic dramatic, NOT cyberpunk, NOT shock-marketing.

LAYOUT (top to bottom):
- TOP of poster: small red shield logo (top-left) + tiny eyebrow text in uppercase monospaced
- HERO: huge bold display headline 3 lines centered
- MIDDLE: smaller body text 2 lines
- BOTTOM: red gradient CTA pill full-width

HERO SUBJECT: the printed poster pinned to plywood with 4 thumbtacks + transparent tape strips visible.

PROPS:
- 4 metal thumbtacks at corners
- 2 transparent packing tape strips holding top and bottom
- A small folded technical drawing peeking from edge

BACKGROUND DETAIL: Real Brazilian residential construction site interior, blurred warm daylight, partial scaffolding, residential QDC visible right side with simple white DIN-rail breakers.

STYLE: Documentary outdoor work-site photography, authentic gritty real, slight grain. Realistic photography (NOT cartoon, NOT 3D illustration, NOT staged-stocky).

EXACT PORTUGUESE TEXT TO RENDER (use these strings exactly):
- Eyebrow (uppercase): 'POTÊNCIA EDUCAÇÃO · CURSO DE EXTENSÃO'
- Headline line 1: 'Quem domina'
- Headline line 2 (italic serif): 'a norma'
- Headline line 3 (huge red): 'NBR 5410'
- Headline line 4: 'manda na obra.'
- Body: 'Com Hilton Moreno, Coordenador da CE de Baixa Tensão da ABNT. 11 módulos, 37 aulas.'
- CTA: 'Inscrições abertas →'

CRITICAL — Render every accent exactly as written: Ê in POTÊNCIA, Ç in EDUCAÇÃO, Ã in EXTENSÃO, ç in diferença, ê in você, ã in Tensão, ó in módulos, ç+õ in Inscrições.

Generate ONE image. Vertical 4:5. High quality.
```

## Regras do skeleton

### 1. Ordem dos blocos importa

Mantém prioridade:
1. Tipo + ratio
2. **Instruções dos anexos** (novo — não tinha no Higgsfield)
3. INSPIRED BY
4. ADAPT FOR
5. BRAND IDENTITY (paleta + tipo + mood)
6. LAYOUT por região
7. HERO subject
8. PROPS
9. BACKGROUND
10. STYLE
11. EXACT PORTUGUESE TEXT (strings literais)
12. CRITICAL (último, peso máximo)

### 2. Linguagem do prompt

- **Inglês > português** pra instruções estruturais (ChatGPT entende melhor)
- **Português pra textos da peça** entre aspas simples ('STRING'). Lista todos os textos juntos no fim.
- **Hex codes opcionais** mas úteis (`#FAF8F5`)
- **Cor descrita por nome quando intuitiva** ("warm cream off-white", "vibrant red", "deep ink")
- **Estilo descritivo concreto**: "bold geometric sans-serif similar to Manrope", não "bold modern font"

### 3. Bloco CRITICAL final

Sempre incluir:
1. **Lista de acentos** mapeada por palavra: `Ê in POTÊNCIA, Ç in EDUCAÇÃO, Ã in EXTENSÃO`
2. **Regra de identidade** se usar pessoa anexada: "The face MUST match the attached portrait reference exactly. Do NOT add glasses, do NOT change hair color."
3. **Aspect ratio strict**: "Vertical 4:5"
4. **Quantidade**: "Generate ONE image" (evita batch automático)

### 4. Anexos — ordem importa

Quando a pessoa anexa no ChatGPT, ordem é importante. Documentar em `DIRETRIZES.md`:

| Posição | Conteúdo |
|---|---|
| 1ª | Ref Pinterest (layout) — sempre |
| 2ª | Logo da marca — se aplicável |
| 3ª | Foto de pessoa — se aplicável |
| 4ª | Foto secundária / textura / cenário — opcional |

ChatGPT geralmente lê os anexos na ordem de upload.
