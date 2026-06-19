"""Smoke — Contatos Negocio F2 (executor-20260618-004)
Ficha do cliente no padrao .ctf-* (hero + Caderneta -> Resumo -> Relacionamento -> Extrato),
pills WhatsApp/Ligar/Acoes, janelinha (popover), logica fiado/limite/receber, regressao.
"""
import subprocess, sys, pathlib

def install(pkg):
    subprocess.check_call([sys.executable,'-m','pip','install',pkg,'-q'])

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    install('playwright')
    subprocess.check_call([sys.executable,'-m','playwright','install','chromium','--quiet'])
    from playwright.sync_api import sync_playwright

BASE  = pathlib.Path(__file__).parent.parent
URL   = f'file:///{(BASE / "index.html").resolve().as_posix()}'
SHOTS = BASE / 'tarefas' / 'screenshots'
SHOTS.mkdir(parents=True, exist_ok=True)

RESULTS = []

def check(label, ok, detail=''):
    status = '[OK  ]' if ok else '[FAIL]'
    RESULTS.append({'label': label, 'ok': ok, 'detail': detail})
    print(f'  {status} {label}' + (f' -- {detail}' if detail else ''))

def close_any_modal(page):
    btn = page.locator('.modal-back.show [data-close]')
    if btn.count() > 0:
        btn.first.click()
    else:
        page.keyboard.press('Escape')
    page.wait_for_timeout(300)

def open_ficha(page, ROOT):
    """Abre a ficha do 1o cliente da lista (devedores primeiro = com fiado)."""
    page.evaluate("navigate('clientes')")
    page.wait_for_timeout(600)
    cc = page.locator(f'{ROOT} .ct-click').first
    cc.scroll_into_view_if_needed()
    page.wait_for_timeout(150)
    cc.click()
    page.wait_for_timeout(500)

