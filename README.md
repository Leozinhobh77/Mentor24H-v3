# Mentor24h

Hub pessoal + empreendedor: finanças, produtividade, saúde, aprendizado e gestão de negócio (MEI/autônomos) num app só, com 3 modos (Pessoal / Híbrido / Negócio) e Mentor por regras (sem IA). Design "Quiet Premium" teal.

## Como rodar
- **No PC:** duplo-clique em `index.html`.
- **No celular (mesma Wi-Fi):** duplo-clique em `testar-celular.bat` → abre uma janela mostrando o endereço `http://SEU-IP:PORTA` → digite no navegador do celular.
  - O `.bat` acha a porta livre sozinho (≥8000), então dá pra rodar vários apps ao mesmo tempo.
  - Se o Windows pedir Firewall na 1ª vez → **Permitir** (rede privada).

## Estrutura
- `index.html` · `css/` · `js/` — o app.
- `CLAUDE.md` — diretrizes de código.
- `CHECKLIST.md` — roteiro de construção (fases/itens).
- `PROMPT.md` — prompt da skill-maestro para a skill-executor.
- `.mural/` — aprendizado (PADROES / eventos / licoes).

## Stack
Vanilla JS + CSS (HTML+CSS+JS modulares), dados mock em memória → Supabase (Etapa 28)
