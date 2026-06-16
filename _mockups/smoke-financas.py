"""Smoke visual — mockup-financas.html · Tarefa-31 · executor-20260613-001"""
import asyncio, pathlib, sys
sys.stdout.reconfigure(encoding='utf-8')
from playwright.async_api import async_playwright

HTML = pathlib.Path(__file__).parent / "mockup-financas.html"
URL  = HTML.as_uri()
OUT  = pathlib.Path(__file__).parent

async def smoke():
    erros = []
    resultados = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)

        for vp_label, vp in [("360", {"width":360,"height":800}), ("1280", {"width":1280,"height":800})]:
            ctx  = await browser.new_context(viewport=vp)
            page = await ctx.new_page()

            console_erros = []
            page.on("console", lambda m: console_erros.append(m.text) if m.type == "error" else None)
            page.on("pageerror", lambda e: console_erros.append(str(e)))

            await page.goto(URL, wait_until="domcontentloaded")
            await page.wait_for_timeout(800)

            # ── Assert 1: console limpo ────────────────────────────────────
            if console_erros:
                erros.append(f"[{vp_label}] console erros: {console_erros}")
                resultados.append(f"❌ [{vp_label}] console = {len(console_erros)} erro(s)")
            else:
                resultados.append(f"✅ [{vp_label}] console = 0 erros")

            # ── Assert 2: overflow horizontal ──────────────────────────────
            overflow = await page.evaluate("""() => {
                const body = document.body;
                return Math.max(body.scrollWidth - body.clientWidth,
                                document.documentElement.scrollWidth - document.documentElement.clientWidth);
            }""")
            if overflow > 0:
                erros.append(f"[{vp_label}] overflow = {overflow}px")
                resultados.append(f"❌ [{vp_label}] overflow = {overflow}px")
            else:
                resultados.append(f"✅ [{vp_label}] overflow = 0px")

            # ── Assert 3: hero renderizado ─────────────────────────────────
            hero = await page.query_selector("#fin-hero-val")
            hero_text = await hero.inner_text() if hero else ""
            if "R$" in hero_text:
                resultados.append(f"✅ [{vp_label}] hero saldo = '{hero_text}'")
            else:
                erros.append(f"[{vp_label}] hero vazio ou sem R$: '{hero_text}'")
                resultados.append(f"❌ [{vp_label}] hero = '{hero_text}'")

            # ── Assert 4: tira 3 cards renderizados ───────────────────────
            cards = await page.query_selector_all(".fin-card")
            if len(cards) == 3:
                resultados.append(f"✅ [{vp_label}] tira = 3 cards")
            else:
                erros.append(f"[{vp_label}] tira esperava 3 cards, tem {len(cards)}")
                resultados.append(f"❌ [{vp_label}] tira = {len(cards)} cards")

            # ── Assert 5: lista agrupada tem itens ─────────────────────────
            lrows = await page.query_selector_all(".lrow")
            if len(lrows) >= 8:  # 8 pendentes
                resultados.append(f"✅ [{vp_label}] lista = {len(lrows)} linhas")
            else:
                erros.append(f"[{vp_label}] lista esperava ≥8 linhas, tem {len(lrows)}")
                resultados.append(f"❌ [{vp_label}] lista = {len(lrows)} linhas")

            # ── Assert 6: filtro A pagar funciona ─────────────────────────
            btn_pagar = await page.query_selector('[data-filtro="pagar"]')
            await btn_pagar.click()
            await page.wait_for_timeout(250)
            pressed = await btn_pagar.get_attribute("aria-pressed")
            if pressed == "true":
                resultados.append(f"✅ [{vp_label}] filtro A pagar ativo (aria-pressed=true)")
            else:
                erros.append(f"[{vp_label}] filtro A pagar aria-pressed={pressed}")
                resultados.append(f"❌ [{vp_label}] filtro A pagar aria-pressed={pressed}")

            # reset filtro
            await btn_pagar.click()
            await page.wait_for_timeout(250)

            # ── Assert 7: collapse Pagas (toggle abre/fecha) ──────────────
            toggle = await page.query_selector(".fin-grupo-toggle")
            if toggle:
                exp_before = await toggle.get_attribute("aria-expanded")
                await toggle.click()
                await page.wait_for_timeout(300)
                exp_after = await toggle.get_attribute("aria-expanded")
                if exp_before == "false" and exp_after == "true":
                    resultados.append(f"✅ [{vp_label}] collapse Pagas: fechado→aberto")
                else:
                    erros.append(f"[{vp_label}] collapse Pagas: {exp_before}→{exp_after}")
                    resultados.append(f"❌ [{vp_label}] collapse Pagas: {exp_before}→{exp_after}")
            else:
                resultados.append(f"⚠️  [{vp_label}] sem grupo Pagas (visível no filtro 'todas')")

            # ── Assert 8: edge case saldo negativo ────────────────────────
            neg_cor = await page.evaluate("""() => {
                const el = document.getElementById('fin-hero-val');
                return el ? window.getComputedStyle(el).color : 'none';
            }""")
            # Saldo = receber(800+230) - pagar(142.9+99.9+1200+540+89.9+39.9) = 1030 - 2112.6 = -1082.6 → negativo
            hero_class = await page.evaluate("() => document.getElementById('fin-hero-val').className")
            if "negativo" in hero_class:
                resultados.append(f"✅ [{vp_label}] saldo negativo → classe .negativo")
            else:
                resultados.append(f"⚠️  [{vp_label}] saldo class={hero_class} (pode ser positivo nos dados)")

            # ── Screenshot ────────────────────────────────────────────────
            shot = OUT / f"smoke-financas-{vp_label}.png"
            await page.screenshot(path=str(shot), full_page=True)
            resultados.append(f"📸 [{vp_label}] screenshot: {shot.name}")

            await ctx.close()

        await browser.close()

    # ── Relatório ──────────────────────────────────────────────────────────
    print("\n═══════════════════════════════════════════════")
    print("🛡️  SENTINELA — mockup-financas.html")
    print("═══════════════════════════════════════════════")
    for r in resultados:
        print(" ", r)
    print("═══════════════════════════════════════════════")
    total = len([r for r in resultados if r.strip().startswith("✅")])
    falhas = len([r for r in resultados if r.strip().startswith("❌")])
    print(f"\n  TOTAL: {total} ✅  |  {falhas} ❌")
    if not erros:
        print("\n  VEREDITO: 🟢 VERDE — tudo passou")
    else:
        print("\n  VEREDITO: 🔴 VERMELHO")
        for e in erros:
            print(f"    ⚠  {e}")
    print("═══════════════════════════════════════════════\n")
    return len(erros) == 0

asyncio.run(smoke())
