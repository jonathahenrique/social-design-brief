#!/usr/bin/env node
/**
 * pack-brief.js — Helper opcional pra zipar a pasta de brief pra compartilhar.
 *
 * Uso: node pack-brief.js <pasta-de-brief>
 *
 * Cross-platform: roda em macOS, Linux, Windows.
 * No Windows usa zipFolder via tar (built-in no Windows 10+).
 * No macOS/Linux usa zip se disponível, fallback pra tar.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function commandExists(cmd) {
  try {
    if (process.platform === 'win32') {
      execSync(`where ${cmd}`, { stdio: 'ignore' });
    } else {
      execSync(`which ${cmd}`, { stdio: 'ignore' });
    }
    return true;
  } catch (e) {
    return false;
  }
}

function main() {
  const folderArg = process.argv[2];
  if (!folderArg) {
    console.error('Uso: node pack-brief.js <pasta-de-brief>');
    process.exit(1);
  }

  const folder = path.resolve(folderArg);
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
    console.error(`Pasta inválida: ${folder}`);
    process.exit(1);
  }

  const parent = path.dirname(folder);
  const folderName = path.basename(folder);
  const zipPath = path.join(parent, `${folderName}.zip`);

  console.log(`Empacotando: ${folder}`);
  console.log(`Saída: ${zipPath}`);
  console.log('');

  // Estratégia cross-platform
  if (commandExists('zip')) {
    // macOS / Linux com zip instalado
    execSync(`cd "${parent}" && zip -r "${folderName}.zip" "${folderName}"`, {
      stdio: 'inherit',
    });
  } else if (process.platform === 'win32') {
    // Windows com tar built-in (Windows 10+)
    execSync(`tar -a -c -f "${zipPath}" -C "${parent}" "${folderName}"`, {
      stdio: 'inherit',
    });
  } else {
    console.error('Erro: nenhuma ferramenta de zip disponível (zip ou tar).');
    process.exit(1);
  }

  const stat = fs.statSync(zipPath);
  console.log('');
  console.log(`✓ ZIP criado: ${zipPath} (${Math.round(stat.size / 1024)}KB)`);
  console.log('');
  console.log('Compartilhe esse ZIP via Drive / WhatsApp / email pra quem vai gerar no ChatGPT.');
}

main();
