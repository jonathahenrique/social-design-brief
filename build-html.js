#!/usr/bin/env node
/**
 * build-html.js — Gera index.html visual self-contained para um batch de briefings.
 *
 * Lê todas as subpastas `NN-slug/` de uma pasta de batch, extrai os
 * arquivos PROMPT.md + DIRETRIZES.md + refs, e produz uma página HTML
 * onde o usuário final vê TUDO de uma vez:
 *   - Referência visual do Pinterest (preview grande)
 *   - Imagens a anexar no ChatGPT (cards com preview + download)
 *   - Prompt completo com botão "Copiar prompt"
 *   - Copy esperada destacada (strings PT-BR que vão renderizar)
 *   - Checklist de aprovação clicável
 *
 * Uso: node build-html.js <pasta-do-batch>
 *
 * Cross-platform — Node puro, sem deps externas.
 */

const fs = require('fs');
const path = require('path');

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractPromptBlock(promptMd) {
  // Pega o bloco entre "---" e o final (ignora frontmatter > comment)
  const lines = promptMd.split('\n');
  let inBlock = false;
  const out = [];
  for (const line of lines) {
    if (line.trim() === '---') {
      inBlock = !inBlock;
      continue;
    }
    if (inBlock) out.push(line);
  }
  // Se só achou 1 "---" (formato sem fechamento), pegar tudo depois
  if (out.length === 0) {
    const idx = lines.findIndex((l) => l.trim() === '---');
    if (idx !== -1) return lines.slice(idx + 1).join('\n').trim();
  }
  return out.join('\n').trim();
}

function extractExpectedText(promptBlock) {
  // Procura seção "EXACT PORTUGUESE TEXT TO RENDER" e captura linhas até a próxima seção
  const lines = promptBlock.split('\n');
  let capturing = false;
  const items = [];
  for (const line of lines) {
    if (/EXACT\s+PORTUGUESE\s+TEXT/i.test(line)) {
      capturing = true;
      continue;
    }
    if (capturing) {
      // Para ao encontrar a próxima seção (CRITICAL, Generate, etc)
      if (
        /^(CRITICAL|Generate|ABSOLUTELY|ZERO|STYLE|BACKGROUND|PROPS|HERO)/i.test(
          line.trim(),
        )
      ) {
        break;
      }
      // Captura bullets com strings em aspas simples
      const match = line.match(/^[\s\-]*\*?\s*(.+?):\s*'(.+?)'\s*$/);
      if (match) {
        items.push({ label: match[1].trim(), text: match[2] });
      } else {
        const simpleQuote = line.match(/'([^']{3,})'/);
        if (simpleQuote && line.trim().startsWith('-')) {
          items.push({ label: '', text: simpleQuote[1] });
        }
      }
    }
  }
  return items;
}

function extractAccents(promptBlock) {
  // Procura seção CRITICAL com acentos mapeados
  const lines = promptBlock.split('\n');
  let capturing = false;
  const items = [];
  for (const line of lines) {
    if (/CRITICAL\s*—\s*Render every accent/i.test(line)) {
      capturing = true;
      continue;
    }
    if (capturing) {
      if (/^(Generate|ABSOLUTELY|ZERO)/i.test(line.trim())) break;
      // Captura "Ç in 'X'" patterns
      const m = line.match(/^[\s\-]*([ÇÃÉÓÊÁÍÚÔÕç ã+]+)\s+in\s+'([^']+)'/);
      if (m) {
        items.push({ char: m[1].trim(), word: m[2] });
      }
    }
  }
  return items;
}

function extractChecklist(diretrizesMd) {
  // Captura linhas tipo "- [ ] Foo bar" da seção Checklist
  const lines = diretrizesMd.split('\n');
  const items = [];
  let inChecklist = false;
  for (const line of lines) {
    if (/Checklist\s+de\s+aprova/i.test(line)) {
      inChecklist = true;
      continue;
    }
    if (inChecklist) {
      if (line.trim().startsWith('## ')) break; // próxima seção
      const m = line.match(/^\s*-\s*\[\s*\]\s+(.+)$/);
      if (m) items.push(m[1].trim());
    }
  }
  return items;
}

