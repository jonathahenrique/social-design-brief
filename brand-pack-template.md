# Brand Pack Template — social-design-brief

Use esse template pra adicionar uma marca nova à skill.

1. Copie esse arquivo pra `brands/<nome-da-marca>.md`
2. Preencha cada bloco abaixo
3. A skill passa a usar automaticamente

---

```markdown
# Brand Pack — {{NOME_COMPLETO_DA_MARCA}}

> Versão exportável (pra geração via ChatGPT/qualquer gerador de imagem).
> {{DESCRIÇÃO_CURTA_DO_PRODUTO}}
> Source oficial (LP em prod): {{PATH_DA_LP_OU_URL}}
> Sincronizado: {{DATA}}

## Faculty / Pessoa-chave (se houver)

- **{{NOME}}** — {{CARGO/AUTORIDADE}}
- {{CREDENCIAIS PRINCIPAIS}}
- {{FORMAÇÃO/EXPERIÊNCIA}}

## Descrição facial (importante pra ChatGPT — preservar identidade)

- {{NACIONALIDADE/ETNIA/IDADE}}
- {{CABELO: cor, estilo, completude}}
- {{ÓCULOS: usa ou não — IMPORTANTE}}
- {{PELE: tom}}
- {{EXPRESSÃO PADRÃO}}
- {{VESTUÁRIO TÍPICO}}
- {{POSE PADRÃO da foto canônica}}

## NÃO CONFUNDIR com

- **{{MARCA_SIMILAR_1}}** — {{diferença visual chave}}
- **{{MARCA_SIMILAR_2}}** — {{diferença visual chave}}

## Tema

{{TEMA_DA_MARCA}}. Vocabulário e mood orbitam em volta de:
- {{TEMA_1}}
- {{TEMA_2}}
- {{TEMA_3}}

## Paleta

| Token | Hex | Uso |
|---|---|---|
| **{{NOME_COR_PRIMARY}}** | `{{HEX}}` | {{USO}} |
| {{NOME_COR_2}} | `{{HEX}}` | {{USO}} |
| **{{NOME_BG_PRINCIPAL}}** | `{{HEX}}` | Background principal |
| **{{NOME_TEXT_PRIMARY}}** | `{{HEX}}` | Texto principal |
| {{COR_MUTED}} | `{{HEX}}` | Body text, descrições |

**Combinação canônica:** {{BG}} + {{TEXT}} + {{ACCENT}}.

## Tipografia (descrições pra prompt — NÃO mencionar nomes literais)

- **Display:** "{{DESCRIÇÃO_FONTE_DISPLAY}}"
- **Body:** "{{DESCRIÇÃO_FONTE_BODY}}"
- **Mono:** "{{DESCRIÇÃO_FONTE_MONO}}"

**ATENÇÃO:** NUNCA escrever nomes de fontes literais no prompt do ChatGPT — vira texto renderizado literal.

## Mood

- {{ADJETIVO_1}}, {{ADJETIVO_2}}, {{ADJETIVO_3}}
- {{REFERÊNCIAS_VISUAIS: ex. "Stripe / Linear / Notion"}}
- {{ESTILO_DE_FOTOGRAFIA: documentary / cinematic / studio}}

**NÃO é:** {{LISTAR_O_QUE_NÃO_QUER}}

## Assets canônicos (paths locais)

| Asset | Path |
|---|---|
| Logo principal | `{{PATH_LOGO}}` |
| Foto pessoa-chave | `{{PATH_FOTO}}` |
| {{OUTRO_ASSET}} | `{{PATH}}` |

## Identidade do produto

- **Nome:** {{NOME_PRODUTO}} (mencionar se é IMUTÁVEL)
- **Realização:** {{ORGANIZAÇÃO}}
- **Preço:** {{PREÇO}}
- **Driver de valor:** {{DIFERENCIAL_PRINCIPAL}}

## Prompt block reutilizável (copy/paste pro ChatGPT)

```
BRAND IDENTITY {{MARCA}}:
- Primary background: {{DESCRIÇÃO_BG}} (exact color {{HEX_BG}})
- Brand accent: {{DESCRIÇÃO_ACCENT}} (exact color {{HEX_ACCENT}})
- Body text: {{DESCRIÇÃO_TEXT}} (exact color {{HEX_TEXT}})
- Typography: {{DESCRIÇÃO_FONTES}}
- Mood: {{MOOD_DESCRIPTION}}. Like {{REFERÊNCIAS}}. NOT {{O_QUE_NÃO}}.
- Recurring scene: {{CENAS_TÍPICAS_DA_MARCA}}
- Lighting: {{TIPO_DE_LUZ}}
```

## Layouts recomendados

3-5 layouts do `layout-catalog.md` que mais combinam com essa marca:

1. **{{NOME_LAYOUT_1}}** — {{adaptação específica pra esta marca}}
2. **{{NOME_LAYOUT_2}}** — {{adaptação específica pra esta marca}}
3. **{{NOME_LAYOUT_3}}** — {{adaptação específica pra esta marca}}

## Restrições (sempre incluir no prompt)

- ✅ {{REGRA_OBRIGATÓRIA_1}}
- ✅ {{REGRA_OBRIGATÓRIA_2}}
- ❌ {{O_QUE_NUNCA_FAZER_1}}
- ❌ {{O_QUE_NUNCA_FAZER_2}}

## Quando usar essa marca

- {{CASO_DE_USO_1}}
- {{CASO_DE_USO_2}}
- {{CASO_DE_USO_3}}
```

---

## Tempo médio pra criar brand pack novo

~10-15 min se você já tem:
- Paleta hex
- Logo PNG/SVG
- 1-2 fotos de pessoas-chave
- Descrição da marca

Depois disso a skill funciona pra essa marca igual ao NBR 5410.
