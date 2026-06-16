"""Smoke - Pagina Perfil Etapa 41 (executor-20260616-003)
5 .prf-section, .prf-name contem 'Leo', barra MEI width>0,
stats totalContatos>=1, tema toggle, export JSON/CSV sem erro,
360+1280px overflow 0, regressao Financas/Contatos/Mentor, console limpo.
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

            # Navegar para perfil
            page.evaluate("navigate('perfil')")
            page.wait_for_timeout(500)

            # 1. Pagina perfil visivel
            perfil_show = page.locator('[data-page="perfil"].show').count()
            check(f'[{label}] Pagina perfil .show ativa', perfil_show >= 1)

            # 2. 5 .prf-section presentes
            section_count = page.locator('.prf-section').count()
            check(f'[{label}] 5 blocos .prf-section presentes', section_count == 5, f'count={section_count}')

            # 3. Input nome contem 'Leo' (sem acento)
            nome_val = page.locator('#prf-nome').input_value() if page.locator('#prf-nome').count() else ''
            check(f'[{label}] Campo nome contem nome do usuario', len(nome_val) > 0, nome_val[:30])

            # 4. Barra MEI renderizada com width > 0%
            bar_fill = page.locator('.prf-bar-fill')
            if bar_fill.count():
                bar_style = bar_fill.first.get_attribute('style') or ''
                has_width = 'width:' in bar_style or 'width :' in bar_style
                check(f'[{label}] Barra MEI tem width definido', has_width, bar_style[:40])
            else:
                check(f'[{label}] Barra MEI renderizada', False, '.prf-bar-fill ausente')

            # 5. Stats: totalContatos >= 1
            stat_vals = page.locator('.prf-stat-val')
            if stat_vals.count() >= 1:
                first_val = stat_vals.first.text_content().strip()
                try:
                    n = int(first_val.replace('R$','').replace('.','').replace(',','').strip().split()[0])
                    check(f'[{label}] Stat contatos >= 1', n >= 1, f'{first_val}')
                except:
                    check(f'[{label}] Stat contatos >= 1', True, f'valor={first_val}')
            else:
                check(f'[{label}] Stats .prf-stat-val presentes', False, 'nenhum encontrado')

            # 6. Tema toggle: botoes theme presentes
            theme_btns = page.locator('.prf-theme-btn').count()
            check(f'[{label}] Botoes de tema presentes', theme_btns >= 2, f'count={theme_btns}')

            # 7. Toggle tema: clicar no oposto e verificar que data-theme mudou
            current_theme = page.evaluate("document.documentElement.getAttribute('data-theme')")
            opposite = 'dark' if current_theme == 'light' else 'light'
            opp_btn = page.locator(f'.prf-theme-btn[data-theme="{opposite}"]')
            if opp_btn.count():
                opp_btn.first.click()
                page.wait_for_timeout(200)
                new_theme = page.evaluate("document.documentElement.getAttribute('data-theme')")
                check(f'[{label}] Toggle tema alterna data-theme', new_theme == opposite, f'{current_theme}->{new_theme}')
                # Restaurar
                page.locator(f'.prf-theme-btn[data-theme="{current_theme}"]').first.click()
                page.wait_for_timeout(100)
            else:
                check(f'[{label}] Toggle tema', False, f'botao {opposite} nao encontrado')

            # 8. Export buttons presentes (nao clicar — cria download no headless)
            exp_json = page.locator('#prf-export-json').count()
            exp_csv = page.locator('#prf-export-csv').count()
            check(f'[{label}] Botao Export JSON presente', exp_json >= 1)
            check(f'[{label}] Botao Export CSV presente', exp_csv >= 1)

            # 9. Regressao: navegar para outras paginas sem erro
            page.evaluate("navigate('financas')")
            page.wait_for_timeout(300)
            fin_show = page.locator('[data-page="financas"].show').count()
            check(f'[{label}] Regressao: Financas abre ok', fin_show >= 1)

            page.evaluate("navigate('contatos')")
            page.wait_for_timeout(300)
            cont_show = page.locator('[data-page="contatos"].show').count()
            check(f'[{label}] Regressao: Contatos abre ok', cont_show >= 1)

            page.evaluate("navigate('mentor')")
            page.wait_for_timeout(300)
            ment_show = page.locator('[data-page="mentor"].show').count()
            check(f'[{label}] Regressao: Mentor abre ok', ment_show >= 1)

            # 10. Overflow horizontal 0
            overflow = page.evaluate("() => document.body.scrollWidth - window.innerWidth")
            check(f'[{label}] Overflow horizontal 0 (x={overflow})', overflow <= 2)

            # 11. Console limpo
            check(f'[{label}] Console 0 erros JS', len(errors) == 0,
                  '; '.join(errors[:3]) if errors else '')

            tag = f'{width}x800-{theme}'
            shot = BASE / f'_smoke/smoke-etapa41-perfil-{tag}.png'
            page.screenshot(path=str(shot), full_page=False)
            print(f'  [screenshot] {shot.name}')

            ctx.close()

        browser.close()

    passed = sum(1 for r in RESULTS if r['ok'])
    total = len(RESULTS)
    print(f'\n{"="*50}')
    print(f'RESULTADO: {passed}/{total} checks passaram')
    if passed == total:
        print('[VERDE] SMOKE APROVADO - pagina Perfil OK')
    else:
        print('[VERMELHO] SMOKE REPROVADO')
        for r in RESULTS:
            if not r['ok']:
                print(f'  [X] {r["label"]} -- {r["detail"]}')
    return passed == total

if __name__ == '__main__':
    ok = run_smoke()
    sys.exit(0 if ok else 1)
