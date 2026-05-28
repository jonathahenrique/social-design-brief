# Known Issues — social-design-brief (ChatGPT Image Generation)

Problemas conhecidos do GPT-Image-1 / DALL-E 3 / ChatGPT image generation, com mitigações.

## 1. Acentos PT-BR escorregam em peças com muito texto

**Sintoma:** "Instalação" vira "Instalacao", "Pós" vira "Pos", "ç" vira "c", "ê" vira "e".

**Mitigação (validada):**

1. **Mapear cada acento a uma palavra específica** no CRITICAL block:
   ```
   CRITICAL — Render every accent exactly as written:
   - Ç in 'INSTALAÇÕES'
   - Ê in 'POTÊNCIA'
   - Ó in 'MÓDULOS'
   - Ã in 'TENSÃO'
   - É in 'ELÉTRICAS'
   ```

2. **Repetir as strings exatas em uma lista** — não enterrar no meio do prompt:
   ```
   EXACT PORTUGUESE TEXT TO RENDER:
   - Eyebrow: 'CURSO DE EXTENSÃO · 180h'
   - Headline: 'A norma mãe das instalações.'
   ```

3. **Pedir uma string por linha**, com aspas, em vez de prosa.

## 2. Logo recriado em vez de usado fielmente

**Sintoma:** Mesmo anexando o logo PNG, ChatGPT "inventa" uma versão própria.

**Mitigação:**

- Aceitar como limitação (não há perfeição via prompt-only).
- No prompt, descrever **o estilo do logo**: "red shield with Brazilian outlet icon (3-pin pattern) inside, gradient from light red to dark red".
- Pedir o logo "as a small visual mark" — quando grande, o erro é mais visível.
- Pra logo fiel 100%, compor em pós (Figma/Photopea) sobrepondo o PNG real.

## 3. Drift de face quando pessoa anexada

**Sintoma:** Pessoa anexada muda de cara (rejuvenesce, suaviza pele, adiciona óculos não-existentes).

**Mitigação:**

1. **CRITICAL FACE PRESERVATION block** no fim:
   ```
   CRITICAL FACE PRESERVATION:
   The man in the image MUST be a 1:1 photographic match to attached image #3.
   - Brazilian male age approximately 65-70
   - Silver-white full hair, combed back, full coverage
   - NO glasses (he does not wear glasses)
   - Light skin, calm closed-lip expression
   - Wearing dark mandarin blazer
   - FLAT EVEN STUDIO LIGHT (not cinematic warm key + cool rim)
   - NO stylization, NO smoothing, NO age change
   ```

2. **Pose próxima da ref** — se a foto é busto frontal, NÃO pedir pose dramática nova.

3. **Iluminação flat** sempre vence Rembrandt pra preservar identidade.

## 4. Componentes técnicos sci-fi

**Sintoma:** Pedir "quadro elétrico" e sair com LEDs cyan, equipamentos Apple-Vision-Pro, PLC inventado.

**Mitigação:**

```
The panel door is open, and inside is ONLY:
- ONE single horizontal DIN rail
- 4 to 6 standard white circuit breakers
- ONE DPS module
- NO PLC, NO terminal blocks, NO sci-fi components

Must look like a real Brazilian residential panel.
NO glowing LEDs, NO cyan tint, NOT industrial sci-fi.
```

## 5. Plugs/tomadas erradas

**Sintoma:** Aparece tomada americana (Type A/B) ou europeia (Type C/F) em vez de brasileira NBR 14136.

**Mitigação:**

- Repetir em **2 lugares** no prompt:
  - Em BACKGROUND DETAIL: "Brazilian NBR 14136 outlet (3 round pins arranged in a triangle pattern)"
  - Em CRITICAL: "ONLY Brazilian NBR 14136 outlets. NEVER American Type A/B or European Type C/F."

## 6. Texto muito longo fica ilegível em peça vertical

**Sintoma:** Body de 4+ linhas fica miúdo e ilegível em peça 4:5.

**Mitigação:**

- Declarar **hierarquia explícita** com tamanhos relativos:
  ```
  - HUGE headline 3 lines centered
  - MEDIUM body 2 lines (smaller, but readable)
  - SMALL footer 1 line monospaced
  ```
- Cortar copy excessiva — ChatGPT renderiza melhor 50-80 chars de body do que 200+.

## 7. Aspect ratio errado

**Sintoma:** Pedi vertical 4:5 e veio square ou 3:4.

**Mitigação:**

- Pedir formato **logo no topo** e **repetir no fim**:
  ```
  Output format: vertical 4:5 ratio image (1024x1280).
  ...
  Generate ONE image. Vertical 4:5 strict.
  ```
- Se ChatGPT só oferece presets (square / portrait / landscape), escolher **portrait**.

## 8. Color drift (paleta da marca não é respeitada)

**Sintoma:** Pediu vermelho #DC2626 e veio um vermelho qualquer.

**Mitigação:**

- Hex + descrição **junto**: "vibrant red (exact color #DC2626)"
- Descrever o que NÃO quer: "NOT pink, NOT orange, NOT crimson — pure red"
- Usar a paleta como contexto: "Stripe-like red accent on warm cream background"

## 9. ChatGPT recusa o prompt (filtro)

**Sintoma:** ChatGPT responde "I can't generate that image" sem motivo claro.

**Mitigação:**

- Evitar palavras-gatilho: "person walking", "wrist watch", "taped to pole", "wrapping around".
- Trocar: "person standing", remover relógio, "pinned to wooden board", "mounted on".
- Reduzir ângulos top-down de corpo humano (ChatGPT às vezes interpreta como invasivo).

## 10. Geração múltipla quando não foi pedido

**Sintoma:** ChatGPT gera 4 variantes quando só queria 1.

**Mitigação:**

- Pedir explícito no fim: "Generate ONE image only. Do not produce variations."
- No ChatGPT Plus, isso é controlável. No GPT-4 base, às vezes ignora.

---

## Status de risco por modelo (até 2026-05-28)

| Modelo | Acentos PT | Drift face | Logo fiel | Custo |
|---|---|---|---|---|
| ChatGPT Plus (GPT-4o + DALL-E 3) | bom | médio | médio | incluso no Plus |
| ChatGPT Pro (GPT-4o + GPT-Image-1) | excelente | bom | bom | incluso no Pro |
| Gemini Imagen 3 | médio | médio | baixo | gratuito |
| Claude Sonnet via API | n/a | n/a | n/a | sem image gen |

**Recomendação default da skill:** ChatGPT Plus ou Pro com GPT-Image-1 (versão mais recente, melhor com texto PT-BR).

---

## Quando algo der errado

1. **Texto errado?** Re-gerar pedindo: "regenerate but keep all text exactly as I wrote, including all Portuguese accents".
2. **Face errada?** Re-gerar com "preserve the face exactly as in the attached reference, do not modify".
3. **Componente técnico errado?** Re-gerar com "the electrical panel should be a real Brazilian residential one with simple breakers, no sci-fi".
4. **Cor errada?** Re-gerar mencionando o hex exato + "matching #DC2626 precisely".

Se 3 tentativas falharem no mesmo problema, considerar:
- Trocar de gerador (Gemini Imagen, Midjourney)
- Compor texto/logo em Figma sobre o background gerado por IA