def run_smoke():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ROOT = '#clientes-root'

        for width, theme, lbl in [(360, 'dark', 'Mobile-escuro'), (1280, 'light', 'Desktop-claro')]:
            print(f'\n--- {lbl} ({width}px) ---')
            ctx = browser.new_context(viewport={'width': width, 'height': 880})
            page = ctx.new_page()

            errors = []
            page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
            page.on('pageerror', lambda e: errors.append(str(e)))

            page.goto(URL, wait_until='domcontentloaded', timeout=30000)
            page.wait_for_timeout(800)
            page.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
            page.wait_for_timeout(300)

            open_ficha(page, ROOT)

            # ── Estrutura da ficha (.ctf-*) ────────────────────────────────
            check(f'[{lbl}] .ctf-head + .ctf-back (Voltar)',
                  page.locator(f'{ROOT} .ctf-head .ctf-back').count() >= 1)
            check(f'[{lbl}] .ctf-hero presente',
                  page.locator(f'{ROOT} .ctf-hero').count() >= 1)
            check(f'[{lbl}] hero: .ct-av + .ctf-nm + .ctf-score',
                  page.locator(f'{ROOT} .ctf-hero .ct-av').count() >= 1 and
                  page.locator(f'{ROOT} .ctf-hero .ctf-nm').count() >= 1 and
                  page.locator(f'{ROOT} .ctf-hero .ctf-score').count() >= 1)

            # av 74px
            av_sz = page.evaluate(f"""() => {{
                const el=document.querySelector('{ROOT} .ctf-hero .ct-av');
                return el?Math.round(el.getBoundingClientRect().width):-1;
            }}""")
            check(f'[{lbl}] avatar 74px', 72 <= av_sz <= 76, f'w={av_sz}px')

            # pills
            check(f'[{lbl}] .ctf-pills com pill WhatsApp (.ctf-pill-wa)',
                  page.locator(f'{ROOT} .ctf-pills .ctf-pill-wa').count() >= 1)
            check(f'[{lbl}] pill Acoes (.ctf-pill-acts [data-fpop])',
                  page.locator(f'{ROOT} .ctf-pill-acts[data-fpop]').count() >= 1)

            # cards na ordem
            cards = page.evaluate(f"""() => {{
                return [...document.querySelectorAll('{ROOT} .ctf-cards .ctf-card .ctf-chead h3')].map(h=>h.textContent.trim());
            }}""")
            ordem_ok = (len(cards) == 4 and 'Caderneta' in cards[0] and 'Resumo' in cards[1]
                        and 'Relacionamento' in cards[2] and 'Extrato' in cards[3])
            check(f'[{lbl}] 4 cards na ordem Caderneta->Resumo->Relacionamento->Extrato',
                  ordem_ok, f'cards={cards}')

            # caderneta
            check(f'[{lbl}] Caderneta: .cad-val + .cad-bar',
                  page.locator(f'{ROOT} .cad-val').count() >= 1 and
                  page.locator(f'{ROOT} .cad-bar > div').count() >= 1)
            # resumo: 4 KPIs
            fk = page.locator(f'{ROOT} .fk-grid .fk').count()
            check(f'[{lbl}] Resumo: 4 KPIs (.fk)', fk == 4, f'count={fk}')
            # extrato full + linhas .ctf-ev
            check(f'[{lbl}] Extrato .ctf-card--full + linhas .ctf-ev',
                  page.locator(f'{ROOT} .ctf-card--full').count() >= 1 and
                  page.locator(f'{ROOT} .ctf-ev').count() >= 1)

            # ── Logica fiado/limite/receber ────────────────────────────────
            # Cobrar no WhatsApp (cliente com fiado)
            cobrar = page.locator(f'{ROOT} .ctf-btn-pri')
            check(f'[{lbl}] Botao "Cobrar no WhatsApp" (cliente c/ fiado)',
                  cobrar.count() >= 1, f'count={cobrar.count()}')
            # Limite abre modal
            lim = page.locator(f'{ROOT} [data-editlim]').first
            if lim.count() > 0:
                lim.click(); page.wait_for_timeout(400)
                check(f'[{lbl}] "Limite" abre modal', page.locator('.modal-back.show').count() >= 1)
                close_any_modal(page)
            else:
                check(f'[{lbl}] "Limite" abre modal', False, '[data-editlim] ausente')
            # Receber abre modal
            rec = page.locator(f'{ROOT} [data-receber]').first
            if rec.count() > 0:
                rec.click(); page.wait_for_timeout(400)
                check(f'[{lbl}] "Receber" abre modal', page.locator('.modal-back.show').count() >= 1)
                close_any_modal(page)
            else:
                check(f'[{lbl}] "Receber" presente (cliente c/ fiado)', False, '[data-receber] ausente')

            # ── Janelinha [zap] ───────────────────────────────────────────────
            fpop = page.locator(f'{ROOT} [data-fpop]').first
            fpop.click(); page.wait_for_timeout(350)
            check(f'[{lbl}] [zap] abre janelinha (#ctf-pop.show)',
                  page.locator(f'{ROOT} #ctf-pop.show').count() >= 1)
            # fecha fora
            page.locator('body').click(position={'x': 8, 'y': 8}); page.wait_for_timeout(300)
            check(f'[{lbl}] janelinha fecha ao clicar fora',
                  page.locator(f'{ROOT} .ct-pop.show').count() == 0)
            # fecha ESC
            fpop.click(); page.wait_for_timeout(250)
            page.keyboard.press('Escape'); page.wait_for_timeout(250)
            check(f'[{lbl}] janelinha fecha com ESC',
                  page.locator(f'{ROOT} .ct-pop.show').count() == 0)
            # acao Editar abre modal
            fpop.click(); page.wait_for_timeout(250)
            ed = page.locator(f'{ROOT} #ctf-pop [data-fact="editar"]')
            if ed.count() > 0:
                ed.click(); page.wait_for_timeout(450)
                check(f'[{lbl}] [zap] Editar abre modal', page.locator('.modal-back.show').count() >= 1)
                close_any_modal(page)
            else:
                check(f'[{lbl}] [zap] Editar presente', False, '[data-fact=editar] ausente')

            # Screenshot da ficha
            shot = SHOTS / f'smoke-ct-neg-f2-{width}.png'
            page.screenshot(path=str(shot), full_page=False)
            print(f'  [screenshot] {shot.name}')

            # ── Voltar -> lista ────────────────────────────────────────────
            page.locator(f'{ROOT} [data-back]').first.click(); page.wait_for_timeout(450)
            check(f'[{lbl}] Voltar retorna a lista (.ct-page)',
                  page.locator(f'{ROOT} .ct-page').count() >= 1)

            # ── Regressao ──────────────────────────────────────────────────
            check(f'[{lbl}] REGRESSAO lista .ct-itemwrap intacta',
                  page.locator(f'{ROOT} .ct-itemwrap').count() >= 1)
            forn = page.locator(f'{ROOT} .ct-seg button[data-aba="fornecedores"]')
            if forn.count() > 0:
                forn.click(); page.wait_for_timeout(400)
                check(f'[{lbl}] REGRESSAO Fornecedores ativa',
                      page.locator(f'{ROOT} .ct-seg button.on[data-aba="fornecedores"]').count() >= 1)
                page.locator(f'{ROOT} .ct-seg button[data-aba="clientes"]').click()
                page.wait_for_timeout(300)
            else:
                check(f'[{lbl}] REGRESSAO Fornecedores presente', False, 'aba ausente')

            # ── Metricas ───────────────────────────────────────────────────
            open_ficha(page, ROOT)  # reabre p/ medir overflow na ficha
            ov = page.evaluate("() => document.body.scrollWidth - window.innerWidth")
            check(f'[{lbl}] Overflow horizontal = 0 (ficha)', ov <= 2, f'overflow={ov}px')
            ov_root = page.evaluate(f"""() => {{
                const el=document.querySelector('{ROOT}');
                return el?el.scrollWidth - el.clientWidth:-1;
            }}""")
            check(f'[{lbl}] Sem overflow no root da ficha', ov_root <= 2, f'delta={ov_root}px')
            check(f'[{lbl}] Console 0 erros JS', len(errors) == 0,
                  '; '.join(errors[:3]) if errors else '')

            ctx.close()

        browser.close()

    passed = sum(1 for r in RESULTS if r['ok'])
    total  = len(RESULTS)
    print(f'\n{"="*60}')
    print(f'RESULTADO: {passed}/{total} checks passaram')
    ok = passed == total
    if ok:
        print('[VERDE] SMOKE APROVADO -- Contatos Negocio F2 (ficha .ctf-*) OK')
    else:
        print('[VERMELHO] SMOKE REPROVADO')
        for r in RESULTS:
            if not r['ok']:
                print(f'  FAIL: {r["label"]} -- {r["detail"]}')
    return ok

if __name__ == '__main__':
    sys.exit(0 if run_smoke() else 1)
