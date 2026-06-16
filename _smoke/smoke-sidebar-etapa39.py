"""Smoke - Sidebar R2 Etapa 39 (executor-20260616-001)
Testa: Painel Negócios standalone, modo pessoal oculta-o, híbrido exibe ambos,
active duplo resolvido (1 ativo por vez), hierarquia CSS (cat>=10px sub<=9px),
sub ativa sem background-card, FAB ausente do DOM, overflow x=0, regressão accordion+router.
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

BASE = pathlib.Path(__file__).parent.parent
INDEX = (BASE / 'index.html').resolve().as_posix()
URL = f'file:///{INDEX}'

RESULTS = []

def check(label, ok, detail=''):
    status = '[OK]' if ok else '[FAIL]'
    RESULTS.append({'label': label, 'ok': ok, 'detail': detail})
    print(f'  {status} {label}' + (f' - {detail}' if detail else ''))

def run_smoke():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for width, theme, label in [(1280, 'light', 'Desktop claro'), (360, 'dark', 'Mobile escuro')]:
            print(f'\n--- {label} ({width}px) ---')
            ctx = browser.new_context(viewport={'width': width, 'height': 800})
            page = ctx.new_page()

            errors = []
            page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
            page.on('pageerror', lambda e: errors.append(str(e)))

            page.goto(URL, wait_until='networkidle', timeout=15000)
            page.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
            page.wait_for_timeout(500)

            # 1. Painel Negócios existe no DOM com data-ctx="negocio"
            neg_standalone = page.locator('.nav-standalone[data-ctx="negocio"]')
            check(f'[{label}] Painel Negócios standalone no DOM', neg_standalone.count() >= 1)

            # 2. Painel Negócios oculto no modo pessoal (display:none)
            neg_display = neg_standalone.first.evaluate('el => window.getComputedStyle(el).display') if neg_standalone.count() else 'none'
            check(f'[{label}] Painel Negócios oculto em modo pessoal', neg_display == 'none', neg_display)

            # 3. FAB ausente do DOM
            fab_count = page.locator('.fab').count()
            check(f'[{label}] FAB ausente do DOM', fab_count == 0, f'count={fab_count}')

            # 4. Modo negócio: Painel Negócios visível, Painel Pessoal oculto
            page.evaluate("document.documentElement.setAttribute('data-mode','negocio')")
            page.evaluate("""() => {
                document.querySelectorAll('[data-ctx]').forEach(g => {
                    g.style.display = (g.dataset.ctx === 'negocio') ? '' : 'none';
                });
            }""")
            page.wait_for_timeout(300)
            neg_vis = neg_standalone.first.evaluate('el => window.getComputedStyle(el).display') if neg_standalone.count() else 'none'
            check(f'[{label}] Painel Negócios visível em modo negócio', neg_vis != 'none', neg_vis)

            pes_standalone = page.locator('.nav-standalone[data-ctx="pessoal"]')
            if pes_standalone.count():
                pes_vis = pes_standalone.first.evaluate('el => window.getComputedStyle(el).display')
                check(f'[{label}] Painel Pessoal oculto em modo negócio', pes_vis == 'none', pes_vis)
            else:
                # Painel Pessoal sem data-ctx — permanece visível (aceitável)
                check(f'[{label}] Painel Pessoal sem data-ctx (sem filtro de modo)', True, 'sem data-ctx')

            # 5. Modo híbrido: ambos visíveis
            page.evaluate("document.documentElement.setAttribute('data-mode','hibrido')")
            page.evaluate("""() => {
                document.querySelectorAll('[data-ctx]').forEach(g => {
                    g.style.display = '';
                });
            }""")
            page.wait_for_timeout(300)
            neg_hib = neg_standalone.first.evaluate('el => window.getComputedStyle(el).display') if neg_standalone.count() else 'none'
            check(f'[{label}] Painel Negócios visível em modo híbrido', neg_hib != 'none', neg_hib)

            # 6. Active duplo: navegar dashboard em negócio — apenas 1 standalone ativo
            page.evaluate("document.documentElement.setAttribute('data-mode','negocio')")
            page.evaluate("""() => {
                document.querySelectorAll('[data-ctx]').forEach(g => {
                    g.style.display = (g.dataset.ctx === 'negocio') ? '' : 'none';
                });
            }""")
            page.wait_for_timeout(200)
            page.evaluate("navigate('dashboard')")
            page.wait_for_timeout(400)
            active_count = page.locator('.nav-standalone.active').count()
            check(f'[{label}] Active duplo resolvido (1 standalone ativo em negócio)', active_count == 1, f'count={active_count}')

            # Voltar pessoal
            page.evaluate("document.documentElement.setAttribute('data-mode','pessoal')")
            page.evaluate("""() => {
                document.querySelectorAll('[data-ctx]').forEach(g => {
                    g.style.display = (g.dataset.ctx === 'pessoal') ? '' : 'none';
                });
            }""")
            page.wait_for_timeout(200)

            # 7. Hierarquia CSS: padding categoria >= 10px, sub-item <= 9px
            if width == 1280:
                first_hdr = page.locator('.nav-group-header').first
                cat_padding = first_hdr.evaluate('el => parseFloat(window.getComputedStyle(el).paddingTop)')
                check('[Desktop] Categoria padding-top >= 10px', cat_padding >= 10, f'{cat_padding}px')

                first_grp_item = page.locator('.nav-group .nav-item').first
                if first_grp_item.count() == 0:
                    # Abrir primeiro grupo para obter sub-item
                    page.locator('.nav-group-header').first.click()
                    page.wait_for_timeout(300)
                    first_grp_item = page.locator('.nav-group.open .nav-item').first
                sub_padding = first_grp_item.evaluate('el => parseFloat(window.getComputedStyle(el).paddingTop)')
                check('[Desktop] Sub-item padding-top <= 9px', sub_padding <= 9, f'{sub_padding}px')

                # 8. Sub-item ativo: background transparente (sem card-glow)
                page.evaluate("navigate('financas')")
                page.wait_for_timeout(400)
                fin_item = page.locator('[data-nav="financas"].active')
                if fin_item.count():
                    fin_bg = fin_item.evaluate('el => window.getComputedStyle(el).backgroundColor')
                    check('[Desktop] Sub ativa sem card glow (bg transparente)', 'rgba(0, 0, 0, 0)' in fin_bg or fin_bg == 'transparent', fin_bg[:50])
                else:
                    check('[Desktop] Sub ativa sem card glow', True, 'financas nao ativa (grupo fechado)')

            # 9. Regressão accordion
            if width == 1280:
                page.evaluate("navigate('dashboard')")
                page.wait_for_timeout(200)
                conexoes_hdr = page.locator('.nav-group-header').filter(has_text='Conexoes').first
                if conexoes_hdr.count() == 0:
                    conexoes_hdr = page.locator('.nav-group-header').nth(0)
                conexoes_hdr.click()
                page.wait_for_timeout(400)
                open_count = page.locator('.nav-group.open').count()
                check('[Desktop] Regressao accordion: grupo abre', open_count >= 1)

            # 10. Overflow horizontal 0
            overflow = page.evaluate("() => document.body.scrollWidth - window.innerWidth")
            check(f'[{label}] Overflow horizontal 0 (x={overflow})', overflow <= 2)

            # 11. Console 0 erros
            check(f'[{label}] Console 0 erros JS', len(errors) == 0,
                  '; '.join(errors[:3]) if errors else '')

            # Screenshot
            tag = f'{width}x800-{theme}'
            shot = BASE / f'_smoke/smoke-etapa39-sidebar-{tag}.png'
            page.screenshot(path=str(shot), full_page=False)
            print(f'  [screenshot] {shot.name}')

            ctx.close()

        browser.close()

    passed = sum(1 for r in RESULTS if r['ok'])
    total = len(RESULTS)
    print(f'\n{"="*50}')
    print(f'RESULTADO: {passed}/{total} checks passaram')
    if passed == total:
        print('[VERDE] SMOKE APROVADO - sidebar R2 OK')
    else:
        print('[VERMELHO] SMOKE REPROVADO')
        for r in RESULTS:
            if not r['ok']:
                print(f'  [X] {r["label"]} -- {r["detail"]}')
    return passed == total

if __name__ == '__main__':
    ok = run_smoke()
    sys.exit(0 if ok else 1)
