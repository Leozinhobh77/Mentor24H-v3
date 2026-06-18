"""Smoke — Contatos Negocio F1 (executor-20260618-002)
Verifica: rename, .ct-* lista, card robusto, janelinha (acao rapida), regressao.
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
    """Close any open modal via [data-close] inside .modal-back, else ESC."""
    close_btn = page.locator('.modal-back.show [data-close]')
    if close_btn.count() > 0:
        close_btn.first.click()
    else:
        page.keyboard.press('Escape')
    page.wait_for_timeout(300)

def run_smoke():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for width, theme, lbl in [(360, 'dark', 'Mobile-escuro'), (1280, 'light', 'Desktop-claro')]:
            print(f'\n--- {lbl} ({width}px) ---')
            ctx = browser.new_context(viewport={'width': width, 'height': 812})
            page = ctx.new_page()

            errors = []
            page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
            page.on('pageerror', lambda e: errors.append(str(e)))

            page.goto(URL, wait_until='domcontentloaded', timeout=30000)
            page.wait_for_timeout(800)
            page.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
            page.wait_for_timeout(400)

            # Navegar para clientes (Negocio)
            page.evaluate("navigate('clientes')")
            page.wait_for_timeout(700)

            ROOT = '#clientes-root'

            # ── T99: Rename + estrutura .ct-* ──────────────────────────────
            # 1. Titulo = "Contatos Negocio"
            title_el = page.locator('.page-title, h1').first
            title_txt = title_el.text_content() if title_el.count() > 0 else ''
            check(f'[{lbl}] Titulo "Contatos Negocio"',
                  'Contatos' in title_txt and 'Neg' in title_txt, f'txt={title_txt!r}')

            # 2. ct-page wrapper
            check(f'[{lbl}] .ct-page renderizado',
                  page.locator(f'{ROOT} .ct-page').count() >= 1)

            # 3. KPIs -- .ct-kpis com 3 .ct-kpi (scoped ao root)
            kpi_count = page.locator(f'{ROOT} .ct-kpis .ct-kpi').count()
            check(f'[{lbl}] .ct-kpis com 3 .ct-kpi', kpi_count == 3, f'count={kpi_count}')

            # 4. Busca -- .ct-search com input
            check(f'[{lbl}] .ct-search input presente',
                  page.locator(f'{ROOT} .ct-search input').count() >= 1)

            # 5. Aba bar -- .ct-seg com 2 botoes (scoped ao root)
            seg_count = page.locator(f'{ROOT} .ct-seg button').count()
            check(f'[{lbl}] .ct-seg com 2 botoes (Clientes/Fornecedores)',
                  seg_count == 2, f'count={seg_count}')

            # 6. Toggle Devedores -- .ct-filter + .ct-toggle
            check(f'[{lbl}] .ct-filter com .ct-toggle presente',
                  page.locator(f'{ROOT} .ct-filter .ct-toggle').count() >= 1)

            # 7. Separador .ct-group.deve
            check(f'[{lbl}] .ct-group.deve presente (Com pendencia)',
                  page.locator(f'{ROOT} .ct-group.deve').count() >= 1)

            # 8. .ct-itemwrap renderizado
            item_count = page.locator(f'{ROOT} .ct-itemwrap').count()
            check(f'[{lbl}] .ct-itemwrap renderizado (>=1)', item_count >= 1, f'count={item_count}')

            # ── T100: Card robusto ─────────────────────────────────────────
            # 9. ct-l1 (nome)
            check(f'[{lbl}] .ct-l1 presente',
                  page.locator(f'{ROOT} .ct-l1').count() >= 1)

            # 10. ct-l2 (RFM + meta + saldo)
            check(f'[{lbl}] .ct-l2 presente',
                  page.locator(f'{ROOT} .ct-l2').count() >= 1)

            # 11. ct-rfm badge
            check(f'[{lbl}] .ct-rfm badge presente',
                  page.locator(f'{ROOT} .ct-rfm').count() >= 1)

            # 12. ct-saldo chip
            check(f'[{lbl}] .ct-saldo chip presente',
                  page.locator(f'{ROOT} .ct-saldo').count() >= 1)

            # 13. Nome nao trunca
            nm_overflow = page.evaluate(f"""() => {{
                const el = document.querySelector('{ROOT} .ct-nm');
                if (!el) return -1;
                return el.scrollWidth - el.clientWidth;
            }}""")
            check(f'[{lbl}] .ct-nm nao overflow (delta<=2)',
                  nm_overflow <= 2, f'delta={nm_overflow}px')

            # ── T101: Janelinha ⚡ ─────────────────────────────────────────
            # 14. botao [data-pop] presente
            pop_btns = page.locator(f'{ROOT} [data-pop]').count()
            check(f'[{lbl}] [data-pop] button presente', pop_btns >= 1, f'count={pop_btns}')

            # 15. Popover abre ao clicar no botao ⚡
            first_pop_btn = page.locator(f'{ROOT} [data-pop]').first
            cid = first_pop_btn.get_attribute('data-pop')
            first_pop_btn.click()
            page.wait_for_timeout(400)
            pop_show = page.locator(f'#ct-pop-{cid}.show').count()
            check(f'[{lbl}] Popover abre (.ct-pop.show) ao clicar', pop_show >= 1)

            # 16. Popover fecha ao clicar fora
            page.locator('body').click(position={'x': 10, 'y': 10})
            page.wait_for_timeout(300)
            pop_after_outside = page.locator(f'{ROOT} .ct-pop.show').count()
            check(f'[{lbl}] Popover fecha ao clicar fora',
                  pop_after_outside == 0, f'show={pop_after_outside}')

            # 17. Popover fecha com ESC
            first_pop_btn.click()
            page.wait_for_timeout(300)
            page.keyboard.press('Escape')
            page.wait_for_timeout(300)
            pop_after_esc = page.locator(f'{ROOT} .ct-pop.show').count()
            check(f'[{lbl}] Popover fecha com ESC', pop_after_esc == 0, f'show={pop_after_esc}')

            # 18. Acao Editar abre modal (.modal-back.show)
            first_pop_btn.click()
            page.wait_for_timeout(300)
            editar_it = page.locator(f'#ct-pop-{cid} [data-act="editar"]')
            if editar_it.count() > 0:
                editar_it.click()
                page.wait_for_timeout(500)
                modal_open = page.locator('.modal-back.show').count()
                check(f'[{lbl}] Acao Editar abre modal (.modal-back.show)', modal_open >= 1)
                close_any_modal(page)
            else:
                check(f'[{lbl}] Acao Editar abre modal', False, '[data-act=editar] nao encontrado')

            # ── Regressao ──────────────────────────────────────────────────
            # 19. Aba Fornecedores troca view
            forn_btn = page.locator(f'{ROOT} .ct-seg button[data-aba="fornecedores"]')
            if forn_btn.count() > 0:
                forn_btn.click()
                page.wait_for_timeout(400)
                forn_active = page.locator(f'{ROOT} .ct-seg button.on[data-aba="fornecedores"]').count()
                check(f'[{lbl}] REGRESSAO aba Fornecedores ativa .on', forn_active >= 1)
                page.locator(f'{ROOT} .ct-seg button[data-aba="clientes"]').click()
                page.wait_for_timeout(400)
            else:
                check(f'[{lbl}] REGRESSAO aba Fornecedores presente', False, 'botao nao encontrado')

            # 20. Clique num item -> renderFicha ([data-back] aparece)
            ct_click = page.locator(f'{ROOT} .ct-click').first
            ct_click.scroll_into_view_if_needed()
            page.wait_for_timeout(200)
            ct_click.click()
            page.wait_for_timeout(600)
            back_count = page.locator('[data-back]').count()
            check(f'[{lbl}] REGRESSAO renderFicha abre ([data-back] presente)', back_count >= 1)
            if back_count >= 1:
                page.locator('[data-back]').first.click()
                page.wait_for_timeout(400)

            # 21. Overflow horizontal = 0
            ov = page.evaluate("() => document.body.scrollWidth - window.innerWidth")
            check(f'[{lbl}] Overflow horizontal = 0', ov <= 2, f'overflow={ov}px')

            # 22. Console limpo
            check(f'[{lbl}] Console 0 erros JS', len(errors) == 0,
                  '; '.join(errors[:3]) if errors else '')

            # Screenshot
            shot = SHOTS / f'smoke-ct-neg-f1-{width}.png'
            page.screenshot(path=str(shot), full_page=False)
            print(f'  [screenshot] {shot.name}')

            ctx.close()

        browser.close()

    passed = sum(1 for r in RESULTS if r['ok'])
    total  = len(RESULTS)
    print(f'\n{"="*60}')
    print(f'RESULTADO: {passed}/{total} checks passaram')
    if passed == total:
        print('[VERDE] SMOKE APROVADO -- Contatos Negocio F1 OK')
    else:
        print('[VERMELHO] SMOKE REPROVADO')
        for r in RESULTS:
            if not r['ok']:
                print(f'  FAIL: {r["label"]} -- {r["detail"]}')
    return passed == total

if __name__ == '__main__':
    ok = run_smoke()
    sys.exit(0 if ok else 1)