function extractAttachmentsOrder(diretrizesMd) {
  // Procura ordem: "1. **`ref-XX-...`** — texto"
  const lines = diretrizesMd.split('\n');
  const items = [];
  for (const line of lines) {
    const m = line.match(
      /^\d+\.\s+\*\*`?([^*`]+\.(?:png|jpg|jpeg|webp|gif))`?\*\*\s*(?:—|--|–)?\s*(.*)/i,
    );
    if (m) {
      items.push({ file: m[1].trim(), label: m[2].trim() });
    }
  }
  return items;
}

function extractCorrectionsTable(diretrizesMd) {
  // Captura tabela "Problema | Re-prompt"
  const lines = diretrizesMd.split('\n');
  const items = [];
  let inTable = false;
  for (const line of lines) {
    if (/\|\s*Problema\s*\|/i.test(line)) {
      inTable = true;
      continue;
    }
    if (inTable) {
      if (!line.includes('|')) {
        if (line.trim() === '' && items.length > 0) break;
        continue;
      }
      // Skip separator row
      if (/^\s*\|?\s*-+\s*\|/.test(line)) continue;
      const cells = line.split('|').map((c) => c.trim()).filter((c) => c);
      if (cells.length >= 2) {
        items.push({ problem: cells[0], reprompt: cells[1] });
      }
    }
  }
  return items;
}

function extractH1(md) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}

function detectLogoVariant(filename) {
  // Detecta o contexto recomendado de uso baseado em pistas no nome do arquivo.
  // Retorna: 'light' (logo escuro, pra fundo claro)
  //          'dark'  (logo claro, pra fundo escuro)
  //          'auto'  (sem indicação clara)
  const f = filename.toLowerCase();
  // Indicadores diretos de variante
  if (/light|claro|white|branco|fundo[-_]?claro/.test(f)) return 'light';
  if (/dark|escuro|black|preto|fundo[-_]?escuro|on[-_]?dark/.test(f)) return 'dark';
  // Logo em cores quentes/médias sobre superfícies neutras geralmente fica melhor em fundo claro
  if (/gold|amber|orange|red|yellow|amarelo|vermelho/.test(f)) return 'light';
  return 'auto';
}

function readCreative(folder) {
  const promptPath = path.join(folder, 'PROMPT.md');
  const diretrizesPath = path.join(folder, 'DIRETRIZES.md');
  const readmePath = path.join(folder, 'README.md');

  if (!fs.existsSync(promptPath) || !fs.existsSync(diretrizesPath)) {
    return null;
  }

  const promptMd = fs.readFileSync(promptPath, 'utf8');
  const diretrizesMd = fs.readFileSync(diretrizesPath, 'utf8');
  const readmeMd = fs.existsSync(readmePath)
    ? fs.readFileSync(readmePath, 'utf8')
    : '';

  // Listar refs (arquivos de imagem ref-*)
  const files = fs.readdirSync(folder);
  const refs = files
    .filter((f) => /^ref-/.test(f) && /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
    .sort();

  const promptBlock = extractPromptBlock(promptMd);

  return {
    folderName: path.basename(folder),
    title: extractH1(readmeMd) || extractH1(promptMd) || path.basename(folder),
    promptRaw: promptBlock,
    expectedText: extractExpectedText(promptBlock),
    accents: extractAccents(promptBlock),
    checklist: extractChecklist(diretrizesMd),
    attachments: extractAttachmentsOrder(diretrizesMd),
    corrections: extractCorrectionsTable(diretrizesMd),
    refs,
  };
}

function buildHtml(batchName, brandPackMd, creatives) {
  const brandH1 = extractH1(brandPackMd) || 'Brand Pack';

  const creativesHtml = creatives
    .map((c, idx) => {
      const num = String(idx + 1).padStart(2, '0');

      const attachmentsHtml = c.refs
        .map((f, i) => {
          const att = c.attachments.find((a) => a.file === f) || {};
          const label = att.label || 'Imagem de referência';
          const pos = i + 1;
          const ext = path.extname(f).slice(1).toUpperCase();
          const isLogo = /logo|escudo|brand/i.test(f);
          const variant = isLogo ? detectLogoVariant(f) : 'auto';
          const thumbClass =
            variant === 'light'
              ? 'att-thumb thumb-light'
              : variant === 'dark'
                ? 'att-thumb thumb-dark'
                : 'att-thumb';
          const ctxBadge =
            variant === 'light'
              ? '<span class="ctx-badge ctx-light">PRA FUNDO CLARO</span>'
              : variant === 'dark'
                ? '<span class="ctx-badge ctx-dark">PRA FUNDO ESCURO</span>'
                : '';
          return `
        <div class="att-card">
          <div class="att-pos">${pos}º</div>
          ${ctxBadge}
          <div class="${thumbClass}"><img src="${escapeHtml(c.folderName)}/${escapeHtml(f)}" alt="${escapeHtml(label)}" onclick="openModal(this.src)"></div>
          <div class="att-meta">
            <div class="att-label">${escapeHtml(label)}</div>
            <div class="att-file">${escapeHtml(f)} <span class="badge-ext">${ext}</span></div>
          </div>
          <div class="att-actions">
            <a class="btn btn-sm" href="${escapeHtml(c.folderName)}/${escapeHtml(f)}" download>⬇ Baixar</a>
            <button class="btn btn-sm" data-src="${escapeHtml(c.folderName)}/${escapeHtml(f)}" data-variant="${variant}" onclick="copyImage(this)">📋 Copiar</button>
          </div>
        </div>`;
        })
        .join('');

      const textsHtml = c.expectedText
        .map((t) => {
          const label = t.label ? `<span class="text-label">${escapeHtml(t.label)}</span>` : '';
          return `<li>${label}<span class="text-value">${escapeHtml(t.text)}</span></li>`;
        })
        .join('');

      const accentsHtml = c.accents
        .map(
          (a) =>
            `<span class="accent-chip"><b>${escapeHtml(a.char)}</b> em '<i>${escapeHtml(a.word)}</i>'</span>`,
        )
        .join('');

      const checklistHtml = c.checklist
        .map(
          (item, i) =>
            `<label class="check"><input type="checkbox" id="chk-${idx}-${i}"><span>${escapeHtml(item)}</span></label>`,
        )
        .join('');

      const correctionsHtml = c.corrections
        .map(
          (cc) =>
            `<tr><td>${escapeHtml(cc.problem)}</td><td><code>${escapeHtml(cc.reprompt.replace(/^"|"$/g, ''))}</code></td></tr>`,
        )
        .join('');

      const heroRef = c.refs[0];

      return `
  <article class="creative" id="creative-${num}">
    <header class="creative-header">
      <span class="num">#${num}</span>
      <h2>${escapeHtml(c.title)}</h2>
    </header>

    <section class="block">
      <div class="block-title">🎯 Referência (Pinterest)</div>
      <div class="ref-hero">
        <img src="${escapeHtml(c.folderName)}/${escapeHtml(heroRef)}" alt="Ref Pinterest" onclick="openModal(this.src)">
      </div>
    </section>

    <section class="block">
      <div class="block-title">📎 Anexe os arquivos no ChatGPT nesta ordem</div>
      <div class="attachments">${attachmentsHtml}</div>
    </section>

    <section class="block">
      <div class="block-title">💬 Texto que vai aparecer na imagem (copy)</div>
      <ul class="text-list">${textsHtml || '<li>—</li>'}</ul>
      ${accentsHtml ? `<div class="accents"><strong>⚠ Acentos críticos:</strong> ${accentsHtml}</div>` : ''}
    </section>

    <section class="block prompt-block">
      <div class="block-title">📋 Prompt — cole no ChatGPT depois de anexar as imagens</div>
      <div class="prompt-wrap">
        <button class="btn-copy" onclick="copyPrompt(${idx}, this)">📋 Copiar prompt</button>
        <textarea id="prompt-${idx}" readonly>${escapeHtml(c.promptRaw)}</textarea>
      </div>
    </section>

    <section class="block">
      <div class="block-title">✅ Antes de aprovar — checklist</div>
      <div class="checklist">${checklistHtml}</div>
    </section>

    ${
      correctionsHtml
        ? `
    <section class="block">
      <div class="block-title">🔧 Se sair errado, re-prompt</div>
      <table class="corrections">
        <thead><tr><th>Problema</th><th>Cole isto no ChatGPT</th></tr></thead>
        <tbody>${correctionsHtml}</tbody>
      </table>
    </section>`
        : ''
    }
  </article>`;
    })
    .join('\n');

  const tocHtml = creatives
    .map(
      (c, idx) =>
        `<a href="#creative-${String(idx + 1).padStart(2, '0')}">#${String(idx + 1).padStart(2, '0')} · ${escapeHtml(c.title)}</a>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(batchName)} — Briefing visual</title>
<style>
  :root {
    --bg: #0a0a0a;
    --surface: #141416;
    --surface-2: #1c1c20;
    --surface-3: #25252b;
    --border: rgba(255,255,255,0.08);
    --border-strong: rgba(255,255,255,0.16);
    --text: #f5f5f5;
    --text-muted: #94a3b8;
    --text-dim: #64748b;
    --accent: #dc2626;
    --accent-bright: #ef4444;
    --accent-soft: rgba(220, 38, 38, 0.12);
    --success: #10b981;
    --warning: #f59e0b;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; }

  /* Top header sticky */
  .topbar {
    position: sticky; top: 0; z-index: 50;
    background: rgba(10,10,10,0.92);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    padding: 14px 24px;
    display: flex; gap: 18px; align-items: center; flex-wrap: wrap;
  }
  .topbar h1 {
    font-size: 18px; font-weight: 800;
    letter-spacing: -0.01em;
    background: linear-gradient(135deg, var(--accent-bright), var(--accent));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .topbar .subtitle { color: var(--text-muted); font-size: 13px; }
  .toc {
    display: flex; gap: 6px; flex-wrap: wrap; margin-left: auto;
  }
  .toc a {
    color: var(--text-muted); text-decoration: none;
    padding: 4px 10px; border-radius: 6px;
    border: 1px solid var(--border);
    font-size: 12px;
    transition: all 150ms;
  }
  .toc a:hover { background: var(--surface-2); color: var(--text); border-color: var(--border-strong); }

  /* Hero intro */
  .intro {
    max-width: 1200px;
    margin: 32px auto;
    padding: 0 24px;
  }
  .intro h2 { font-size: 28px; margin-bottom: 8px; font-weight: 800; letter-spacing: -0.02em; }
  .intro p { color: var(--text-muted); font-size: 15px; max-width: 780px; }
  .intro .badges {
    display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap;
  }
  .badge {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    color: var(--text-muted);
  }
  .badge strong { color: var(--text); }
  .badge.accent { background: var(--accent-soft); color: var(--accent-bright); border-color: rgba(220, 38, 38, 0.32); }
  .badge.accent strong { color: var(--accent-bright); }

  /* How-to box */
  .how-to {
    max-width: 1200px;
    margin: 0 auto 40px;
    padding: 0 24px;
  }
  .how-to-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 22px 26px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
  }
  .step {
    display: flex; gap: 12px; align-items: flex-start;
  }
  .step-num {
    flex-shrink: 0;
    width: 28px; height: 28px;
    background: var(--accent);
    color: white;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 13px;
  }
  .step-text { font-size: 13px; color: var(--text-muted); line-height: 1.45; }
  .step-text strong { color: var(--text); }

  /* Creative card */
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 80px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  .creative {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    scroll-margin-top: 80px;
  }
  .creative-header {
    display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--border);
  }
  .creative-header .num {
    font-size: 14px; font-weight: 800;
    background: var(--accent);
    color: white;
    padding: 4px 10px;
    border-radius: 8px;
    font-family: ui-monospace, "SF Mono", Monaco, monospace;
  }
  .creative-header h2 { font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }

  .block {
    margin-top: 24px;
  }
  .block:first-child { margin-top: 0; }
  .block-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  /* Pinterest ref hero */
  .ref-hero {
    background: #000;
    border-radius: 12px;
    overflow: hidden;
    max-height: 420px;
    display: flex; align-items: center; justify-content: center;
  }
  .ref-hero img {
    max-width: 100%; max-height: 420px; object-fit: contain;
    cursor: zoom-in;
  }

  /* Attachments grid */
  .attachments {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 14px;
  }
  .att-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
  }
  .att-pos {
    position: absolute; top: 10px; left: 10px;
    background: var(--accent);
    color: white;
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 12px;
    z-index: 5;
  }
  .att-thumb {
    background: #000;
    aspect-ratio: 4/3;
    display: flex; align-items: center; justify-content: center;
  }
  .att-thumb.thumb-light {
    background: #ffffff;  /* logo escuro → fundo claro pra ver direito */
  }
  .att-thumb.thumb-dark {
    background: #0a0a0a;  /* logo claro → fundo escuro */
  }
  .ctx-badge {
    position: absolute;
    top: 10px; right: 10px;
    z-index: 5;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.08em;
    font-family: ui-monospace, "SF Mono", Monaco, monospace;
  }
  .ctx-light {
    background: #f5f5f5;
    color: #0a0a0a;
    border: 1px solid #d4d4d4;
  }
  .ctx-dark {
    background: #1a1a1a;
    color: #f5f5f5;
    border: 1px solid #404040;
  }
  .att-thumb img {
    max-width: 100%; max-height: 100%; object-fit: contain;
    cursor: zoom-in;
  }
  .att-meta { padding: 12px 14px 6px; }
  .att-label { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .att-file {
    font-size: 11px; color: var(--text-dim);
    font-family: ui-monospace, "SF Mono", Monaco, monospace;
    word-break: break-all;
  }
  .badge-ext {
    background: var(--surface-3);
    padding: 1px 6px; border-radius: 3px;
    color: var(--text-muted);
    font-size: 9px;
    margin-left: 4px;
  }
  .att-actions {
    display: flex; gap: 6px; padding: 0 14px 14px;
  }

  .btn {
    background: var(--surface-3);
    border: 1px solid var(--border-strong);
    color: var(--text);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    text-decoration: none;
    transition: all 150ms;
    display: inline-flex; align-items: center; gap: 4px;
    font-weight: 500;
    font-family: inherit;
  }
  .btn:hover { background: var(--surface-2); border-color: var(--accent); color: var(--accent-bright); }
  .btn-sm { padding: 5px 10px; font-size: 11px; }
  .btn.copied {
    background: var(--success) !important;
    border-color: var(--success) !important;
    color: white !important;
  }

  /* Expected text */
  .text-list {
    list-style: none;
    background: var(--surface-2);
    border-radius: 10px;
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .text-list li {
    padding: 10px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: baseline;
  }
  .text-list li:last-child { border-bottom: none; }
  .text-label {
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--text-dim); font-weight: 700;
    flex-shrink: 0;
  }
  .text-value {
    font-size: 14px;
    color: var(--success);
    font-weight: 500;
    font-family: ui-monospace, "SF Mono", Monaco, monospace;
  }
  .accents {
    margin-top: 12px;
    padding: 12px 16px;
    background: rgba(245, 158, 11, 0.08);
    border: 1px solid rgba(245, 158, 11, 0.2);
    border-radius: 8px;
    font-size: 13px;
    color: var(--text-muted);
  }
  .accent-chip {
    display: inline-block;
    background: rgba(245, 158, 11, 0.12);
    color: var(--warning);
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    margin: 2px;
    font-family: ui-monospace, "SF Mono", Monaco, monospace;
  }
  .accent-chip b { color: var(--warning); }

  /* Prompt block */
  .prompt-block { position: relative; }
  .prompt-wrap { position: relative; }
  .prompt-wrap textarea {
    width: 100%;
    min-height: 400px;
    background: #050505;
    border: 1px solid var(--border);
    border-radius: 12px;
    color: #d4d4d4;
    padding: 60px 18px 18px;
    font-family: ui-monospace, "SF Mono", Monaco, monospace;
    font-size: 13px;
    line-height: 1.55;
    resize: vertical;
  }
  .btn-copy {
    position: absolute;
    top: 14px; right: 14px;
    z-index: 10;
    background: var(--accent);
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: all 200ms;
    font-family: inherit;
    box-shadow: 0 4px 14px -2px rgba(220, 38, 38, 0.5);
  }
  .btn-copy:hover {
    background: var(--accent-bright);
    transform: translateY(-1px);
    box-shadow: 0 8px 20px -4px rgba(220, 38, 38, 0.6);
  }
  .btn-copy.copied {
    background: var(--success) !important;
    box-shadow: 0 4px 14px -2px rgba(16, 185, 129, 0.5) !important;
  }

  /* Checklist */
  .checklist {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 8px;
  }
  .check {
    display: flex; align-items: center; gap: 10px;
    background: var(--surface-2);
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    cursor: pointer;
    font-size: 13px;
    transition: all 150ms;
  }
  .check:hover { border-color: var(--border-strong); }
  .check input { width: 18px; height: 18px; accent-color: var(--success); cursor: pointer; }
  .check input:checked + span { color: var(--success); text-decoration: line-through; opacity: 0.7; }
  .check span { color: var(--text); }

  /* Corrections table */
  .corrections {
    width: 100%;
    border-collapse: collapse;
    background: var(--surface-2);
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .corrections th, .corrections td {
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
    vertical-align: top;
  }
  .corrections th {
    background: var(--surface-3);
    color: var(--text-muted);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 700;
  }
  .corrections td:first-child { font-weight: 500; width: 35%; }
  .corrections code {
    background: rgba(220, 38, 38, 0.08);
    color: var(--accent-bright);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-family: ui-monospace, "SF Mono", Monaco, monospace;
  }
  .corrections tr:last-child td { border-bottom: none; }

  /* Modal */
  .modal {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.94);
    display: none;
    align-items: center; justify-content: center;
    z-index: 100;
    padding: 40px;
    cursor: zoom-out;
  }
  .modal.open { display: flex; }
  .modal img { max-width: 100%; max-height: 100%; object-fit: contain; }

  /* Toast */
  .toast {
    position: fixed; bottom: 24px; left: 50%;
    transform: translateX(-50%) translateY(120px);
    background: var(--success);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 8px 24px -4px rgba(16, 185, 129, 0.4);
    z-index: 200;
    transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .toast.show { transform: translateX(-50%) translateY(0); }

  @media (max-width: 640px) {
    .creative { padding: 22px 18px; }
    .creative-header h2 { font-size: 18px; }
  }
</style>
</head>
<body>

<div class="topbar">
  <h1>${escapeHtml(batchName)}</h1>
  <span class="subtitle">${creatives.length} criativos · Briefing visual</span>
  <nav class="toc">${tocHtml}</nav>
</div>

<section class="intro">
  <h2>👋 Olá! Aqui está o que você precisa pra gerar ${creatives.length} criativos no ChatGPT.</h2>
  <p>Cada card abaixo é um criativo. Tudo que você precisa está visualmente organizado: a referência do Pinterest, as imagens pra anexar, o prompt completo (com botão pra copiar) e uma checklist pra validar o resultado.</p>
  <div class="badges">
    <span class="badge"><strong>⏱ ~30 min</strong> total</span>
    <span class="badge accent"><strong>ChatGPT</strong> Plus ou Pro</span>
    <span class="badge"><strong>4:5 vertical</strong> (Meta feed)</span>
    <span class="badge"><strong>${creatives.length} criativos</strong></span>
  </div>
</section>

<section class="how-to">
  <div class="how-to-card">
    <div class="step">
      <div class="step-num">1</div>
      <div class="step-text"><strong>Abra o ChatGPT</strong> (Plus ou Pro) num navegador no desktop.</div>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <div class="step-text"><strong>Anexe as imagens</strong> do card na ordem indicada (1º, 2º, 3º).</div>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <div class="step-text"><strong>Clique em "Copiar prompt"</strong> e cole no chat. Envie.</div>
    </div>
    <div class="step">
      <div class="step-num">4</div>
      <div class="step-text"><strong>Valide com a checklist</strong>. Se algo der errado, use a tabela de re-prompts.</div>
    </div>
  </div>
</section>

<main>
  ${creativesHtml}
</main>

<div class="modal" id="modal" onclick="closeModal()">
  <img id="modal-img" src="" alt="">
</div>

<div class="toast" id="toast">Copiado!</div>

<script>
  function copyPrompt(idx, btn) {
    const t = document.getElementById('prompt-' + idx);
    t.select();
    document.execCommand('copy');
    if (navigator.clipboard) navigator.clipboard.writeText(t.value);
    t.blur();
    btn.classList.add('copied');
    btn.textContent = '✓ Copiado!';
    showToast('Prompt copiado — agora cole no ChatGPT');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.textContent = '📋 Copiar prompt';
    }, 2200);
  }

  async function copyImage(btn) {
    const src = btn.dataset.src;
    const variant = btn.dataset.variant || 'auto';
    const original = btn.textContent;
    btn.textContent = '⏳ Copiando...';

    try {
      // 1. Carrega imagem
      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.crossOrigin = 'anonymous';
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error('Falhou ao carregar imagem'));
        i.src = src;
      });

      // 2. Desenha em canvas (converte qualquer formato pra PNG)
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');

      // Se for logo pra fundo claro, pinta branco antes (pra logo escuro
      // não ficar invisível quando colado em qualquer fundo)
      if (variant === 'light') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (variant === 'dark') {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      // 3. Converte canvas → blob PNG
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png'),
      );
      if (!blob) throw new Error('Falhou ao gerar PNG');

      // 4. Copia pro clipboard
      if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error('Navegador sem suporte Clipboard API');
      }
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);

      btn.textContent = '✓ Copiada!';
      btn.classList.add('copied');
      showToast('Imagem copiada — cole no ChatGPT com Ctrl/Cmd+V');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 2200);
    } catch (e) {
      btn.textContent = original;
      console.warn('copyImage erro:', e);

      // Fallback: baixar
      try {
        const res = await fetch(src);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = src.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(
          'Cópia bloqueada pelo navegador — baixei como arquivo (arraste pro ChatGPT)',
        );
      } catch (e2) {
        showToast('Erro: ' + (e.message || 'falhou copiar'));
      }
    }
  }

  function openModal(src) {
    document.getElementById('modal-img').src = src;
    document.getElementById('modal').classList.add('open');
  }
  function closeModal() {
    document.getElementById('modal').classList.remove('open');
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  let toastTimer;
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
  }
