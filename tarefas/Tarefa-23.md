---
id: 23
titulo: Auditoria — smoke real Playwright nos 3 modos (desktop + mobile)
status: todo
modo: sentinela
expert: smoke-visual-tester
depende_de: 22
---

## O que é
Auditoria final da tela Mentor redesenhada, com **smoke visual REAL** (Python Playwright, já instalado) nos **3 modos**, desktop e mobile. Garante zero regressão e o Contrato de Contraste.

## Etapas
1. Abrir o app, navegar até a tela **Mentor** em cada modo (Pessoal/Híbrido/Negócio) via mode-switch e Alt+1/2/3.
2. Capturar **console** (esperado: 0 erros) e medir **overflow horizontal** (esperado: 0px) em 1280px e 360px.
3. Verificar: spotlight presente, feed agrupado, "+N" expande, dispensar persiste após reload, layouts distintos por modo.
4. Conferir **contraste AA** (texto sobre surface/soft) e ausência de sobreposição.
5. Registrar resultado (asserts N/N) + screenshots; atualizar `.mural/eventos.jsonl` com gaps/acertos.

## ✅ Critério de aceite
- Console **0 erros** e overflow **0px** nos 3 modos × (desktop + mobile).
- Persistência de dispensar confirmada após reload.
- Nenhuma regressão no dashboard/briefing nem no motor.
- Relatório VERDE com asserts e screenshots anexados.

## 📂 Escopo
- **Mexe / cria:** scripts/saídas de smoke (ex: `smoke-mentor.py`, PNGs) + `.mural/eventos.jsonl`.
- **NÃO toca:** código do app (só lê/roda).
