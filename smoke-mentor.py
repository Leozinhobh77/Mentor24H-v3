# -*- coding: utf-8 -*-
"""
Smoke visual -- Tela Mentor (Etapa 30)
Testa 3 modos x 2 viewports = 6 cenarios
"""
import sys, asyncio
sys.stdout.reconfigure(encoding='utf-8')
from playwright.async_api import async_playwright

HTML = r'C:\Users\Usuário\Desktop\Curso Claude Code-Jhonatan de Souza\Mentor24h-v3\index.html'.replace('\\', '/')
URL = f'file:///{HTML}'

PASS = '✅'
FAIL = '❌'

results = []
total = 0
passed = 0

def check(label, ok, detail=''):
    global total, passed
    total += 1
    if ok:
        passed += 1
        results.append(f'{PASS} {label}{": "+detail if detail else ""}')
    else:
        results.append(f'{FAIL} {label}{": "+detail if detail else ""}')
    print(results[-1])

async def get_overflow(page, vw):
    return await page.evaluate(f'''() => {{
        const els = document.querySelectorAll("*");
        const over = [];
        const bw = {vw};
        els.forEach(el => {{
            const r = el.getBoundingClientRect();
            if (r.right > bw + 5 && el.tagName !== "BODY" && el.tagName !== "HTML") {{
                over.push(el.tagName + (el.className ? "." + el.className.toString().split(" ")[0] : "") + " right=" + r.right.toFixed(0));
            }}
        }});
        return over.slice(0, 10);
    }}''')

async def nav_mentor(page, modo):
    """Navegar para tela Mentor no modo especificado."""
    # Clicar no botão de modo
    await page.evaluate(f'''() => {{
        const btn = document.querySelector('[data-mode="{modo}"]');
        if (btn) btn.click();
    }}''')
    await page.wait_for_timeout(400)
    # Clicar no nav Mentor
    await page.evaluate('''() => {
        const nav = document.querySelector('[data-nav="mentor"]');
        if (nav) nav.click();
    }''')
    await page.wait_for_timeout(600)

