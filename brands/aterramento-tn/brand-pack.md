# Brand Pack — Aterramento TN na Prática (Potência Educação)

> Curso técnico sobre aterramento elétrico em sistema TN (esquemas TN-S, TN-C, TN-C-S) — Potência Educação.
> Realização: Potência Educação · Faculty: Hilton Moreno (Coordenador CE-3 ABNT).
> Source oficial (LP em prod): `~/Projects/hmnews/potencia-educacao-paginas/app/(aterramentotn)/`

## Faculty

- **Hilton Moreno** — Coordenador da Comissão de Estudos de Baixa Tensão da ABNT (CE-3)
- Mesmo faculty do NBR 5410, Pós, IE 4.0
- 40+ anos nas comissões ABNT (desde 1985)
- USP — Escola Politécnica, turma 1980

## Descrição facial Hilton (importante)

Igual ao NBR 5410 / Pós / IE 4.0:
- Brasileiro, ~65-70 anos
- Cabelo branco/prateado completo, combed back
- **SEM ÓCULOS**
- Pele clara, expressão calma confiante
- Veste blazer escuro mandarim/preto

## NÃO CONFUNDIR com

- **NBR 5410** — paper warm + red `#DC2626`
- **NBR 5419** — gold + navy (SPDA)
- **IE 4.0** — dark navy + cyan
- **Pós** — paper warm + electric blue

## Tema

Aterramento TN = **Sistema de aterramento TN** (TN-S, TN-C, TN-C-S) — base de segurança elétrica. Vocabulário:
- Aterramento de proteção e funcional
- Esquemas TN-S / TN-C / TN-C-S / TT / IT
- Condutor PE, neutro, ponto de aterramento
- Malha de aterramento, hastes copperweld
- Equipotencialização, BEP (Barramento de Equipotencialização Principal)
- Sistemas industriais e residenciais
- Segurança contra choques elétricos

## Paleta — Safety High-Vis Industrial

| Token | Hex | Uso |
|---|---|---|
| **Brand Yellow High-Vis (PRIMARY)** | `#FFCB05` | CTA, highlights, palavras-chave (cor de placa de aviso elétrico) |
| Brand Yellow Bright | `#FFD60A` | Hover, accents secundários |
| Brand Yellow Deep | `#B07F0C` | Texto sobre brand-soft |
| **BG Deep (DARK PRIMARY)** | `#0B0D10` | Background principal escuro (NÃO preto puro) |
| BG Surface | `#14171C` | Cards, surfaces sobre dark |
| BG Elevated | `#1D2128` | Hover de card, elementos destacados |
| BG Paper (light alt) | `#FAFAF7` | Background variante clara |
| BG Canvas | `#FFFFFF` | Cards em contexto claro |
| **Text on dark** | `#F5F5F5` | Texto principal sobre BG deep |
| Text muted dark | `#A3A3A3` | Body secundário sobre dark |
| **Text Ink (on light)** | `#0B0D10` | Texto sobre paper |
| Success | `#10B981` | Checkmarks ✓ |

**Combinação canônica:** BG deep `#0B0D10` + text off-white `#F5F5F5` + accent yellow high-vis `#FFCB05`.

**Filosofia:** Yellow high-vis = placa de aviso elétrico (sinalização industrial). Dark BG = ambiente técnico/industrial. Premium safety industrial.

## Tipografia (descrições pra prompt — NÃO mencionar nomes literais)

- **Display:** "bold geometric sans-serif similar to Manrope, industrial feel, tight letter-spacing"
- **Body:** "clean humanist sans-serif similar to Inter"
- **Mono:** "uppercase monospaced caps similar to JetBrains Mono"

## Mood

- **Industrial-safety premium** — placa de aviso elétrico × Apple Vision Pro
- Cinematic dark com warm yellow spill
- Estética de painel elétrico real iluminado
- High contrast yellow on dark

**NÃO é:** cyberpunk, retrowave, paper warm editorial (isso é NBR 5410), light Apple-clean.

## Assets canônicos (paths relativos à skill)

| Asset | Path (relative to skill) |
|---|---|
| Logo principal | `brands/aterramento-tn/assets/logo-aterramento-tn.png` |
| Portrait Hilton | `brands/aterramento-tn/assets/hilton-moreno.jpg` |
| Mockup norma 5410:2024 | `brands/aterramento-tn/assets/mockup_normas_5410_2024_1.webp` |

## Identidade do produto

- **Nome do curso:** "Aterramento TN na Prática"
- **Realização:** Potência Educação
- **Faculty:** Hilton Moreno
- **Foco técnico:** Esquemas TN-S, TN-C, TN-C-S na prática (residencial e industrial)
- **Acesso:** 2 anos
- **Driver de valor:** Aterramento é a BASE de segurança da NBR 5410. Sem dominar TN, não dominar 5410.

## Prompt block reutilizável (copy/paste pro ChatGPT)

```
BRAND IDENTITY ATERRAMENTO TN (Aterramento TN na Prática — Potência Educação):
- Primary background: deep ink almost-black (exact color #0B0D10, NOT pure black, slight blue undertone)
- Brand accent: yellow high-vis safety (exact color #FFCB05, like an electrical warning sign yellow)
- Surface elevated: dark gray (exact color #1D2128)
- Text on dark: warm off-white (exact color #F5F5F5, NOT pure white)
- Muted text on dark: medium gray (exact color #A3A3A3)
- Typography: bold geometric sans-serif similar to Manrope, industrial feel, for headlines. Clean humanist sans-serif similar to Inter for body. Uppercase monospaced caps similar to JetBrains Mono for eyebrows.
- Mood: industrial-safety premium, like an electrical panel control room. Dark BG with warm yellow high-vis accents. NOT cyberpunk, NOT retrowave, NOT paper editorial, NOT light Apple-clean.
- Recurring scene: Brazilian residential or industrial grounding setup, copper-weld ground rod, BEP (main equipotential bonding bar), TN-S panel wiring, electrical safety warning signs
- Lighting: dark moody cinematic with warm yellow spill (like a real electrical control room)
```

## Layouts recomendados

3-5 layouts do `layout-catalog.md` que mais combinam:

1. **Dark Lâmpada Hero** — adapt cyan glow pra yellow high-vis glow
2. **Notepad countdown industrial** — dark wood desk + props elétricos brasileiros + yellow accents
3. **Sign walking minimal** — placa industrial yellow high-vis com warning text
4. **Speaker palco dark** — Hilton no palco com telão yellow atrás
5. **VS Comparative** — instalação ATERRADA correta vs instalação SEM aterramento

## Restrições (sempre incluir no prompt)

- ✅ Logo: anexar PNG real
- ✅ Foto Hilton: anexar sempre se for usar
- ❌ Marcas reais (Schneider/Siemens/ABB/STECK) — sanitizar
- ❌ Hilton com óculos
- ❌ Hilton com cabelo escuro
- ✅ Tomadas NBR 14136 (3 pinos redondos) quando aparecerem
- ✅ Símbolos PE (Protective Earth), terra (⏚)
- ✅ Fios verde-amarelo listrado (PE brasileiro)
- ❌ Plugs americanos (Type A/B) ou europeus (Type C/F)

## Quando usar

- Posts/ads do curso "Aterramento TN na Prática"
- Educacionais sobre TN-S, TN-C, esquemas de aterramento
- Awareness de segurança elétrica
- Comunicação cruzada com NBR 5410 (aterramento é capítulo central da norma)