</script>

</body>
</html>`;
}

function main() {
  const batchArg = process.argv[2];
  if (!batchArg) {
    console.error('Uso: node build-html.js <pasta-do-batch>');
    process.exit(1);
  }

  const batchDir = path.resolve(batchArg);
  if (!fs.existsSync(batchDir)) {
    console.error(`Pasta não encontrada: ${batchDir}`);
    process.exit(1);
  }

  // Listar subpastas que parecem criativos (NN-slug)
  const entries = fs
    .readdirSync(batchDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d{2}-/.test(e.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (entries.length === 0) {
    console.error('Nenhuma subpasta de criativo encontrada (esperado NN-slug/)');
    process.exit(1);
  }

  console.log(`Lendo ${entries.length} criativos de ${batchDir}...`);

  const creatives = [];
  for (const entry of entries) {
    const folder = path.join(batchDir, entry.name);
    const c = readCreative(folder);
    if (c) {
      creatives.push(c);
      console.log(`  ✓ ${entry.name}: ${c.expectedText.length} strings · ${c.checklist.length} checks · ${c.refs.length} refs`);
    } else {
      console.log(`  ! ${entry.name}: PROMPT.md ou DIRETRIZES.md faltando, pulando`);
    }
  }

  if (creatives.length === 0) {
    console.error('Nenhum criativo válido lido.');
    process.exit(1);
  }

  const brandPackPath = path.join(batchDir, 'BRAND-PACK.md');
  const brandPackMd = fs.existsSync(brandPackPath)
    ? fs.readFileSync(brandPackPath, 'utf8')
    : '';

  const batchName = path.basename(batchDir);
  const html = buildHtml(batchName, brandPackMd, creatives);

  const outPath = path.join(batchDir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf8');

  console.log('');
  console.log(`✓ HTML visual gerado: ${outPath}`);
  console.log('');
  console.log('Abra esse arquivo no navegador pra ver — é a página única que a pessoa final usa.');
}

main();