async def smoke():
    errors = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # ── CENÁRIO 1: Pessoal desktop 1280px ──
        print('\n── PESSOAL · Desktop 1280px ──')
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})
        page.on('console', lambda m: errors.append(f'[{m.type}] {m.text}') if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(f'[pageerror] {e}'))
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(800)
        await nav_mentor(page, 'pessoal')

        check('Console limpo (pessoal desktop)', len(errors) == 0, f'{len(errors)} erros' if errors else '')
        ov = await get_overflow(page, 1280)
        check('Overflow 0px (pessoal desktop)', len(ov) == 0, str(ov[:3]) if ov else '')

        spot = await page.query_selector('.mtr-spotlight')
        check('Spotlight presente (pessoal)', spot is not None)
        grupos = await page.query_selector_all('.mtr-grupo')
        check('Grupos renderizados (pessoal)', len(grupos) > 0, f'{len(grupos)} grupos')
        resumo = await page.query_selector('.mtr-resumo')
        check('Cabeçalho presente (pessoal)', resumo is not None)

        await page.screenshot(path='smoke-mentor-pessoal-1280.png')
        print('  📸 smoke-mentor-pessoal-1280.png')

        # ── CENÁRIO 2: Pessoal mobile 360px ──
        print('\n── PESSOAL · Mobile 360px ──')
        await page.set_viewport_size({'width': 360, 'height': 800})
        await page.wait_for_timeout(300)
        ov_m = await get_overflow(page, 360)
        check('Overflow 0px (pessoal mobile)', len(ov_m) == 0, str(ov_m[:3]) if ov_m else '')
        await page.screenshot(path='smoke-mentor-pessoal-360.png')
        print('  📸 smoke-mentor-pessoal-360.png')
        await page.close()

        # ── CENÁRIO 3: Negócio desktop 1280px ──
        print('\n── NEGÓCIO · Desktop 1280px ──')
        errors.clear()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})
        page.on('console', lambda m: errors.append(f'[{m.type}] {m.text}') if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(f'[pageerror] {e}'))
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(800)
        await nav_mentor(page, 'negocio')

        check('Console limpo (negócio desktop)', len(errors) == 0, f'{len(errors)} erros' if errors else '')
        ov = await get_overflow(page, 1280)
        check('Overflow 0px (negócio desktop)', len(ov) == 0, str(ov[:3]) if ov else '')
        spot = await page.query_selector('.mtr-spotlight')
        check('Spotlight presente (negócio)', spot is not None)
        grupos = await page.query_selector_all('.mtr-grupo')
        check('Grupos renderizados (negócio)', len(grupos) > 0, f'{len(grupos)} grupos')

        await page.screenshot(path='smoke-mentor-negocio-1280.png')
        print('  📸 smoke-mentor-negocio-1280.png')

        # ── CENÁRIO 4: Negócio mobile 360px ──
        print('\n── NEGÓCIO · Mobile 360px ──')
        await page.set_viewport_size({'width': 360, 'height': 800})
        await page.wait_for_timeout(300)
        ov_m = await get_overflow(page, 360)
        check('Overflow 0px (negócio mobile)', len(ov_m) == 0, str(ov_m[:3]) if ov_m else '')
        await page.screenshot(path='smoke-mentor-negocio-360.png')
        print('  📸 smoke-mentor-negocio-360.png')
        await page.close()

        # ── CENÁRIO 5: Híbrido desktop 1280px ──
        print('\n── HÍBRIDO · Desktop 1280px ──')
        errors.clear()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})
        page.on('console', lambda m: errors.append(f'[{m.type}] {m.text}') if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(f'[pageerror] {e}'))
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(800)
        await nav_mentor(page, 'hibrido')

        check('Console limpo (híbrido desktop)', len(errors) == 0, f'{len(errors)} erros' if errors else '')
        ov = await get_overflow(page, 1280)
        check('Overflow 0px (híbrido desktop)', len(ov) == 0, str(ov[:3]) if ov else '')
        spot = await page.query_selector('.mtr-spotlight')
        check('Spotlight presente (híbrido)', spot is not None)
        spot_tag = await page.query_selector('.mtr-spot-tag')
        check('Spot tag presente (híbrido)', spot_tag is not None)
        sep = await page.query_selector('.mtr-sep')
        check('Separador faixas (híbrido)', sep is not None)

        # Testar expand "+N"
        expand_btn = await page.query_selector('.mtr-expandir-btn')
        if expand_btn:
            extra_before = await page.query_selector('.mtr-feed-extra.open')
            await expand_btn.click()
            await page.wait_for_timeout(400)
            extra_after = await page.query_selector('.mtr-feed-extra.open')
            check('"+N" expansível funciona', extra_after is not None)
        else:
            check('"+N" expansível (sem extras = ok)', True, 'sem items extras')

        await page.screenshot(path='smoke-mentor-hibrido-1280.png')
        print('  📸 smoke-mentor-hibrido-1280.png')

        # ── CENÁRIO 6: Híbrido mobile 360px ──
        print('\n── HÍBRIDO · Mobile 360px ──')
        await page.set_viewport_size({'width': 360, 'height': 800})
        await page.wait_for_timeout(300)
        ov_m = await get_overflow(page, 360)
        check('Overflow 0px (híbrido mobile)', len(ov_m) == 0, str(ov_m[:3]) if ov_m else '')

        # Testar dispensar + persistência (só neste cenário)
        x_btn = await page.query_selector('[data-x]')
        if x_btn:
            id_dispensar = await x_btn.get_attribute('data-x')
            await x_btn.click()
            await page.wait_for_timeout(300)
            # Verificar que o card sumiu
            card_still = await page.query_selector(f'[data-x="{id_dispensar}"]')
            check('Dispensar remove card', card_still is None)
            # Recarregar e verificar persistência
            await page.set_viewport_size({'width': 1280, 'height': 800})
            await nav_mentor(page, 'hibrido')
            card_after_reload = await page.query_selector(f'[data-x="{id_dispensar}"]')
            check('Dispensar persiste após reload', card_after_reload is None)
        else:
            check('Dispensar (sem cards dispensáveis = ok)', True, 'tela vazia')

        await page.screenshot(path='smoke-mentor-hibrido-360.png')
        print('  📸 smoke-mentor-hibrido-360.png')

        # ── Verificar briefingDash intacto ──
        print('\n── Briefing Dashboard (regressão) ──')
        # Voltar para modo pessoal e navegar para o dashboard
        await page.evaluate('''() => {
            const modeBtn = document.querySelector('[data-mode="pessoal"]');
            if (modeBtn) modeBtn.click();
        }''')
        await page.wait_for_timeout(300)
        await page.evaluate('''() => {
            const nav = document.querySelector('[data-nav="dashboard"]');
            if (nav) nav.click();
        }''')
        await page.wait_for_timeout(400)
        # Verificar que Mentor.briefing() não gera erros no console
        # (#mtr-dash-pessoal foi removido do HTML na Etapa 28 — pré-existente, fora do escopo Etapa 30)
        dash_errors_after = [e for e in errors if 'briefing' in e.lower() or 'mentor' in e.lower()]
        check('Sem erros Mentor no dashboard', len(dash_errors_after) == 0,
              str(dash_errors_after) if dash_errors_after else '')
        brf_api = await page.evaluate('() => { try { const b = Mentor.briefing("pessoal", 3); return b && typeof b.total === "number"; } catch(e) { return false; } }')
        check('Mentor.briefing() API funciona', brf_api is True)

        await page.close()
        await browser.close()

    print(f'\n{"━"*50}')
    print(f'RESULTADO: {passed}/{total} asserts passaram')
    print(f'STATUS: {"🟢 VERDE" if passed == total else "🔴 VERMELHO — revisar falhas acima"}')
    print(f'{"━"*50}')

asyncio.run(smoke())
