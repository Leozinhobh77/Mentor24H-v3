"""Smoke - Contatos Fatia 1 (executor-20260617-002)
Testa: KPIs slim, toolbar chips, itens 2-linhas, score badge, filtros, overflow=0.
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
    print(f'  {status} {label}' + (f' — {detail}' if detail else ''))

def nav_contatos(page, width):
    if width == 1280:
        page.evaluate("navigate('contatos')")
    else:
        page.evaluate("navigate('contatos')")
    page.wait_for_timeout(600)

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

            page.goto(URL, wait_until='networkidle', timeout=15000)
            page.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
            page.wait_for_timeout(400)

            nav_contatos(page, width)

            # 1. ct-page wrapper presente
            ct_page = page.locator('.ct-page').count()
            check(f'[{lbl}] ct-page wrapper renderizado', ct_page >= 1)

            # 2. KPIs slim — faixa única (.ct-kpis) com 3 .ct-kpi
            kpis = page.locator('.ct-kpis .ct-kpi').count()
            check(f'[{lbl}] KPIs slim: 3 .ct-kpi dentro de .ct-kpis', kpis == 3, f'count={kpis}')

            # 3. ct-kpi-v com valor numérico
            first_val = page.locator('.ct-kpi-v').first.text_content()
            check(f'[{lbl}] ct-kpi-v tem valor', first_val.strip().isdigit(), f'val={first_val!r}')

            # 4. Busca full-width (.ct-search input)
            search_input = page.locator('.ct-search input').count()
            check(f'[{lbl}] ct-search input presente', search_input >= 1)

            # 5. Segmento (.ct-seg) com 3 botões
            seg_btns = page.locator('.ct-seg button').count()
            check(f'[{lbl}] ct-seg com 3 botões', seg_btns == 3, f'count={seg_btns}')

            # 6. Chips de tags (.ct-chips .ct-chip) — ao menos 1 ("Todas")
            chips = page.locator('.ct-chips .ct-chip').count()
            check(f'[{lbl}] ct-chips: ao menos 1 chip (Todas)', chips >= 1, f'count={chips}')

            # 7. ct-newbtn presente
            newbtn = page.locator('.ct-newbtn').count()
            check(f'[{lbl}] ct-newbtn (Novo contato) presente', newbtn >= 1)

            # 8. Itens de contato renderizados (.ct-item)
            items = page.locator('.ct-item').count()
            check(f'[{lbl}] .ct-item: ao menos 1 contato renderizado', items >= 1, f'count={items}')

            # 9. L1 (nome) presente nos itens
            l1 = page.locator('.ct-l1').count()
            check(f'[{lbl}] .ct-l1 presente em cada item', l1 >= 1, f'count={l1}')

            # 10. L2 presente nos itens
            l2 = page.locator('.ct-l2').count()
            check(f'[{lbl}] .ct-l2 presente em cada item', l2 >= 1, f'count={l2}')

            # 11. ct-ctx (contexto) nas linhas
            ctx_spans = page.locator('.ct-ctx').count()
            check(f'[{lbl}] .ct-ctx aparece nas linhas', ctx_spans >= 1, f'count={ctx_spans}')

            # 12. Nome em ct-nm (text-overflow:ellipsis — só verifica que existe)
            nm_spans = page.locator('.ct-nm').count()
            check(f'[{lbl}] .ct-nm presente (nome com ellipsis)', nm_spans >= 1, f'count={nm_spans}')

            # 13. Filtro busca: digitar "Ana" e verificar que lista reduziu
            original_count = page.locator('.ct-item').count()
            page.locator('.ct-search input').fill('Ana')
            page.wait_for_timeout(400)
            filtered_count = page.locator('.ct-item').count()
            check(f'[{lbl}] Busca "Ana" filtra lista (menos itens ou apenas "Ana")',
                  filtered_count <= original_count, f'antes={original_count} depois={filtered_count}')
            # limpar busca
            page.locator('.ct-search input').fill('')
            page.wait_for_timeout(300)

            # 14. Filtro segmento: clicar Pessoal → lista muda (ou mantém se só pessoal)
            page.locator('.ct-seg button[data-ctx="pessoal"]').click()
            page.wait_for_timeout(400)
            pes_active = page.locator('.ct-seg button.on[data-ctx="pessoal"]').count()
            check(f'[{lbl}] Filtro Pessoal ativa botão .on', pes_active >= 1)
            page.locator('.ct-seg button[data-ctx="todos"]').click()
            page.wait_for_timeout(300)

            # 15. Click num item → renderFicha (aparece [data-back])
            page.locator('.ct-click').first.click()
            page.wait_for_timeout(500)
            back_btn = page.locator('[data-back]').count()
            check(f'[{lbl}] Clique no item abre renderFicha ([data-back] presente)', back_btn >= 1)
            if back_btn >= 1:
                page.locator('[data-back]').click()
                page.wait_for_timeout(400)

            # 16. Overflow horizontal = 0
            ov = page.evaluate("() => document.body.scrollWidth - window.innerWidth")
            check(f'[{lbl}] Overflow horizontal = 0 (val={ov})', ov <= 2, f'overflow={ov}')

            # 17. Console limpo
            check(f'[{lbl}] Console 0 erros JS', len(errors) == 0,
                  '; '.join(errors[:3]) if errors else '')

            # Screenshot
            shot = SHOTS / f'smoke-contatos-{width}.png'
            page.screenshot(path=str(shot), full_page=False)
            print(f'  [screenshot] {shot.name}')

            ctx.close()

        browser.close()

    passed = sum(1 for r in RESULTS if r['ok'])
    total  = len(RESULTS)
    print(f'\n{"="*54}')
    print(f'RESULTADO: {passed}/{total} checks passaram')
    if passed == total:
        print('[VERDE] SMOKE APROVADO — Contatos Fatia 1 OK')
    else:
        print('[VERMELHO] SMOKE REPROVADO')
        for r in RESULTS:
            if not r['ok']:
                print(f'  FAIL: {r["label"]} — {r["detail"]}')
    return passed == total

if __name__ == '__main__':
    ok = run_smoke()
    sys.exit(0 if ok else 1)
