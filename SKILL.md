---
name: social-design-brief
description: Produz um PACOTE EXPORTÁVEL (pasta com PROMPT.md + imagens de referência + DIRETRIZES.md) pronto pra qualquer pessoa do time abrir o ChatGPT (ou outro gerador de imagem), anexar as refs, colar o prompt e gerar. Não gera imagem por si só — produz o briefing pronto. USE quando o usuário pedir "monta um brief de ad", "gera prompt + refs", "prepara pacote pra Flávia gerar no ChatGPT", "exporta briefing", ou qualquer variação onde a geração final será feita por outra pessoa em outra ferramenta. NÃO usar pra geração via Higgsfield (use social-design pra isso) nem pra análise de pasta de refs (use design-refs-analyzer).
---

# social-design-brief — Pacote de briefing pronto pra gerar em ChatGPT

Skill de **propósito único**: produz uma pasta com tudo que uma pessoa precisa pra abrir o **ChatGPT (ou qualquer gerador de imagem com suporte a anexos)**, gerar uma arte de social media seguindo um brand pack + layout específico, sem precisar do Claude e sem precisar do Higgsfield MCP.

**Não gera imagem.** Produz o BRIEFING completo pra alguém gerar.

## Por que existe (separação de skills)

| Skill | Quando | Output |
|---|---|---|
| `pinterest-board-download` | Tem URL de board do Pinterest | Pasta com pins baixados |
| `design-refs-analyzer` | Tem pasta com refs e quer análise visual | `_report.html` filtrável |
| `social-design` (Higgsfield) | Usuário tem Higgsfield e gera direto | PNG final |
| **`social-design-brief` (esta)** | **Vai gerar em ChatGPT/outro tool fora do Claude** | **Pasta com PROMPT.md + refs anexáveis** |

## Quando invocar

- "Monta um brief de ad pra a Flávia gerar no ChatGPT"
- "Prepara pacote de prompt + refs"
- "Exporta briefing dos top 4 layouts"
- "Faz o material pra eu colar no ChatGPT depois"
- "Gera prompt pronto + diretrizes pra alguém do time"

## Quando NÃO invocar

- Gerar imagem agora via Higgsfield → `social-design`
- Baixar refs do Pinterest → `pinterest-board-download`
- Analisar pasta de refs → `design-refs-analyzer`
- Extrair tokens de design de URL → `design-md`

## Workflow

### Passo 1 · Receber briefing do usuário

- Brand pack (ex: NBR 5410)
- Refs visuais escolhidas (paths de arquivos locais)
- Layout do catálogo OU livre
- Copy/headline desejada (ou Claude propõe)
- Aspect ratio (4:5 default pra feed)
- Quantos criativos (1 ou batch)

### Passo 2 · Gerar pacote estruturado

Pra cada criativo, criar uma subpasta `<output-dir>/<n>-<slug>/` contendo:

```
<n>-<slug>/
├── PROMPT.md         # Prompt formatado pra colar no ChatGPT (markdown legível)
├── DIRETRIZES.md     # Restrições + dicas de uso + aspect ratio
├── ref-01-pinterest.png   # Imagem da ref Pinterest (se houver)
├── ref-02-logo.png        # Logo da marca (se aplicável)
├── ref-03-pessoa.webp     # Foto pessoa (se aplicável, ex: Hilton)
└── README.md         # Passo-a-passo direto pra quem vai gerar
```

E na pasta raiz da batelada:

```
<output-dir>/
├── README.md         # Sumário da batelada + como compartilhar
├── BRAND-PACK.md     # Brand pack resumido (paleta + tipografia + restrições)
├── 01-poster-plywood/
├── 02-clipboard/
├── 03-highlighter/
└── 04-notepad/
```

### Passo 3 · Empacotamento opcional

Skill pode rodar `node pack-brief.js <output-dir>` pra zipar a pasta inteira pra compartilhar.

## Estrutura interna da skill

```
~/.claude/skills/social-design-brief/
├── SKILL.md                  # Este arquivo
├── README.md                 # Doc humano
├── package.json              # Sem deps externas (Node puro)
├── pack-brief.js             # Helper opcional pra zipar saída
├── prompt-skeleton.md        # Estrutura do prompt pra ChatGPT
├── layout-catalog.md         # Mesma do social-design (20 layouts mapeados)
├── known-issues.md           # Issues conhecidos (acentos, drift face, etc)
├── brand-pack-template.md    # Template pra criar brand pack novo
├── brands/                   # Brand packs prontos
│   └── nbr5410.md
└── templates/                # Templates dos arquivos de saída
    ├── PROMPT.md.template
    ├── DIRETRIZES.md.template
    ├── README-creative.md.template  # README de cada criativo
    └── README-batch.md.template     # README da batelada
```

## Princípios do prompt pra ChatGPT

Diferente do prompt pra Higgsfield, no ChatGPT:

1. **Mais conversacional, menos CSS-like.** ChatGPT entende bem prosa descritiva.
2. **Inglês na estrutura, português nos textos da peça** — entre aspas simples.
3. **Hex codes ainda úteis** mas não obrigatórios — pode descrever cor por nome (vermelho vibrante, papel cremoso warm).
4. **Aspect ratio via instrução de palavra** — "vertical portrait 4:5 ratio" em vez de só "3:4".
5. **Instruir anexos primeiro** — "use the attached image #1 as composition reference, attached #2 as logo, attached #3 as the person's face".
6. **CRITICAL block no FIM** com 3 elementos: acentos mapeados, identidade da pessoa, ratio strict.
7. **Pedir versão única** — `--count 1`. Geração de batch via ChatGPT é manual.

## Cross-platform

- Node.js puro, sem deps externas
- Paths via `path.join()`
- Funciona em macOS, Linux, Windows (PowerShell/CMD/Git Bash)
- Sem comandos shell Unix-only

## Instalação pra um membro do time

```bash
# macOS / Linux
mkdir -p ~/.claude/skills && cd ~/.claude/skills
git clone https://github.com/jonathahenrique/social-design-brief
# (sem npm install — não tem dep externa)

# Windows
mkdir $env:USERPROFILE\.claude\skills -Force
cd $env:USERPROFILE\.claude\skills
git clone https://github.com/jonathahenrique/social-design-brief
```

A pessoa só usa a skill pra ler brand packs locais e gerar pacotes — não precisa ter Higgsfield, não precisa do Claude API, só precisa do Claude Code.

## Como o membro do time usa o pacote gerado

1. Recebe a pasta zipada (ou URL no Drive)
2. Extrai
3. Pra cada subpasta de criativo:
   - Abre `PROMPT.md` no editor de texto
   - Abre ChatGPT Plus/Pro no navegador
   - Anexa os arquivos `ref-*` que estão na pasta (ordem importa — ler `DIRETRIZES.md`)
   - Cola o conteúdo do `PROMPT.md` no chat
   - Gera a imagem
   - Salva o output no mesmo nome do criativo (`01-poster-plywood-FINAL.png` etc.)
4. Manda os FINAIS de volta pra revisão

## Limitações conhecidas

- **A qualidade depende do gerador final.** ChatGPT (GPT-Image-1 / DALL-E 3) é forte em texto PT-BR mas pode ainda escorregar em acentos longos. O prompt mitiga via lista de acentos mapeados.
- **Não há controle de seed/iteração via skill.** A pessoa decide quantas iterações fazer no ChatGPT até aprovar.
- **Refs anexadas no ChatGPT têm limite** (geralmente 4-5 imagens). A skill prioriza: 1) ref Pinterest (layout) → 2) logo → 3) foto pessoa.
