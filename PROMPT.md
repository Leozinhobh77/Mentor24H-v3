SKILL: skill-executor

# 🎯 PROMPT — Mentor24h

## SEC 1 — CONTEXTO
- **Projeto:** {{DESCRICAO_CURTA}}
- **Usuário do app:** {{PUBLICO}}
- **Stack:** Vanilla JS + CSS (HTML+CSS+JS modulares), dados mock em memória → Supabase (Etapa 28)
- **Persistência:** {{PERSISTENCIA}}
- **Pasta do projeto (absoluta):** {{PROJETO_PATH}}

## SEC 2 — ESCOPO
Construir {{ESCOPO}}, seguindo o arquivo **`CHECKLIST.md`** ({{TOTAL_TAREFAS}} tarefas em {{TOTAL_FASES}} fases), **na ordem numérica**, dando baixa (`[x]`) em cada item.
- O `CHECKLIST.md` é a **fonte da verdade**. Cada item tem **"Pronto-quando"** = aceite.
- Ler **`CLAUDE.md`** e **`.mural/PADROES.md`** antes de codar.

## SEC 3 — ARQUIVOS (mapa pré-mapeado)
Já existem (criados pelo Maestro — **NÃO recriar, só ler/atualizar**):
- `CHECKLIST.md` · `CLAUDE.md` · `.mural/` · `manifest.json` · `icon.svg` · `.gitignore` · `testar-celular.bat`
Você (executor) vai **criar/preencher**:
- {{ARQUIVOS_A_CRIAR}}
**NÃO TOCAR:** nada fora de `{{PROJETO_PATH}}`. {{RESTRICOES}}

<!-- Inserir aqui SEC 4 (Construtor) / SEC 5 (Forge) / SEC 6 (Sentinela) conforme os modos -->

<!-- Para APP INTEIRO, inserir o bloco section-8-app-completo.md (Autônomo + Deep Research + Completo + Auto-check) -->

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## ⚖️ REGRA DE EXECUÇÃO (skill-executor)
- Executa o que está neste Prompt + `CHECKLIST.md`; entrega completo e funcional.
- NÃO mexe em arquivos/pastas fora de `{{PROJETO_PATH}}`.
- Segue a ORDEM numérica do checklist; **dá baixa item por item** (`[x]`).
- **Checkpoint/backup** antes de cada fase grande; **testa** ao fim de cada fase.
- **Dúvida técnica → pesquisa na internet** e segue a melhor prática.
- Improviso pequeno: decide, registra em `.mural/eventos.jsonl`, segue. Só marca `blocked` se for impossível.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SEC 7 — RELAY + CHECKLIST
🔔 Ao concluir cada modo, atualizar o progresso:
```powershell
. "C:\Users\Usuário\.claude\Skills-Forge\skill-maestro\execution\Maestro-Functions.ps1"
Update-SkillProgress -ID "{{ID}}" -Modo "Construtor" -Status "done"
Update-SkillProgress -ID "{{ID}}" -Modo "Forge" -Status "done"
Update-SkillProgress -ID "{{ID}}" -Modo "Sentinela" -Status "done"
```
Ao final da Sentinela:
- PASSOU → `Update-IdeaStatus -ID "{{ID}}" -Status "completed"`
- FALHOU → `Update-IdeaStatus -ID "{{ID}}" -Status "blocked" -BlockedReason "[motivo]"`
