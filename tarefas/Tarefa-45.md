---
id: 45
titulo: Modo Semana — 1 bloco por semana (seg→dom, apara virada), resumo no topo, "esta semana", Mentor por semana, estado vazio
status: todo
modo: construtor
expert: frontend-dev
depende_de: [43, 44]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▰░░░░ 5/8  ·  🔨 Construtor 4/5                 │
│ 🧠 Expert ativo: frontend-dev (🎨 forge nos blocos)       │
│ ⏳ AGORA:   Tarefa-45 · Modo Semana                       │
│ ✅ Aceite:  blocos seg→dom + Mentor por semana            │
│ ⏭️ PRÓXIMA: Tarefa-46 · Cards de conta (visual)           │
└───────────────────────────────────────────────────────────┘
```

## O que é
O render da lista quando o toggle (T43) está em **Semana**. Cada semana é um **bloco fechado**.
Reusa `semanasMes(ym)` (l.53-69, já apara início/fim com `segmIni`/`segmFim`).

## Etapas
- [ ] 1. **1 bloco por semana** (seg→dom; 4 ou 5 por mês; a 5ª só quando existe). Mostrar **apenas os dias
      do mês atual** (apara seg de mês anterior / dom do próximo — usar `segmIni`/`segmFim`).
- [ ] 2. **Cabeçalho-resumo** de cada bloco: `Semana N · DD–DD mês` + **nº contas · a pagar R$ · a receber R$**,
      bem formatado/alinhado.
- [ ] 3. **Contas da semana** em ordem por dia, reusando o `rowHTML`/selos/cores/lápis das T44/T46.
- [ ] 4. **"esta semana"** destacada (borda/realce teal) quando o bloco contém hoje.
- [ ] 5. **Mentor por semana** (logo abaixo do bloco) — frase no tom da persona + **meta da semana**
      (`a pagar pendente da semana ÷ dias restantes da semana`), com guarda de zero. Identificado
      "Mentor · Semana N". Núcleo de frase vem da T47 (reusar; não duplicar voz).
- [ ] 6. **Semana vazia** → bloco enxuto "Nenhuma conta nesta semana 🍃" (+ Mentor pode elogiar/sugerir adiantar).

## ✅ Critério de aceite
- [ ] 4–5 blocos conforme o mês; dias fora do mês aparados; cada bloco com resumo (contas · a pagar · a receber).
- [ ] "esta semana" destacada; semana sem conta tratada.
- [ ] Mentor por semana com meta diária da semana (sem divisão por zero); usa o motor de voz (T47).
- [ ] Toggle Mês↔Semana alterna sem erro; console 0; sem overflow 360/1280.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (`buildLista` ramo Semana) · `css/estilo.css` (bloco-semana, aditivo).
🔒 NÃO toca: `Transacoes`, `js/negocio/*`.
