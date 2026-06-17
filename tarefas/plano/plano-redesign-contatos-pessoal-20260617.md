# PLANO VIVO — Redesign tela Contatos (modo Pessoal)
> projeto: Mentor24h-v3 · criado 2026-06-17 · status: ✅ GERADO → executor-20260617-001 (Tarefa-79..84)

## Norte (a ideia em 3 linhas)
Repaginar visual + reorganizar layout da tela Contatos no contexto Pessoal, mantendo 100% do CRUD
e funcionalidades atuais (score de relacionamento, manter contato, datas, timeline, próxima ação).
Elevar a experiência ao nível "app premium do mundo" — inclusive a experiência de cadastrar/editar
(telefone com país+DDD+máscara, e-mail validado, campos padronizados). Cara "Quiet Premium" do Mentor24h.

## O que conversamos (cru — append-only)
- Dores (Léo, todas marcadas): cards grandes demais; tela feia; CRUD ótimo (MANTER) mas mal organizado;
  não tem cara premium do Mentor24h; filtros mal organizados; tela mal elaborada.
- Experiência de input ruim: telefone sem código de país (já abrir no Brasil), sem máscara de DDD,
  sem distinguir celular/fixo; e-mail sem validação/formatação. Quer tudo padronizado nível app top.
- Pediu: pesquisar os melhores apps do mundo (feito) + completar a visão a nível sênior/eng. de software
  (quais experts entrariam, como planejariam) + entregar tela com todos componentes/layout/cores/espaçamento.
- Escopo travado: SÓ a visão Pessoal (preserva comportamento do modo Negócio/Clientes). Profundidade: visual + layout.
- Invocou 🔮 Prompt Mestre: gerar Prompt completo de referência com todo o contexto enriquecido.

