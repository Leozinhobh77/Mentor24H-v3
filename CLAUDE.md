# CLAUDE.md — Mentor24h

Guia de comportamento para reduzir erros comuns de LLM. Ler **antes de codar**.

## Sobre o projeto
- **Hub pessoal + empreendedor: finanças, produtividade, saúde, aprendizado e gestão de negócio (MEI/autônomos) num app só, com 3 modos (Pessoal / Híbrido / Negócio) e Mentor por regras (sem IA).**
- **Stack:** Vanilla JS + CSS (HTML + CSS + JS modulares, sem build) · design "Quiet Premium" teal
- **Persistência:** dados mock em memória (`DB`) → Supabase online-only na Etapa 28
- **Core:** `index.html` + `js/01-core.js` (DB, roteamento, modos) + `js/15-mentor.js` (motor de regras); módulos por domínio em `js/pessoal/` e `js/negocio/`

## 1. Think Before Coding
- Declare suposições. Se houver várias interpretações, apresente — não escolha em silêncio.
- Se algo está confuso, pare e pergunte (ou pesquise, se for dúvida técnica).
- Se existe caminho mais simples, diga.

## 2. Simplicity First
- Código mínimo que resolve. Nada especulativo.
- Sem abstração para uso único, sem "flexibilidade" não pedida.

## 3. Surgical Changes
- Mexa só no necessário. Siga o estilo existente.
- Mudanças **aditivas**; não refatore o que não está quebrado.
- **Backup/checkpoint antes de fase grande.** Testar ao fim de cada fase.

## 4. Goal-Driven Execution
- Seguir o **CHECKLIST.md em ordem numérica**, dando baixa (`[x]`) em cada item.
- Cada item tem **Pronto-quando** = critério de aceite. Só marca quando cumpre.
- Ao final de cada fase: validar (abrir/rodar) sem erro.

## Padrões de UI (se houver front-end)
- Identidade visual via **tokens** (zero cor/spacing hardcoded).
- Reusar componentes. Responsivo **sem overflow e sem sobreposição**.
- Estados vazios, toasts e confirmações destrutivas em toda tela.

## Mural (aprendizado)
- Ler `.mural/PADROES.md` antes de começar.
- Registrar em `.mural/eventos.jsonl` o que faltou/improvisou em cada item.
