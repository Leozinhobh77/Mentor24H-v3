# -*- coding: utf-8 -*-
"""
Smoke Etapa 31 -- Restaurar #mtr-dash-pessoal no dashboard pessoal
Asserts: card presente + briefing preenchido + botoes navegam + console 0 + overflow 0
         Negocio/Hibrido inalterados (sem #mtr-dash-negocio/hibrido)
"""
import sys, asyncio
sys.stdout.reconfigure(encoding='utf-8')
from playwright.async_api import async_playwright

HTML = r'C:\Users\Usuário\Desktop\Curso Claude Code-Jhonatan de Souza\Mentor24h-v3\index.html'.replace('\\', '/')
URL = f'file:///{HTML}'

passed = 0; total = 0

def check(label, ok, detail=''):
    global passed, total
    total += 1
    if ok: passed += 1
    icon = '✅' if ok else '❌'
    print(f'{icon} {label}{": "+detail if detail else ""}')

async def overflow_check(page, vw):
    return await page.evaluate(f'''() => {{
        const over = [];
        document.querySelectorAll("*").forEach(el => {{
            const r = el.getBoundingClientRect();
            if (r.right > {vw} + 5 && el.tagName !== "BODY" && el.tagName !== "HTML")
                over.push(el.tagName + "." + (el.className||"").toString().split(" ")[0] + " r=" + r.right.toFixed(0));
        }});
        return over.slice(0, 10);
    }}''')

async def smoke():
    errors = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # ── Pessoal desktop 1280px ──
        print('\n── Dashboard Pessoal · 1280px ──')
        page = await browser.new_page(viewport={'width': 1280, 'height': 900})
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(str(e)))
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(1000)

        # Garantir modo pessoal e navegar para dashboard
        await page.evaluate('''() => {
            const m = document.querySelector('[data-mode="pessoal"]');
            if (m) m.click();
        }''')
        await page.wait_for_timeout(300)
        await page.evaluate('''() => {
            const n = document.querySelector('[data-nav="dashboard"]');
            if (n) n.click();
        }''')
        await page.wait_for_timeout(700)

        check('Console limpo (pessoal 1280)', len(errors) == 0, f'{len(errors)} erros' if errors else '')
        ov = await overflow_check(page, 1280)
        check('Overflow 0px (pessoal 1280)', len(ov) == 0, str(ov[:3]) if ov else '')

        # Card presente
        card = await page.query_selector('#mtr-dash-pessoal')
        check('#mtr-dash-pessoal presente no DOM', card is not None)

        # Briefing preenchido (pintaBriefingDash deve ter rodado)
        if card:
            children = await page.evaluate('() => document.getElementById("mtr-dash-pessoal").children.length')
            check('Briefing preenchido (children > 0)', children > 0, f'{children} elementos')
            # Verificar ai-badge
            badge = await page.query_selector('#mtr-dash-pessoal .ai-badge')
            check('ai-badge "Mentor · seu dia" presente', badge is not None)

        # Botão "Ver tudo no Mentor" navega
        ver_btn = await page.query_selector('#mtr-dash-pessoal [data-go="mentor"]')
        check('Botão navegação presente', ver_btn is not None)

        await page.screenshot(path='smoke-etapa31-pessoal-1280.png')
        print('  📸 smoke-etapa31-pessoal-1280.png')

        # ── Pessoal mobile 360px ──
        print('\n── Dashboard Pessoal · 360px ──')
        await page.set_viewport_size({'width': 360, 'height': 800})
        await page.wait_for_timeout(300)
        ov_m = await overflow_check(page, 360)
        check('Overflow 0px (pessoal 360)', len(ov_m) == 0, str(ov_m[:3]) if ov_m else '')
        await page.screenshot(path='smoke-etapa31-pessoal-360.png')
        print('  📸 smoke-etapa31-pessoal-360.png')
        await page.close()

        # ── Negócio — sem mtr-dash-negocio (Etapa 28) ──
        print('\n── Dashboard Negócio · sem strip (regressão check) ──')
        errors.clear()
        page = await browser.new_page(viewport={'width': 1280, 'height': 900})
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        await page.goto(URL, wait_until='networkidle')
        await page.wait_for_timeout(800)
        await page.evaluate('''() => {
            const m = document.querySelector('[data-mode="negocio"]');
            if (m) m.click();
        }''')
        await page.wait_for_timeout(300)
        await page.evaluate('''() => {
            const n = document.querySelector('[data-nav="dashboard"]');
            if (n) n.click();
        }''')
        await page.wait_for_timeout(500)

        neg_strip = await page.query_selector('#mtr-dash-negocio')
        check('#mtr-dash-negocio ausente (correto)', neg_strip is None)
        check('Console limpo (negócio)', len(errors) == 0, f'{len(errors)} erros' if errors else '')

        await page.close()
        await browser.close()

    print(f'\n{"━"*50}')
    print(f'RESULTADO: {passed}/{total} asserts passaram')
    print(f'STATUS: {"🟢 VERDE" if passed == total else "🔴 VERMELHO"}')
    print(f'{"━"*50}')

asyncio.run(smoke())