## Pesquisa (P3 — fontes reais)
- Dex (CRM #1 emocional 2026): "relationship strength indicators" → já temos (relScore 🔥💚⚠️❄️), falta destaque visual.
- Google Contacts Material 3 Expressive: cards-container, ícones em PÍLULA, layout limpo, mais respiro.
- intl-tel-input (padrão mundial): seletor país bandeira+DDI, formata enquanto digita, guarda E.164. Default 🇧🇷 +55.
- Phone field best practices: máscara automática por país, validação por país, seletor de país clicável.
- Lists premium: whitespace, escaneável, segmented filters, estados vazio/loading/erro, overscroll isolado.

## Estado atual (P1 — pré-mapeado)
- js/pessoal/09-contatos.js — IIFE Contatos: render() lista · renderFicha() detalhe · form() criar/editar.
- KPIs: Contatos / Aniversários 30d / Para reconectar. Toolbar: seg(Todos/Pessoal/Negócio) + select tag + busca + Novo.
- Lista A-Z + Favoritos no topo; itemHTML com avatar(avCor/ini), tags, ações (wa/tel/mail/fav/edit/del).
- Ficha: header + bento (Manter contato + score + próxima ação · Datas · Anotações · Timeline interações).
- CSS: css/estilo.css linhas ~820-832 (.ct-group-label/.ct-item/.ct-click/.ct-av/.ct-main/.ct-nm/.ct-tags/.ct-tag/.ct-acts) + 1513.
- Tela COMPARTILHADA entre modos (filtro contexto). Roteamento: js/01-core.js:273 (page==='contatos').
- form() hoje: campos soltos .field/.frow/.fg via Modal.open; telefone/e-mail texto livre, sem máscara/validação.

## Fases (P4 — decomposição · MoSCoW · ordem)
T1 — MUST · Campo padronizado + máscara telefone (país+DDD, default 🇧🇷+55, celular×fixo, E.164) + validação e-mail/nome → construtor/frontend-dev
T2 — MUST · TODOS os modais padronizados (D1 Novo/Editar usando T1 · D2 Excluir · D3 Falei hoje · D4 Próxima ação · D5 Nova data · D6 Registrar interação · D7 chips de canal): layout, validação por campo, loading, sucesso, ESC/fora, focus trap, scroll-lock → construtor/frontend-dev (+ forge)
T3 — MUST · Redesign LISTA: KPIs enxutos, filtros reorganizados (busca destaque + chips de tag + seg), linhas respiradas, score visível, faixa "Reconectar/Aniversários" → forge/ui-visual + construtor
T4 — MUST · Redesign FICHA: hero premium (avatar+nome+score) + ações em pílula (Material 3) + bento reorganizado/compacto → forge/ui-visual
T5 — MUST · CSS premium: tokens, .ct-* upgrade, microinterações, touch 44px, sem overflow, overscroll-behavior, responsivo → forge/design-system + interaction-designer
T6 — MUST · Smoke + QA: CRUD intacto, máscaras, validações, estados (vazio/erro), mobile 360/1280, modo Negócio inalterado → sentinela/smoke-visual + qa-funcional

## Régua (Lente Sênior — nada raso)
- Herda tokens Quiet Premium teal (zero cor hardcoded). Reusa .card/.kpi/.field/.btn/.ct-*.
- Estados completos: vazio + erro de validação por campo + loading no envio + sucesso (toast).
- Modal: fecha por botão+ESC+clicar fora · focus trap · trava scroll do fundo.
- A11y: alvo de toque 44px, aria-labels nos ícones, contraste, foco visível, inputmode/type corretos (tel/email).
- Telefone: máscara BR (XX) 9XXXX-XXXX (cel) / (XX) XXXX-XXXX (fixo); seletor país bandeira+DDI; armazena E.164.
- E-mail: validação regex, lowercase+trim, type=email, inputmode=email, erro inline.

## Cuidados técnicos (casados com expert)
- Máscara telefone vanilla (sem lib externa — projeto é vanilla, file://): formatar on input, cursor estável → frontend-dev.
- Não quebrar o modo Negócio/Clientes (mesma tela): mudanças condicionadas ao contexto pessoal onde divergir → frontend-dev.
- file:// bloqueia fetch/XHR: nada de assets remotos; bandeiras via emoji/CSS, não fetch → frontend-dev.
- overscroll-behavior:contain em listas/modais → interaction-designer.
- Migração de dados: telefones antigos (texto livre) devem continuar exibindo/funcionando (parse tolerante) → frontend-dev.

## Não Incluído (escopo negativo)
- Modo Negócio/Clientes (comportamento atual preservado — só não regredir).
- Integração real de telefonia/e-mail/WhatsApp API (mantém links wa.me/tel/mailto atuais).
- Sync Supabase / backend (continua mock DB em memória).
- Importar contatos do dispositivo/Google. Foto real de contato (mantém avatar inicial colorido).
- Novas funcionalidades de CRM além das existentes (sem IA, sem enrichment automático).

## Mapa COMPLETO de superfícies e componentes (P4b — "tudo a fundo", ajuste do Léo)
> Cada item abaixo precisa de desenho explícito no Prompt: layout, cores (tokens), espaçamento, estados, a11y.

### A) LISTA (render)
- A1 Faixa de KPIs (3): Contatos · Aniversários 30d · Para reconectar → enxugar, glanceable, ícone em pílula.
- A2 Toolbar/filtros: busca (destaque, ícone lupa, clear) · chips de TAG (substitui o <select>) · segmento Todos/Pessoal/Negócio · botão "Novo contato".
- A3 Faixa de destaque (nova, estilo Dex): "Reconectar" + "Aniversários próximos" no topo (quando houver).
- A4 Group labels: ★ Favoritos · letras A-Z (sticky opcional).
- A5 Linha de contato (itemHTML): avatar colorido(inicial) · nome + contexto · chips de tag + chip 🎂 · score de relacionamento visível · ações.
- A6 Ações da linha (botões/ícones): WhatsApp · Ligar · E-mail · Favoritar · Editar · Excluir (touch 44px, tooltip/aria).
- A7 Estado vazio (busca sem resultado / zero contatos): ícone + título + texto + CTA "Novo contato".
- A8 Estado de carga/erro (skeleton + mensagem) — mesmo com mock, padronizar.

### B) RAMIFICAÇÕES da linha
- B1 Clique no item → abre FICHA (renderFicha).
- B2 Favoritar → toast feedback.
- B3 Editar → MODAL de form (ver D1).
- B4 Excluir → MODAL de confirmação destrutiva (ver D2).

### C) FICHA (renderFicha — detalhe do contato)
- C1 Header: Voltar · Favoritar · Editar · Excluir (ícones consistentes).
- C2 HERO card: avatar grande · nome · contexto + "conheci por" · chips de tag · score · ações em PÍLULA (WhatsApp/Ligar/E-mail) estilo Material 3.
- C3 Card "Manter contato": último contato · alerta "Hora de reconectar" · select frequência (7/15/30/60/90d) · bloco "Próxima ação" (nota+data+remover) · botões "Falei hoje" + "Próxima ação".
- C4 Card "Datas importantes": aniversário · lista de datas (label+data+dias+remover) · botão "Adicionar data" · estado vazio.
- C5 Card "Anotações" (condicional).
- C6 Card "Histórico de interações": timeline (data·canal·nota·remover) · botão "Registrar" · estado vazio.
- C7 Compactar cards (resolver "card grande demais") + bento responsivo (col-6/col-12 → empilha no mobile).

### D) TODOS os MODAIS / caixas (cada um padronizado: header, campos, validação, ações, ESC/fora, focus trap, scroll-lock)
- D1 Novo/Editar contato: Nome* · Telefone (país+DDD+máscara) · E-mail (validado) · Contexto · Aniversário · Tags (chip input) · Como conheci · Anotações · Favorito. Erro por campo · loading no envio · sucesso.
- D2 Excluir contato (Modal.confirm): título + nome + cancelar/confirmar destrutivo (vermelho).
- D3 "Falei hoje" (Como foi o contato?): radios de canal (WhatsApp/Ligação/Presencial/E-mail) + nota opcional.
- D4 Nova/Editar próxima ação: o que fazer* + data.
- D5 Nova data importante: descrição* + data.
- D6 Registrar interação: canal (radios) + data + nota.
- D7 Componente "radios de canal" (tipoRadios): repaginar como chips/segmented selecionável.

### E) COMPONENTES transversais (padronizar 1 vez, reusar)
- E1 Campo de input padrão (.field): label, placeholder, foco, erro, ícone opcional, inputmode/type.
- E2 Campo de telefone internacional (país 🇧🇷+55 default + máscara cel/fixo + E.164).
- E3 Chip input de tags (add/remove, evita o "vírgula" cru).
- E4 Badge de score de relacionamento (🔥💚⚠️❄️ + cor semântica).
- E5 Botão em pílula de ação rápida (wa/tel/mail/registrar).
- E6 Toast + Modal base (já existem — só herdar e garantir ESC/fora/focus trap/scroll-lock).

## Rumo ao Prompt (consolida no P6)
Prompt Mestre de mudança cirúrgica · tier L · modos construtor + forge + sentinela · 6 tarefas · Sonnet/High.
