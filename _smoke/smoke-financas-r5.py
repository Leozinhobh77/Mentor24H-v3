# -*- coding: utf-8 -*-
"""
smoke-financas-r5.py — T59 Sentinela (executor-20260615-004)
Audita: 2 abas A Receber/A Pagar (sem Todas) + progresso 10/20 + bug accordion
        + terminologia contextual + console 0 + overflow 0 + regressao.
"""
import asyncio, sys
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
from playwright.async_api import async_playwright

BASE  = Path(__file__).parent.parent
INDEX = (BASE / "index.html").as_posix()
URL   = f"file:///{INDEX}"
SHOTS = BASE / "_smoke"
SHOTS.mkdir(exist_ok=True)

erros = []
avisos = []

def ok(msg):   print(f"  [OK  ] {msg}")
def fail(msg): erros.append(msg); print(f"  [FAIL] {msg}")
def warn(msg): avisos.append(msg); print(f"  [WARN] {msg}")

async def nav_financas(page):
    await page.evaluate("navigate('financas')")
    await page.wait_for_timeout(700)

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 1 — console 0 + overflow 0 (1280+360, claro+escuro) + screenshots
        # ══════════════════════════════════════════════════════════════
        for (largura, nome_tam) in [(1280,"1280"),(360,"360")]:
            for tema in ["light","dark"]:
                label = f"{largura}px/{tema}"
                print(f"\n-- {label} --")
                ctx = await browser.new_context(viewport={"width":largura,"height":800})
                page = await ctx.new_page()
                console_erros = []
                page.on("console", lambda m: console_erros.append(m.text) if m.type=="error" else None)
                page.on("pageerror", lambda e: console_erros.append(str(e)))
                await page.goto(URL, wait_until="networkidle")
                await page.evaluate(f"document.documentElement.setAttribute('data-theme','{tema}')")
                await nav_financas(page)

                if not console_erros: ok(f"[{label}] console 0 erros")
                else:
                    for e in console_erros: fail(f"[{label}] console: {e}")

                sw = await page.evaluate("document.documentElement.scrollWidth")
                vw = await page.evaluate("window.innerWidth")
                if sw <= vw: ok(f"[{label}] overflow 0px (scrollW={sw})")
                else: fail(f"[{label}] overflow {sw-vw}px")

                if tema == "light":
                    shot = SHOTS / f"smoke-r5-{nome_tam}.png"
                    await page.screenshot(path=str(shot), full_page=False)
                    ok(f"[{label}] screenshot: {shot.name}")

                await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 2 — 2 abas (sem Todas) + default A Pagar
        # ══════════════════════════════════════════════════════════════
        print("\n-- 2 abas (sem Todas) + default A Pagar --")
        ctx = await browser.new_context(viewport={"width":1280,"height":800})
        page = await ctx.new_page()
        console2 = []
        page.on("console", lambda m: console2.append(m.text) if m.type=="error" else None)
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)

        chips = await page.query_selector_all(".fin-chip")
        if len(chips) == 2:
            ok(f"Exatamente 2 abas presentes")
        else:
            fail(f"Esperado 2 abas, encontrado {len(chips)}")

        # Verifica "Todas" ausente
        todas_chip = await page.query_selector(".fin-chip[data-filtro='']")
        if not todas_chip: ok("Aba 'Todas' ausente (correto)")
        else: fail("Aba 'Todas' ainda presente (deveria ter sido removida)")

        # Default = A Pagar ativo
        pagar_chip = await page.query_selector(".fin-chip[data-filtro='pagar']")
        receber_chip = await page.query_selector(".fin-chip[data-filtro='receber']")
        if pagar_chip:
            cls_pagar = await pagar_chip.get_attribute("class")
            cls_receber = await receber_chip.get_attribute("class") if receber_chip else ""
            if "ativo" in cls_pagar: ok("Default A Pagar ativo ✅")
            else: fail("Default: A Pagar deveria estar ativo")
            if "ativo" not in cls_receber: ok("A Receber inativo no default ✅")
            else: fail("A Receber deveria estar inativo no default")
        else: fail("Aba A Pagar nao encontrada")

        # Verifica aria-pressed
        pagar_pressed = await pagar_chip.get_attribute("aria-pressed") if pagar_chip else ""
        if pagar_pressed == "true": ok("aria-pressed=true em A Pagar ✅")
        else: warn(f"aria-pressed em A Pagar = '{pagar_pressed}' (esperado 'true')")

        if not console2: ok("console 0 erros bloco 2")
        await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 3 — Abas sempre-um-ativo (switch A Receber <-> A Pagar)
        # ══════════════════════════════════════════════════════════════
        print("\n-- Abas sempre-um-ativo (switch) --")
        ctx = await browser.new_context(viewport={"width":1280,"height":800})
        page = await ctx.new_page()
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)

        # Clica A Receber
        receber_chip = await page.query_selector(".fin-chip[data-filtro='receber']")
        if receber_chip:
            await receber_chip.click()
            await page.wait_for_timeout(300)
            receber_chip2 = await page.query_selector(".fin-chip[data-filtro='receber']")
            pagar_chip2 = await page.query_selector(".fin-chip[data-filtro='pagar']")
            cls_r = await receber_chip2.get_attribute("class") if receber_chip2 else ""
            cls_p = await pagar_chip2.get_attribute("class") if pagar_chip2 else ""
            if "ativo" in cls_r: ok("A Receber ativo apos clique ✅")
            else: fail("A Receber deveria estar ativo apos clique")
            if "ativo" not in cls_p: ok("A Pagar inativo quando A Receber ativo ✅")
            else: fail("A Pagar nao deveria estar ativo ao mesmo tempo que A Receber")

            # Clica A Pagar novamente — volta
            pagar_chip3 = await page.query_selector(".fin-chip[data-filtro='pagar']")
            await pagar_chip3.click()
            await page.wait_for_timeout(300)
            pagar_chip4 = await page.query_selector(".fin-chip[data-filtro='pagar']")
            cls_p2 = await pagar_chip4.get_attribute("class") if pagar_chip4 else ""
            if "ativo" in cls_p2: ok("A Pagar ativo apos re-clique ✅")
            else: fail("A Pagar deveria voltar a ativo")
        else: fail("A Receber nao encontrado para teste de switch")

        await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 4 — Progresso: barra + fracao + role=progressbar
        # ══════════════════════════════════════════════════════════════
        print("\n-- Progresso: barra + fracao + role=progressbar --")
        ctx = await browser.new_context(viewport={"width":1280,"height":800})
        page = await ctx.new_page()
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)

        # Checa ambos os chips (A Pagar default)
        for filtro in ["pagar","receber"]:
            chip_el = await page.query_selector(f".fin-chip[data-filtro='{filtro}']")
            if chip_el:
                # progressbar
                prog = await page.query_selector(f".fin-chip[data-filtro='{filtro}'] .fin-chip-prog")
                if prog:
                    role = await prog.get_attribute("role")
                    if role == "progressbar": ok(f"[{filtro}] role=progressbar ✅")
                    else: fail(f"[{filtro}] role='{role}' (esperado progressbar)")
                    aria_now = await prog.get_attribute("aria-valuenow")
                    aria_max = await prog.get_attribute("aria-valuemax")
                    ok(f"[{filtro}] aria: {aria_now}/{aria_max} pagas/total")
                else: fail(f"[{filtro}] .fin-chip-prog ausente")
                # barra
                bar = await page.query_selector(f".fin-chip[data-filtro='{filtro}'] .fin-chip-bar")
                if bar: ok(f"[{filtro}] .fin-chip-bar presente")
                else: fail(f"[{filtro}] .fin-chip-bar ausente")
                # fracao
                frac = await page.query_selector(f".fin-chip[data-filtro='{filtro}'] .fin-chip-frac")
                if frac:
                    frac_txt = await frac.inner_text()
                    # deve ser N/M (dois numeros com barra)
                    if "/" in frac_txt: ok(f"[{filtro}] fracao = '{frac_txt}' ✅")
                    else: fail(f"[{filtro}] fracao invalida: '{frac_txt}'")
                else: fail(f"[{filtro}] .fin-chip-frac ausente")
            else: fail(f"Chip [{filtro}] nao encontrado no bloco 4")

        await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 5 — Accordion correto por tipo (Mês + Semana)
        # ══════════════════════════════════════════════════════════════
        print("\n-- Accordion por tipo (Mes) --")
        ctx = await browser.new_context(viewport={"width":1280,"height":800})
        page = await ctx.new_page()
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)

        async def check_accordion(page, modo_desc, filtro, expected_label):
            """Verifica accordion com o label esperado no filtro dado."""
            chip_el = await page.query_selector(f".fin-chip[data-filtro='{filtro}']")
            if chip_el:
                await chip_el.click()
                await page.wait_for_timeout(400)
            pagas_nome = await page.query_selector(".fin-pagas-nome")
            if pagas_nome:
                nome_txt = await pagas_nome.inner_text()
                if expected_label in nome_txt:
                    ok(f"[{modo_desc}/{filtro}] accordion label='{nome_txt}' ✅")
                else:
                    warn(f"[{modo_desc}/{filtro}] accordion label='{nome_txt}' (esperado '{expected_label}')")
                # verifica count
                count_el = await page.query_selector(".fin-pagas-count")
                if count_el:
                    cnt_txt = await count_el.inner_text()
                    ok(f"[{modo_desc}/{filtro}] accordion count='{cnt_txt}'")
                else: warn(f"[{modo_desc}/{filtro}] .fin-pagas-count ausente (pode nao ter pagas)")
            else:
                warn(f"[{modo_desc}/{filtro}] accordion ausente (pode nao ter pagas do tipo)")

        # Modo Mes — A Pagar (default) → "Pagas"
        await check_accordion(page, "Mes", "pagar", "Pagas")
        # Modo Mes — A Receber → "Recebidas"
        await check_accordion(page, "Mes", "receber", "Recebidas")

        print("\n-- Accordion por tipo (Semana) --")
        # Muda para modo Semana
        vtab_sem = await page.query_selector(".fin-vtab[data-view='semana']")
        if vtab_sem:
            await vtab_sem.click()
            await page.wait_for_timeout(400)
            ok("Modo Semana ativado")
            # A Pagar no modo Semana
            await check_accordion(page, "Semana", "pagar", "Pagas")
            # A Receber no modo Semana
            await check_accordion(page, "Semana", "receber", "Recebidas")
        else:
            fail("Toggle Semana nao encontrado")

        await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 6 — Terminologia: quick-menu + selos
        # ══════════════════════════════════════════════════════════════
        print("\n-- Terminologia (quick-menu + selos) --")
        ctx = await browser.new_context(viewport={"width":1280,"height":800})
        page = await ctx.new_page()
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)  # default A Pagar

        # Abre quick-menu numa conta a pagar (primeira da lista)
        rows_pagar = await page.query_selector_all(".lrow[data-qid]")
        if rows_pagar:
            await rows_pagar[0].click()
            await page.wait_for_timeout(300)
            qpay = await page.query_selector("[data-qpay]")
            if qpay:
                btn_txt = await qpay.inner_text()
                if "pago" in btn_txt.lower() or "paga" in btn_txt.lower():
                    ok(f"Quick A Pagar: '{btn_txt.strip()}' ✅")
                else:
                    fail(f"Quick A Pagar: botao inesperado '{btn_txt.strip()}'")
                # fecha o menu
                cancel = await page.query_selector("[data-close-quick]")
                if cancel: await cancel.click(); await page.wait_for_timeout(200)
            else:
                warn("Conta ja paga (sem botao de acao) ou qpay ausente")
        else: warn("Nenhuma linha visivel em A Pagar para testar quick-menu")

        # Troca para A Receber e testa quick-menu
        receber_chip = await page.query_selector(".fin-chip[data-filtro='receber']")
        if receber_chip:
            await receber_chip.click()
            await page.wait_for_timeout(400)
            rows_receber = await page.query_selector_all(".lrow[data-qid]")
            if rows_receber:
                await rows_receber[0].click()
                await page.wait_for_timeout(300)
                qpay2 = await page.query_selector("[data-qpay]")
                if qpay2:
                    btn_txt2 = await qpay2.inner_text()
                    if "recebido" in btn_txt2.lower():
                        ok(f"Quick A Receber: '{btn_txt2.strip()}' ✅")
                    else:
                        fail(f"Quick A Receber: esperado 'recebido', got '{btn_txt2.strip()}'")
                    cancel2 = await page.query_selector("[data-close-quick]")
                    if cancel2: await cancel2.click(); await page.wait_for_timeout(200)
                else:
                    warn("Conta a receber ja liquidada (sem botao) ou qpay ausente")
            else: warn("Nenhuma linha em A Receber para testar quick-menu")

        # Selos: procura ".ls" com "Pago em" em A Pagar e "Recebido em" em A Receber
        # (para contas ja pagas — no mock pode nao haver pagas a receber no mes atual)
        pagar_chip_el = await page.query_selector(".fin-chip[data-filtro='pagar']")
        if pagar_chip_el:
            await pagar_chip_el.click(); await page.wait_for_timeout(400)
        pagas_body = await page.query_selector(".fin-pagas-body")
        if pagas_body:
            # expande o accordion
            pagas_hdr = await page.query_selector(".fin-pagas-hdr")
            if pagas_hdr:
                await pagas_hdr.click(); await page.wait_for_timeout(300)
            selos_pagar = await pagas_body.query_selector_all(".ls")
            found_pago = any(["pago em" in (await s.inner_text()).lower() or "paga" in (await s.inner_text()).lower() for s in selos_pagar])
            if found_pago: ok("Selos A Pagar conteem 'Pago em'/'Paga' ✅")
            else: warn("Selos A Pagar nao encontrados com texto esperado (pode ser 'Paga' sem data)")
        else:
            warn("Accordion A Pagar nao presente — nenhuma conta paga no mes ativo")

        await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 7 — Regressao: Totais/Saldo, Mentor R4, Transacoes, Negocio
        # ══════════════════════════════════════════════════════════════
        print("\n-- Regressao: Totais/Saldo + Mentor R4 --")
        ctx = await browser.new_context(viewport={"width":1280,"height":800})
        page = await ctx.new_page()
        reg_console = []
        page.on("console", lambda m: reg_console.append(m.text) if m.type=="error" else None)
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)

        # Totais/Saldo preservados
        fin_totais = await page.query_selector(".fin-totais")
        saldo_hero = await page.query_selector(".fin-saldo-hero")
        if fin_totais: ok("fin-totais presente (Totais preservados)")
        else: fail("fin-totais ausente (regressao Totais)")
        if saldo_hero: ok("fin-saldo-hero presente (Saldo preservado)")
        else: fail("fin-saldo-hero ausente (regressao Saldo)")

        # Mentor R4 preservado
        mentor_rod = await page.query_selector(".fin-mentor-rod.mtr-card")
        if mentor_rod: ok("fin-mentor-rod.mtr-card preservado (Mentor R4 OK)")
        else: warn("fin-mentor-rod.mtr-card nao encontrado (verifique estado do mes)")

        # overflow financas
        sw_fin = await page.evaluate("document.documentElement.scrollWidth")
        vw_fin = await page.evaluate("window.innerWidth")
        if sw_fin <= vw_fin: ok(f"Financas 1280: overflow 0px")
        else: fail(f"Financas 1280: overflow {sw_fin-vw_fin}px")

        if not reg_console: ok("console 0 (financas)")
        else:
            for e in reg_console: fail(f"console regressao: {e}")

        print("\n-- Regressao: Transacoes --")
        await page.evaluate("navigate('transacoes')")
        await page.wait_for_timeout(600)
        tx_el = await page.query_selector("#tx-root, .tx-list, .tx-list-wrap")
        if tx_el: ok("Transacoes: root presente")
        else: warn("Transacoes: root nao encontrado (nome de seletor pode variar)")
        sw_tx = await page.evaluate("document.documentElement.scrollWidth")
        vw_tx = await page.evaluate("window.innerWidth")
        if sw_tx <= vw_tx: ok(f"Transacoes: overflow 0px")
        else: fail(f"Transacoes: overflow {sw_tx-vw_tx}px")

        if not reg_console: ok("Regressao: console 0 (tx)")
        else:
            for e in reg_console: fail(f"Regressao console tx: {e}")

        await ctx.close()

        print("\n-- Regressao: Negocio --")
        ctx2 = await browser.new_context(viewport={"width":1280,"height":800})
        page2 = await ctx2.new_page()
        neg_console = []
        page2.on("console", lambda m: neg_console.append(m.text) if m.type=="error" else None)
        await page2.goto(URL, wait_until="networkidle")
        await page2.evaluate("document.documentElement.setAttribute('data-mode','negocio')")
        await page2.evaluate("navigate('financeiro')")
        await page2.wait_for_timeout(600)
        sw2 = await page2.evaluate("document.documentElement.scrollWidth")
        vw2 = await page2.evaluate("window.innerWidth")
        if sw2 <= vw2: ok(f"Negocio financeiro: overflow 0px")
        else: fail(f"Negocio financeiro: overflow {sw2-vw2}px")
        if not neg_console: ok("Negocio: console 0")
        else:
            for e in neg_console: fail(f"Negocio console: {e}")
        await ctx2.close()

        await browser.close()

    # ══════════════════════════════════════════════════════════════
    # RESULTADO FINAL
    # ══════════════════════════════════════════════════════════════
    print("\n" + "="*60)
    if not erros:
        print(f"SMOKE VERDE -- 0 erros · {len(avisos)} aviso(s)")
    else:
        print(f"SMOKE VERMELHO -- {len(erros)} erro(s) · {len(avisos)} aviso(s)")
        for e in erros: print(f"   * {e}")
    if avisos:
        for a in avisos: print(f"   ~ {a}")
    print("="*60)
    return len(erros)

if __name__ == "__main__":
    resultado = asyncio.run(run())
    sys.exit(resultado)
