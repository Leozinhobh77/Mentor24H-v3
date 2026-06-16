---
id: 55
titulo: Repaginar card Mentor (rodapé + por semana) com anatomia .mtr-card + valor-herói único à direita
status: todo
modo: forge
expert: ui-visual-designer
depende_de: [54]
---

## 🖥️ HUD — COPIAR E IMPRIMIR ANTES DE EXECUTAR

```
┌─ Mentor24h-v3 · executor-20260615-003 ───────────────────┐
│ 🔄 RUN ▰░░ 2/3  ·  🎨 Forge 1/1                            │
│ 🧠 Expert ativo: ui-visual-designer                       │
│ ⏳ AGORA:   Tarefa-55 · Repaginar card Mentor             │
│ ✅ Aceite:  anatomia .mtr-card + 1 valor herói            │
│ ⏭️ PRÓXIMA: Tarefa-56 · Smoke + auditoria                 │
└───────────────────────────────────────────────────────────┘
```

## O que é
O card do Mentor na Finanças (`.fin-mentor-rod`, `03-contas.js` l.262-278; e o Mentor por semana
`.fin-mentor-sem` l.185-190) não casa com os cards da **aba Mentor**. Repaginar adotando a
**anatomia `.mtr-card`** (referência: `cardHTML()` em `15-mentor.js` l.651-663) e deixar **um único**
valor-herói à direita.

## Anatomia de referência (.mtr-card real)
```
<div class="mtr-card" style="--c:var(--brand);--cs:var(--brand-soft)">
  <div class="mtr-ico">[ícone]</div>
  <div class="mtr-main"><div class="mtr-t">[título]</div><div class="mtr-s">[texto]</div></div>
  <div class="mtr-side">[...]</div>
</div>
```

## Esboço aprovado
```
╭──────────────────────────────────────────────────╮
│ ╭───╮  Meta diária                  ╭──────────╮  │
│ │🧭 │  "Foca e você zera os R$ 3.456 │  R$ 288  │  │
│ ╰───╯   em 12 dias. Bora! 💪"        │   /dia   │  │
│                                      ╰──────────╯  │
╰──────────────────────────────────────────────────╯
```

## Etapas
- [ ] 1. **Rodapé (estado meta)** — reescrever o markup do `.fin-mentor-rod` usando a anatomia `.mtr-card`
      com cor **brand/teal** (`--c:var(--brand);--cs:var(--brand-soft)`): `.mtr-ico` (ícone Mentor) ·
      `.mtr-main` com `.mtr-t`="Meta diária" + `.mtr-s`=frase (T54) · **hero único** à direita
      (no lugar do `.mtr-side`): `R$ X` em mono/teal + legenda `/dia`. Remover o valor duplicado antigo.
- [ ] 2. **Estados passado / futuro / tudo-pago** — mesma anatomia `.mtr-card`, **sem hero** (só ícone +
      título + texto): ex título "Mês fechado 👏" / "Mês futuro" / "Mês fechado". Coerentes e elegantes.
- [ ] 3. **Mentor por semana** (`.fin-mentor-sem`, l.185-190) — aplicar a MESMA cara (mtr-card compacto):
      título "Meta da semana" + frase + hero `/dia` da semana. Consistência total com o rodapé.
- [ ] 4. **CSS** — reusar `.mtr-card`/`.mtr-ico`/`.mtr-t`/`.mtr-s` (ou escopar `#contas-root` herdando o estilo);
      o hero usa `--mono` + `--brand`. Sem criar identidade nova do zero. Tokens; sem overflow 360/1280.

## ✅ Critério de aceite
- [ ] Card do Mentor (rodapé e semana) com a mesma anatomia/visual dos cards da aba Mentor.
- [ ] Valor aparece **1× só** (hero à direita), bem formatado, **igual nas 3 personas**.
- [ ] Estados passado/futuro/tudo-pago sem hero, coerentes.
- [ ] Tokens; sem overflow 1280/360, claro+escuro; console 0.

## 📂 Escopo
Mexe: `js/pessoal/03-contas.js` (markup `fin-mentor-rod` + `fin-mentor-sem`) · `css/estilo.css` (aditivo, reusa `.mtr-*`).
🔒 NÃO toca: a lógica de meta/estados/cálculo, regras do Mentor, Transacoes, negocio.
