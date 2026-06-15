"""Smoke - Sidebar Premium Etapa 38 (executor-20260615-006)
Testa: Painel Pessoal renomeado, 7 ícones, Nível 2 aceso, Nível 1 sub-ativa,
fix desktop mode-switch, divisórias, regressão accordion+router, overflow 0.
"""
import subprocess, sys, json, os, pathlib

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

            # Forçar tema
            if theme == 'dark':
                page.evaluate("document.documentElement.setAttribute('data-theme','dark')")
            else:
                page.evaluate("document.documentElement.setAttribute('data-theme','light')")

            page.wait_for_timeout(600)

            # 1. Painel Pessoal renomeado (não "Início")
            nav_text = page.locator('.nav-standalone span').first.text_content()
            check(f'[{label}] Painel Pessoal renomeado', 'Painel Pessoal' in nav_text, nav_text)

            # 2. 7 ícones nav-cat-icon presentes
            icon_count = page.locator('.nav-cat-icon').count()
            check(f'[{label}] 7 ícones nav-cat-icon renderizados', icon_count == 7, f'count={icon_count}')

            # 3. Painel Pessoal aceso após navegar ao dashboard (Nível 2 — standalone.active)
            if width == 1280:
                page.locator('.nav-standalone[data-nav="dashboard"]').click()
            else:
                page.evaluate("navigate('dashboard')")
            page.wait_for_timeout(300)
            standalone_active = page.locator('.nav-standalone.active').count()
            check(f'[{label}] Painel Pessoal ativo (glow) ao navegar dashboard', standalone_active >= 1)

            # 4. Clicar em Finanças e verificar Nível 2 aceso no grupo Dinheiro
            if width == 1280:
                # Abrir grupo Dinheiro primeiro
                dinheiro_hdr = page.locator('.nav-group-header').filter(has_text='Dinheiro').first
                dinheiro_hdr.click()
                page.wait_for_timeout(400)
                # Clicar em Finanças
                page.locator('[data-nav="financas"]').click()
                page.wait_for_timeout(400)
                # Nível 2: grupo Dinheiro deve ter active-parent
                dinheiro_group = page.locator('.nav-group').filter(has=page.locator('[data-nav="financas"]'))
                has_active_parent = dinheiro_group.evaluate("el => el.classList.contains('active-parent')")
                check('[Desktop] Nível 2 — Dinheiro.active-parent após clicar Finanças', has_active_parent)
                # Nível 1: Finanças deve ser .nav-item.active sem box-shadow (background transparente)
                fin_bg = page.locator('[data-nav="financas"]').evaluate(
                    "el => window.getComputedStyle(el).background || window.getComputedStyle(el).backgroundColor")
                check('[Desktop] Nível 1 — Finanças active sem card glow (bg transparente/none)',
                      'rgba(0, 0, 0, 0)' in fin_bg or 'transparent' in fin_bg or fin_bg == 'none', fin_bg[:60])
                # Mentor item aceso (após navegar de volta)
                page.locator('[data-nav="mentor"]').click()
                page.wait_for_timeout(300)
                mentor_active = page.locator('[data-nav="mentor"].active').count()
                check('[Desktop] Mentor aceso após navegação', mentor_active >= 1)

            # 5. Divisórias presentes (border-bottom nos grupos)
            first_group = page.locator('.nav-group').first
            border_bottom = first_group.evaluate(
                "el => window.getComputedStyle(el).borderBottomWidth")
            check(f'[{label}] Divisórias (border-bottom) nos grupos',
                  border_bottom not in ('0px', '', 'none', '0'), border_bottom)

            # 6. Fix desktop: mode-switch navega para dashboard
            if width == 1280:
                # Clicar em Negócio e verificar se dashboard ficou ativo
                neg_btn = page.locator('.mode-switch button[data-mode="negocio"]')
                if neg_btn.count():
                    neg_btn.click()
                    page.wait_for_timeout(400)
                    dashboard_visible = page.locator('[data-page="dashboard"].show').count()
                    check('[Desktop] Fix mode-switch: navega para dashboard ao trocar modo', dashboard_visible >= 1)
                    # Voltar p/ pessoal
                    pes_btn = page.locator('.mode-switch button[data-mode="pessoal"]')
                    if pes_btn.count():
                        pes_btn.click()
                        page.wait_for_timeout(300)

            # 7. Overflow horizontal = 0 (vertical scroll e normal)
            body_overflow = page.evaluate(
                "() => ({x: document.body.scrollWidth - window.innerWidth, y: document.body.scrollHeight - window.innerHeight})")
            check(f'[{label}] Overflow horizontal 0 (x={body_overflow["x"]})',
                  body_overflow['x'] <= 2)

            # 8. Console limpo
            check(f'[{label}] Console 0 erros JS', len(errors) == 0,
                  '; '.join(errors[:3]) if errors else '')

            # 9. Regressão: accordion ainda funciona (abrir/fechar grupo)
            if width == 1280:
                conexoes_hdr = page.locator('.nav-group-header').filter(has_text='Conexões').first
                conexoes_hdr.click()
                page.wait_for_timeout(300)
                conexoes_open = page.locator('.nav-group.open').filter(has=page.locator('[data-nav="contatos"]')).count()
                check('[Desktop] Regressão accordion: grupo Conexões abre ao clicar', conexoes_open >= 1)

            # Screenshot
            tag = f'{width}x800-{theme}'
            shot = BASE / f'_smoke/smoke-etapa38-sidebar-{tag}.png'
            page.screenshot(path=str(shot), full_page=False)
            print(f'  [screenshot] {shot.name}')

            ctx.close()

        browser.close()

    passed = sum(1 for r in RESULTS if r['ok'])
    total = len(RESULTS)
    print(f'\n{"="*50}')
    print(f'RESULTADO: {passed}/{total} checks passaram')
    if passed == total:
        print('[VERDE] SMOKE APROVADO - sidebar premium OK')
    else:
        print('[VERMELHO] SMOKE REPROVADO')
        for r in RESULTS:
            if not r['ok']:
                print(f'  ❌ {r["label"]} — {r["detail"]}')
    return passed == total

if __name__ == '__main__':
    ok = run_smoke()
    sys.exit(0 if ok else 1)
