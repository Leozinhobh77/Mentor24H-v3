import asyncio
from playwright.async_api import async_playwright
import os

async def smoke():
    html_path = r'C:\Users\Usuário\Desktop\Curso Claude Code-Jhonatan de Souza\Mentor24h-v3\index.html'.replace('\\', '/')
    url = f'file:///{html_path}'
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})
        
        errors = []
        page.on('console', lambda msg: errors.append(f'[{msg.type}] {msg.text}') if msg.type == 'error' else None)
        page.on('pageerror', lambda err: errors.append(f'[pageerror] {err}'))
        
        await page.goto(url, wait_until='networkidle')
        await page.wait_for_timeout(1000)
        
        # Navigate to Vendas (Negocio mode - click sidebar)
        # Try to find and click Vendas nav item
        try:
            # Switch to Negocio mode first
            mode_btn = await page.query_selector('[data-mode="negocio"], #btn-negocio, .mode-btn')
            if mode_btn:
                await mode_btn.click()
                await page.wait_for_timeout(500)
        except Exception as e:
            print(f'Mode switch note: {e}')
        
        # Try to click vendas nav item
        try:
            vendas_link = await page.query_selector('[data-page="vendas"], [href="#vendas"]')
            if vendas_link:
                await vendas_link.click()
                await page.wait_for_timeout(800)
            else:
                print('Vendas link not found by data-page, trying text search')
        except Exception as e:
            print(f'Nav note: {e}')
        
        # Check for console errors
        if errors:
            print('CONSOLE ERRORS:')
            for e in errors:
                print(f'  {e}')
        else:
            print('Console: CLEAN')
        
        # Check overflow
        overflow = await page.evaluate('''() => {
            const els = document.querySelectorAll("*");
            const overflowing = [];
            const bodyW = document.body.clientWidth;
            els.forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.right > bodyW + 5 && el.tagName !== "BODY" && el.tagName !== "HTML") {
                    overflowing.push(el.tagName + (el.className ? "." + el.className.split(" ")[0] : "") + " right=" + r.right.toFixed(0));
                }
            });
            return overflowing.slice(0, 10);
        }''')
        
        if overflow:
            print('OVERFLOW:')
            for o in overflow:
                print(f'  {o}')
        else:
            print('Overflow: NONE')
        
        # Check KPI cards
        kpi_cards = await page.query_selector_all('.kpi-card')
        kpi_eye_btns = await page.query_selector_all('.kpi-eye-btn')
        print(f'KPI cards found: {len(kpi_cards)}')
        print(f'KPI eye buttons found: {len(kpi_eye_btns)}')
        
        # Take screenshot
        await page.screenshot(path='smoke-vendas-kpi.png', full_page=False)
        print('Screenshot: smoke-vendas-kpi.png saved')
        
        # Mobile test 360px
        await page.set_viewport_size({'width': 360, 'height': 800})
        await page.wait_for_timeout(300)
        overflow_mobile = await page.evaluate('''() => {
            const els = document.querySelectorAll("*");
            const overflowing = [];
            const bodyW = document.body.clientWidth;
            els.forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.right > bodyW + 5 && el.tagName !== "BODY" && el.tagName !== "HTML") {
                    overflowing.push(el.tagName + (el.className ? "." + el.className.split(" ")[0] : "") + " right=" + r.right.toFixed(0));
                }
            });
            return overflowing.slice(0, 10);
        }''')
        
        if overflow_mobile:
            print('OVERFLOW MOBILE 360px:')
            for o in overflow_mobile:
                print(f'  {o}')
        else:
            print('Overflow mobile 360px: NONE')
        
        await page.screenshot(path='smoke-vendas-mobile.png')
        print('Screenshot mobile: smoke-vendas-mobile.png saved')
        
        await browser.close()
        print('SMOKE DONE')

asyncio.run(smoke())
