---
id: 28
titulo: Microcopy PT-BR (labels, subtítulo, vazios, rótulos dos grupos)
status: todo
modo: forge
expert: ux-writer
depende_de: [26]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR (não reescrever, não resumir)

```
┌─ Mentor24h-v3 · executor-20260613-001 ───────────────────┐
│ 🔄 RUN ▰▰▰▱▱▱ 3/6  ·  🎨 Forge 3/4                        │
│ 🧠 Expert ativo: ux-writer                                │
│ ⏳ AGORA:   Tarefa-28 · microcopy PT-BR                   │
│ ✅ Aceite:  textos claros, tom Quiet Premium              │
│ ⏭️ PRÓXIMA: Tarefa-29 · acessibilidade AAA               │
└───────────────────────────────────────────────────────────┘
```

> ⚠️ Executor: imprima o bloco acima **literalmente** antes de começar. Ao concluir, reimprima com ✅ e barra avançada.

## O que é
Escrever todos os **textos** da tela em PT-BR, tom "Quiet Premium" (claro, calmo, sem jargão financeiro).

## Etapas (ordem natural 1→n)
- [ ] 1. **Hero:** título "Saldo previsto"; subtítulo no formato `entra R$ X · sai R$ Y`. Se negativo, a leitura deve soar honesta (não alarmista).
- [ ] 2. **Tira:** labels "A pagar", "A receber", "Vencidas".
- [ ] 3. **Rótulos dos grupos:** "Vencidas", "Vence hoje", "Esta semana", "Próximas", "Pagas".
- [ ] 4. **Estados vazios:** geral "Tá tudo em dia ✨"; por filtro: "Nada a pagar em aberto" / "Nada a receber em aberto" / "Nenhuma conta vencida 🎉".
- [ ] 5. **Acessório:** chip de contagem ("3"), e o subtotal por grupo (só número, mono). Nada de texto redundante.

## ✅ Critério de aceite (self-check com evidência)
- [ ] Todos os textos em PT-BR, claros e curtos.
- [ ] Tom consistente com o app (calmo, direto, sem termos técnicos).
- [ ] Nenhum placeholder "lorem"/inglês sobrando.

## 📂 Escopo
Mexe: strings de microcopy (entram no HTML da Tarefa-30) · NÃO toca: nada fora de `_mockups\` 🔒
