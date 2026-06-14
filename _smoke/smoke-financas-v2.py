# -*- coding: utf-8 -*-
"""
smoke-financas-v2.py — T40 Sentinela
Testa a tela Financas repaginada (executor-20260614-001)
"""
import asyncio, sys, os
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
from playwright.async_api import async_playwright

BASE = Path(__file__).parent.parent
INDEX = (BASE / "index.html").as_posix()
URL = f"file:///{INDEX}"
SHOTS = BASE / "_smoke"
SHOTS.mkdir(exist_ok=True)

erros = []
aviso = []

def ok(msg):  print(f"  [OK] {msg}")
def fail(msg): erros.append(msg); print(f"  [FAIL] {msg}")
def warn(msg): aviso.append(msg); print(f"  [WARN] {msg}")

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        for (largura, nome_tam) in [(1280, "1280"), (360, "360")]:
            for tema in ["light", "dark"]:
                label = f"{largura}px/{tema}"
                print(f"\n-- {label} --")
                ctx = await browser.new_context(viewport={"width": largura, "height": 800})
                page = await ctx.new_page()
                console_erros = []
                page.on("console", lambda m: console_erros.append(m.text) if m.type == "error" else None)
                page.on("pageerror", lambda e: console_erros.append(str(e)))

                await page.goto(URL, wait_until="networkidle")

                # Definir tema
                await page.evaluate(f"document.documentElement.setAttribute('data-theme', '{tema}')")

                # Navegar para tela Financas
                await page.evaluate("navigate('financas')")
                await page.wait_for_timeout(600)

                # ── 1. Console sem erros ──────────────────────────────────
                if not console_erros:
                    ok(f"[{label}] console 0 erros")
                else:
                    for e in console_erros: fail(f"[{label}] console erro: {e}")

                # ── 2. Overflow horizontal 0px ────────────────────────────
                scroll_w = await page.evaluate("document.documentElement.scrollWidth")
                vp_w = await page.evaluate("window.innerWidth")
                if scroll_w <= vp_w:
                    ok(f"[{label}] overflow 0px (scrollW={scroll_w})")
                else:
                    fail(f"[{label}] overflow {scroll_w - vp_w}px")

                # ── 3. fin-resumo presente ────────────────────────────────
                resumo = await page.query_selector(".fin-resumo")
                if resumo: ok(f"[{label}] .fin-resumo presente")
                else: fail(f"[{label}] .fin-resumo ausente")

                # ── 4. Saldo previsto + Reserva por dia ───────────────────
                hero_val = await page.query_selector(".fin-hero-val")
                if hero_val: ok(f"[{label}] .fin-hero-val presente")
                else: fail(f"[{label}] .fin-hero-val ausente")

                reserva = await page.query_selector(".fin-reserva")
                if reserva:
                    txt = await reserva.inner_text()
                    if "tranquilo" in txt or "/dia" in txt or "Vence hoje" in txt or "Ritmo" in txt:
                        ok(f"[{label}] fin-reserva OK: {txt[:50]}")
                    else:
                        warn(f"[{label}] fin-reserva texto inesperado: {txt[:60]}")
                else:
                    fail(f"[{label}] .fin-reserva ausente")

                # ── 5. Navegação por mês presente ─────────────────────────
                nav = await page.query_selector(".fin-nav-mes")
                if nav: ok(f"[{label}] .fin-nav-mes presente")
                else: fail(f"[{label}] .fin-nav-mes ausente")

                # ── 6. Semanas de calendário na lista ─────────────────────
                await page.wait_for_timeout(300)
                grupos_html = await page.evaluate("document.getElementById('fin-grupos')?.innerHTML || ''")
                tem_semana = "Semana" in grupos_html or "VENCIDAS" in grupos_html.upper() or "fin-grupo" in grupos_html
                if tem_semana: ok(f"[{label}] grupos/semanas presentes")
                else: fail(f"[{label}] sem grupos na lista")

                # ── 7. Cards-filtro (tira 3-em-linha) ─────────────────────
                cards = await page.query_selector_all(".fin-card")
                if len(cards) == 3: ok(f"[{label}] 3 cards-filtro presentes")
                else: fail(f"[{label}] cards-filtro: esperado 3, encontrado {len(cards)}")

                # ── 8. Filtros expansíveis ────────────────────────────────
                btn_filtros = await page.query_selector(".fin-filtros-btn")
                if btn_filtros:
                    ok(f"[{label}] .fin-filtros-btn presente")
                    await btn_filtros.click()
                    await page.wait_for_timeout(300)
                    painel = await page.query_selector(".fin-filtros-panel.aberto")
                    if painel: ok(f"[{label}] painel filtros abre")
                    else: fail(f"[{label}] painel filtros nao abre")
                    await btn_filtros.click()
                    await page.wait_for_timeout(200)
                else:
                    fail(f"[{label}] .fin-filtros-btn ausente")

                # ── 9. Screenshot ──────────────────────────────────────────
                shot_path = SHOTS / f"smoke-financas-v2-{nome_tam}-{tema}.png"
                await page.screenshot(path=str(shot_path), full_page=False)
                ok(f"[{label}] screenshot salvo")

                await ctx.close()

        # ── 10. Verificar tela Negócio intacta (.fin-card l.1285) ─────────
        print("\n-- Negocio intacto --")
        ctx2 = await browser.new_context(viewport={"width": 1280, "height": 800})
        page2 = await ctx2.new_page()
        neg_console = []
        page2.on("console", lambda m: neg_console.append(m.text) if m.type == "error" else None)
        await page2.goto(URL, wait_until="networkidle")
        await page2.evaluate("document.documentElement.setAttribute('data-mode','negocio')")
        await page2.evaluate("navigate('financeiro')")
        await page2.wait_for_timeout(600)
        neg_scroll = await page2.evaluate("document.documentElement.scrollWidth")
        neg_vp = await page2.evaluate("window.innerWidth")
        if neg_scroll <= neg_vp: ok("Negocio financeiro overflow 0px")
        else: fail(f"Negocio financeiro overflow {neg_scroll-neg_vp}px")
        if not neg_console: ok("Negocio financeiro console 0 erros")
        else:
            for e in neg_console: fail(f"Negocio console: {e}")
        fin_card_neg = await page2.query_selector(".fin-lista .fin-card")
        if fin_card_neg: ok(".fin-card do negocio presente e integro")
        else: warn(".fin-lista .fin-card nao encontrado (pode ser lista vazia ou rota diferente)")
        await ctx2.close()

        await browser.close()

    # ── Resultado final ────────────────────────────────────────────────────
    print("\n" + "="*55)
    if not erros:
        print(f"SMOKE VERDE -- 0 erros · {len(aviso)} aviso(s)")
    else:
        print(f"SMOKE VERMELHO -- {len(erros)} erro(s) · {len(aviso)} aviso(s)")
        for e in erros: print(f"   * {e}")
    print("="*55)
    return len(erros)

if __name__ == "__main__":
    resultado = asyncio.run(run())
    sys.exit(resultado)
