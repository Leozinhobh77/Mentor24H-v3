---
id: 25
titulo: Smoke — briefing do dashboard pessoal restaurado
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: 24
---

## O que é
Smoke visual REAL (Python Playwright) confirmando que o card "Mentor · seu dia" voltou ao dashboard pessoal sem regressão.

## Etapas
1. Abrir o app no modo **Pessoal**, dashboard.
2. Assertar: `#mtr-dash-pessoal` existe **e tem conteúdo** (innerHTML não vazio — spotlight `.brf-spot` ou estado vazio `.brf-empty`).
3. Assertar console 0 erros e overflow horizontal 0px (1280 + 360px).
4. Confirmar que panes **Negócio** e **Híbrido** seguem **sem** a strip (não reintroduzir).
5. Registrar resultado (asserts N/N) + screenshot; atualizar `.mural/eventos.jsonl`; ao passar, marcar `licao-005` como resolvida.

## ✅ Critério de aceite
- `#mtr-dash-pessoal` presente e preenchido; console 0; overflow 0px (desktop+mobile).
- Negócio/Híbrido inalterados.
- Relatório VERDE com screenshot.

## 📂 Escopo
- **Mexe / cria:** smoke script + PNG + `.mural/eventos.jsonl`.
- **NÃO toca:** código do app.
