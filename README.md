# social-design-brief

Skill do Claude Code que **produz um pacote exportável** (PROMPT.md + imagens de referência + DIRETRIZES.md) pronto pra qualquer pessoa do time abrir o **ChatGPT** (ou outro gerador de imagem) e gerar uma arte de social media — **sem precisar do Claude rodando, sem precisar do Higgsfield**.

A skill **não gera imagem**. Produz o briefing completo pra alguém gerar.

## Pra que serve

Você (o estrategista) tem o contexto da marca, escolheu o layout e a copy. Quer **delegar a geração** pra outra pessoa (designer, sócio, freelancer, time) que vai usar ChatGPT. Essa skill empacota tudo que essa pessoa precisa numa pasta:

- Prompt formatado, com instruções claras pra colar
- Imagens de referência prontas pra anexar (Pinterest, logo, pessoa)
- Diretrizes da marca + restrições + checklist de aprovação
- README passo-a-passo pra leigo seguir

A pessoa que vai gerar **não precisa entender de design ou de prompt engineering** — ela só anexa, cola, gera, aprova ou re-gera com instrução pronta.

## Quando faz sentido usar (vs. outras skills)

| Situação | Skill |
|---|---|
| Tenho board do Pinterest e quero baixar | `pinterest-board-download` |
| Tenho pasta com refs e quero análise visual | `design-refs-analyzer` |
| Vou gerar arte AGORA via Higgsfield com meus créditos | `social-design` |
| **Vou delegar geração pra alguém usar ChatGPT** | **`social-design-brief` (esta)** |

## Instalação

### macOS / Linux

```bash
mkdir -p ~/.claude/skills
cd ~/.claude/skills
git clone https://github.com/jonathahenrique/social-design-brief
# Sem npm install — não tem dep externa
```

### Windows (PowerShell ou Git Bash)

```powershell
mkdir $env:USERPROFILE\.claude\skills -Force
cd $env:USERPROFILE\.claude\skills
git clone https://github.com/jonathahenrique/social-design-brief
```

Requer apenas Node.js 16+ (pra rodar `pack-brief.js`, opcional). Skills usam só lendo arquivos de texto.

## Como você usa (o estrategista, dentro do Claude)

1. Você pede pro Claude: *"Monta um brief de 4 ads da NBR 5410 pra Flávia gerar no ChatGPT, usando as refs do board do Pinterest"*.
2. Claude:
   - Baixa Pinterest (via `pinterest-board-download`) se ainda não tiver
   - Lê o brand pack `brands/nbr5410.md`
   - Escolhe 4 layouts (do catalog ou refs do Pinterest)
   - Para cada um, gera uma subpasta dentro de `<output>/`:
     ```
     <output>/nbr5410-batch-2026-05-28/
     ├── README.md
     ├── BRAND-PACK.md
     ├── 01-poster-plywood/
     │   ├── PROMPT.md
     │   ├── DIRETRIZES.md
     │   ├── README.md
     │   ├── ref-01-pinterest.png
     │   ├── ref-02-logo.png
     │   └── (ref-03-hilton.webp se aplicável)
     ├── 02-clipboard/
     ├── 03-highlighter/
     └── 04-notepad/
     ```
3. (Opcional) Você roda `node pack-brief.js <output>/nbr5410-batch-2026-05-28` pra zipar.
4. Compartilha o ZIP via Drive / WhatsApp / email.

## Como ela (Flávia ou outro membro do time) usa

1. Recebe o ZIP, extrai.
2. Abre cada subpasta `01-...` em ordem.
3. Lê `README.md` da subpasta (passo a passo curto).
4. Abre ChatGPT Plus/Pro no navegador.
5. **Anexa os arquivos `ref-*` na ordem listada em `DIRETRIZES.md`.**
6. **Cola o conteúdo de `PROMPT.md`** no chat.
7. Gera a imagem.
8. Avalia com a checklist em `DIRETRIZES.md`. Se PASS, salva como `<nome>-FINAL.png` na mesma pasta. Se FAIL, re-gera com instruções prontas da tabela em `DIRETRIZES.md`.
9. Quando terminar a batelada, manda os FINAIS de volta pro estrategista.

## Cross-platform

- Node.js puro (sem deps externas)
- Paths via `path.join()`
- Funciona em macOS, Linux, Windows
- `pack-brief.js` usa `zip` (Mac/Linux) ou `tar` built-in (Windows 10+)

## Estrutura interna

```
social-design-brief/
├── SKILL.md                  # Instruções pro Claude
├── README.md                 # Este arquivo
├── package.json              # Sem deps
├── pack-brief.js             # Helper opcional pra zipar saída
├── prompt-skeleton.md        # Estrutura do prompt pra ChatGPT
├── layout-catalog.md         # 20 layouts mapeados
├── known-issues.md           # Problemas conhecidos do ChatGPT image gen
├── brand-pack-template.md    # Template pra brand pack novo
├── brands/                   # Brand packs prontos
│   └── nbr5410.md
└── templates/                # Templates dos arquivos de saída
    ├── PROMPT.md.template
    ├── DIRETRIZES.md.template
    ├── README-creative.md.template
    └── README-batch.md.template
```

## Adicionar nova marca

1. Copiar `brands/nbr5410.md` pra `brands/<nova-marca>.md`
2. Editar com paleta + tipografia + faculty/pessoa + restrições da marca
3. Já pode usar a skill com a nova marca

## Compartilhar a skill com o time

A pasta é self-contained. Pra distribuir:

1. **Via GitHub:** pessoa faz `git clone https://github.com/jonathahenrique/social-design-brief` em `~/.claude/skills/` (ou `%USERPROFILE%\.claude\skills\` no Windows)
2. **Via ZIP:** zipar a pasta e enviar pelo Drive/email
3. **Via cópia:** copiar a pasta inteira pra outra máquina

Sem `npm install` obrigatório — Node puro, sem deps.

## Brand packs disponíveis (HMNews / Grupo Potência)

Todos os brand packs vêm com **assets reais embutidos** (logos + fotos canônicas) em `brands/<marca>/assets/`. Não depende de paths do Mac de quem criou a skill — funciona offline.

| Pasta | Marca | Tema | Paleta canônica |
|---|---|---|---|
| `brands/potencia-educacao/` | Potência Educação (institucional) | Marca-mãe / posicionamento amplo | Paper warm + burgundy + gold |
| `brands/potencia-pos/` | Pós-Graduação Instalações Elétricas | Pós-graduação técnica | Paper warm + electric blue `#2563EB` |
| `brands/ie40/` | IE 4.0 (Instalações Elétricas 4.0) | Curso modernização técnica | Dark navy + cyan `#06B6D4` |
| `brands/nbr5410/` | Como Aplicar a NBR 5410 | Curso da norma de baixa tensão | Paper warm + red `#DC2626` |
| `brands/nbr5419/` | Como Aplicar a NBR 5419 | Curso SPDA (proteção raios) | Navy deep + gold `#F0C142` |
| `brands/aterramento-tn/` | Aterramento TN na Prática | Curso aterramento elétrico | Dark + yellow high-vis `#FFCB05` |
| `brands/expoeletrica/` | ExpoElétrica 2026 | Feira presencial | Navy + orange `#F5A83A` + gold |

Cada pasta contém:
- `brand-pack.md` — paleta + tipografia + faculty + restrições + prompt block reutilizável
- `assets/` — logos + fotos pessoas + mockups reais (variável por marca)

Pra adicionar marca nova, ver `brand-pack-template.md`.

## Licença

MIT.
