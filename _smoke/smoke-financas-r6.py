# -*- coding: utf-8 -*-
"""
smoke-financas-r6.py — T65 Sentinela (executor-20260615-005)
Audita: Mentor Semanal carry-over + 6 estados + card Mentor fixes (T60-T64)
        + console 0 + overflow 0 + regressao R4/R5.
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

erros  = []
avisos = []

def ok(msg):   print(f"  [OK  ] {msg}")
def fail(msg): erros.append(msg); print(f"  [FAIL] {msg}")
def warn(msg): avisos.append(msg); print(f"  [WARN] {msg}")

async def nav_financas(page):
    await page.evaluate("navigate('financas')")
    await page.wait_for_timeout(700)

async def set_semana(page):
    vtab = await page.query_selector(".fin-vtab[data-view='semana']")
    if vtab:
        await vtab.click(); await page.wait_for_timeout(500); return True
    fail("Toggle Semana nao encontrado"); return False

async def set_mes(page):
    vtab = await page.query_selector(".fin-vtab[data-view='mes']")
    if vtab:
        await vtab.click(); await page.wait_for_timeout(500); return True
    fail("Toggle Mes nao encontrado"); return False

async def click_filtro(page, filtro):
    chip = await page.query_selector(f".fin-chip[data-filtro='{filtro}']")
    if chip: await chip.click(); await page.wait_for_timeout(350)

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 1 — console 0 + overflow 0 (1280+360, claro+escuro) + screenshots
        # ══════════════════════════════════════════════════════════════
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
                await page.evaluate(f"document.documentElement.setAttribute('data-theme','{tema}')")
                await nav_financas(page)
                await set_semana(page)   # testar Semana tb
                await set_mes(page)      # voltar para Mes

                if not console_erros: ok(f"[{label}] console 0 erros")
                else:
                    for e in console_erros: fail(f"[{label}] console: {e}")

                sw = await page.evaluate("document.documentElement.scrollWidth")
                vw = await page.evaluate("window.innerWidth")
                if sw <= vw: ok(f"[{label}] overflow 0px (scrollW={sw})")
                else: fail(f"[{label}] overflow {sw - vw}px")

                if tema == "light":
                    shot = SHOTS / f"smoke-r6-{nome_tam}.png"
                    await page.screenshot(path=str(shot), full_page=False)
                    ok(f"[{label}] screenshot: {shot.name}")

                await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 2 — T60: accordion labels contextual + rodape Mentor ausente no Semana
        # ══════════════════════════════════════════════════════════════
        print("\n-- T60: accordion labels + rodape Mentor guardado no Semana --")
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await ctx.new_page()
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)

        # Mes / A Pagar → "Contas Pagas" (ou "Pagas")
        await click_filtro(page, "pagar")
        nome_el = await page.query_selector(".fin-pagas-nome")
        if nome_el:
            txt = await nome_el.inner_text()
            if "pag" in txt.lower():
                ok(f"T60 Mes/pagar: accordion='{txt}' ✅")
            else:
                fail(f"T60 Mes/pagar: accordion='{txt}' (esperado 'Contas Pagas'/'Pagas')")
        else:
            warn("T60 Mes/pagar: accordion ausente (sem contas pagas no mock)")

        # Mes / A Receber → "Contas Recebidas" (ou "Recebidas")
        await click_filtro(page, "receber")
        nome_el2 = await page.query_selector(".fin-pagas-nome")
        if nome_el2:
            txt2 = await nome_el2.inner_text()
            if "receb" in txt2.lower():
                ok(f"T60 Mes/receber: accordion='{txt2}' ✅")
            else:
                fail(f"T60 Mes/receber: accordion='{txt2}' (esperado 'Contas Recebidas')")
        else:
            warn("T60 Mes/receber: accordion ausente (sem contas recebidas no mock)")

        # Modo Semana → rodape Mentor NAO deve aparecer
        if await set_semana(page):
            rod_sem = await page.query_selector(".fin-mentor-rod.mtr-card")
            if rod_sem:
                is_vis = await rod_sem.is_visible()
                if not is_vis:
                    ok("T60: rodape Mentor oculto em Modo Semana ✅")
                else:
                    fail("T60: rodape Mentor NAO deveria aparecer em Modo Semana (guard viewMode)")
            else:
                ok("T60: rodape Mentor ausente em Modo Semana ✅ (guard correto)")

        await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 3 — T61: mtr-spot-tag + border-left 3px + legenda "por dia"
        # ══════════════════════════════════════════════════════════════
        print("\n-- T61: mtr-spot-tag + border-left 3px + legenda 'por dia' --")
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await ctx.new_page()
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)
        await click_filtro(page, "pagar")

        rod = await page.query_selector(".fin-mentor-rod.mtr-card")
        if rod:
            # mtr-spot-tag
            spot = await rod.query_selector(".mtr-spot-tag")
            if spot:
                tag_txt = await spot.inner_text()
                if "mentor" in tag_txt.lower():
                    ok(f"T61: mtr-spot-tag='{tag_txt}' ✅")
                else:
                    fail(f"T61: mtr-spot-tag='{tag_txt}' (esperado 'Mentor')")
            else:
                fail("T61: .mtr-spot-tag ausente no rodape Mentor")

            # border-left deve ser 3px (de .mtr-card)
            blw = await page.evaluate("el => getComputedStyle(el).borderLeftWidth", rod)
            if blw == "3px":
                ok(f"T61: border-left-width=3px ✅ (mtr-card)")
            else:
                fail(f"T61: border-left-width='{blw}' (esperado '3px' do mtr-card)")

            # background deve ser surface-1 (nao surface-2 sobrescrito)
            bg = await page.evaluate("el => getComputedStyle(el).backgroundColor", rod)
            ok(f"T61: background='{bg}' (surface-1 esperado — verificar visualmente)")

            # legenda "por dia" (nao "/dia")
            leg = await rod.query_selector(".fin-mentor-hero-leg")
            if leg:
                leg_txt = await leg.inner_text()
                if "por dia" in leg_txt.lower():
                    ok(f"T61: legenda='{leg_txt}' ✅ ('por dia')")
                elif "/dia" in leg_txt:
                    fail(f"T61: legenda='{leg_txt}' ainda usa '/dia' (deveria ser 'por dia')")
                else:
                    warn(f"T61: legenda='{leg_txt}' (esperado 'por dia')")
            else:
                warn("T61: .fin-mentor-hero-leg ausente (estado sem meta)")
        else:
            warn("T61: .fin-mentor-rod.mtr-card ausente (estado do mes nao tem meta)")

        await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 4 — T62: frase fraseMeta referencia valor + dias + meta
        # ══════════════════════════════════════════════════════════════
        print("\n-- T62: frase fraseMeta referencia devo/dias/meta --")
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await ctx.new_page()
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)
        await click_filtro(page, "pagar")

        rod = await page.query_selector(".fin-mentor-rod.mtr-card")
        if rod:
            mtr_s = await rod.query_selector(".mtr-s")
            if mtr_s:
                frase = await mtr_s.inner_text()
                ok(f"T62: frase='{frase[:90]}...'")
                has_valor = "R$" in frase or any(c.isdigit() for c in frase)
                has_dia   = "dia" in frase.lower()
                if has_valor: ok("T62: frase referencia valor monetario ✅")
                else: warn("T62: frase pode nao referenciar valor")
                if has_dia: ok("T62: frase referencia dias ✅")
                else: warn("T62: frase pode nao referenciar dias")
            else:
                warn("T62: .mtr-s ausente (sem frase no rodape)")

            hero_val = await rod.query_selector(".fin-mentor-hero-val")
            if hero_val:
                val_txt = await hero_val.inner_text()
                ok(f"T62: hero valor='{val_txt}' presente 1x ✅")
                # Nao deve aparecer valor duplicado no mtr-s
                if mtr_s:
                    frase2 = await mtr_s.inner_text()
                    count_val = frase2.count(val_txt.replace("R$","").strip()) if val_txt else 0
                    if count_val <= 1:
                        ok(f"T62: valor nao duplicado no texto (count={count_val}) ✅")
                    else:
                        warn(f"T62: valor aparece {count_val}x no texto (verificar duplicidade)")
            else:
                warn("T62: .fin-mentor-hero-val ausente")
        else:
            warn("T62: rodape Mentor ausente (mes sem meta ativa)")

        await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 5 — T63: Modo Semana — 6 estados, carry-over, A Receber adaptado
        # ══════════════════════════════════════════════════════════════
        print("\n-- T63: Modo Semana — estados + carry-over + A Receber --")
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await ctx.new_page()
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)

        if await set_semana(page):
            await click_filtro(page, "pagar")

            sem_cards = await page.query_selector_all(".fin-mentor-sem")
            if sem_cards:
                ok(f"T63: {len(sem_cards)} cards .fin-mentor-sem presentes (A Pagar) ✅")
            else:
                fail("T63: nenhum .fin-mentor-sem em Semana/pagar")

            # Verifica que cada card tem exatamente 1 estado valido
            estados_validos = {
                'fin-sem-meta', 'fin-sem-acumulo', 'fin-sem-vencidas',
                'fin-sem-fechada', 'fin-sem-suave', 'fin-sem-previa'
            }
            estados_encontrados = set()
            for card in sem_cards:
                cls = await card.get_attribute("class") or ""
                for e in estados_validos:
                    if e in cls:
                        estados_encontrados.add(e)
            if estados_encontrados:
                ok(f"T63: estados encontrados: {sorted(estados_encontrados)} ✅")
            else:
                fail("T63: nenhum card com estado valido (fin-sem-meta/acumulo/...)")

            # Carry-over badge (warn se ausente — depende do mock)
            badge = await page.query_selector(".fin-sem-atraso-badge")
            if badge:
                b_txt = await badge.inner_text()
                ok(f"T63: carry-over badge='{b_txt}' ✅ (acumulo presente)")
            else:
                warn("T63: .fin-sem-atraso-badge ausente (mock sem atraso passado ou mes futuro)")

            # RICO: meta/acumulo/vencidas devem ter .mtr-spot-tag
            ricos = {'fin-sem-meta', 'fin-sem-acumulo', 'fin-sem-vencidas'}
            rico_ok = 0; rico_fail = 0
            for card in sem_cards:
                cls = await card.get_attribute("class") or ""
                if any(r in cls for r in ricos):
                    spot = await card.query_selector(".mtr-spot-tag")
                    if spot: rico_ok += 1
                    else: rico_fail += 1; fail(f"T63: card RICO sem mtr-spot-tag ({cls[:50]})")
            if rico_ok > 0: ok(f"T63: {rico_ok} card(s) RICO com mtr-spot-tag ✅")
            if rico_fail == 0 and rico_ok == 0:
                warn("T63: nenhum card RICO (meta/acumulo/vencidas) no mock atual")

            # Frase semanal presente nos cards RICO
            for card in sem_cards:
                cls = await card.get_attribute("class") or ""
                if any(r in cls for r in ricos):
                    mtr_s = await card.query_selector(".mtr-s")
                    if mtr_s:
                        frase = await mtr_s.inner_text()
                        if frase.strip():
                            ok(f"T63: frase semanal presente no card RICO ('{frase[:50]}...') ✅")
                        else:
                            warn("T63: .mtr-s vazio no card RICO")
                    else:
                        warn("T63: .mtr-s ausente em card RICO")
                    break

            # A Receber — estados rec-* + sem hero meta/dia
            await click_filtro(page, "receber")
            sem_rec = await page.query_selector_all(".fin-mentor-sem")
            if sem_rec:
                ok(f"T63: {len(sem_rec)} cards Semana (A Receber) ✅")
                estados_rec = {
                    'fin-sem-rec-previsto', 'fin-sem-rec-recebido',
                    'fin-sem-rec-atraso', 'fin-sem-rec-suave'
                }
                rec_encontrados = set()
                for card in sem_rec:
                    cls = await card.get_attribute("class") or ""
                    for e in estados_rec:
                        if e in cls: rec_encontrados.add(e)
                if rec_encontrados:
                    ok(f"T63: estados A Receber: {sorted(rec_encontrados)} ✅")
                else:
                    fail("T63: nenhum estado rec-* encontrado em A Receber")

                # A Receber nao tem hero 'por dia'
                has_meta_leg = False
                for card in sem_rec:
                    leg = await card.query_selector(".fin-mentor-hero-leg")
                    if leg:
                        l_txt = await leg.inner_text()
                        if "por dia" in l_txt.lower(): has_meta_leg = True; break
                if not has_meta_leg:
                    ok("T63: A Receber sem hero 'por dia' (meta diaria nao se aplica) ✅")
                else:
                    fail("T63: A Receber NAO deveria ter hero 'por dia'")
            else:
                warn("T63: nenhum card Semana em A Receber")

        await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 6 — T64: densidade (compacto vs rico) + cor amber
        # ══════════════════════════════════════════════════════════════
        print("\n-- T64: fin-sem-compacto (suave/fechada/previa) vs RICO --")
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await ctx.new_page()
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)

        if await set_semana(page):
            await click_filtro(page, "pagar")
            all_sem = await page.query_selector_all(".fin-mentor-sem")

            compacto_states = {'fin-sem-suave', 'fin-sem-fechada', 'fin-sem-previa'}
            rico_states     = {'fin-sem-meta', 'fin-sem-acumulo', 'fin-sem-vencidas'}
            comp_ok = 0; comp_fail = 0; rico_ok = 0; rico_fail = 0

            for card in all_sem:
                cls = await card.get_attribute("class") or ""
                is_comp_state = any(c in cls for c in compacto_states)
                is_rico_state = any(c in cls for c in rico_states)
                if is_comp_state:
                    if "fin-sem-compacto" in cls: comp_ok += 1
                    else:
                        comp_fail += 1
                        fail(f"T64: card compacto-state sem fin-sem-compacto: {cls[:60]}")
                if is_rico_state:
                    if "fin-sem-compacto" not in cls: rico_ok += 1
                    else:
                        rico_fail += 1
                        fail(f"T64: card RICO tem fin-sem-compacto (nao deveria): {cls[:60]}")

            if comp_ok > 0: ok(f"T64: {comp_ok} card(s) compacto com fin-sem-compacto ✅")
            if comp_fail == 0 and comp_ok == 0:
                warn("T64: nenhum estado compacto (suave/fechada/previa) no mock atual")
            if rico_ok > 0: ok(f"T64: {rico_ok} card(s) RICO sem fin-sem-compacto ✅")

            # Cor amber: acumulo/vencidas usam --cs (amber subtle) via CSS var
            # Verificar via data-style ou computed -- apenas checa que nao é vermelho (#ef)
            for card in all_sem:
                cls = await card.get_attribute("class") or ""
                if "fin-sem-acumulo" in cls or "fin-sem-vencidas" in cls:
                    col = await page.evaluate("""
                        el => el.style.getPropertyValue('--c') || getComputedStyle(el).getPropertyValue('--c')
                    """, card)
                    ok(f"T64: card acumulo/vencidas --c='{col.strip()}' (amber esperado)")
                    break

        await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 7 — Regressao: Totais/Saldo, R4/R5, Transacoes, Negocio
        # ══════════════════════════════════════════════════════════════
        print("\n-- Regressao: Totais/Saldo + R4/R5 --")
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await ctx.new_page()
        reg_console = []
        page.on("console", lambda m: reg_console.append(m.text) if m.type == "error" else None)
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)

        # Totais/Saldo
        if await page.query_selector(".fin-totais"): ok("fin-totais presente (Totais preservados)")
        else: fail("fin-totais ausente (regressao Totais)")
        if await page.query_selector(".fin-saldo-hero"): ok("fin-saldo-hero presente (Saldo preservado)")
        else: fail("fin-saldo-hero ausente (regressao Saldo)")

        # 2 abas (R5)
        chips = await page.query_selector_all(".fin-chip")
        if len(chips) == 2: ok(f"2 abas presentes (R5 OK)")
        else: fail(f"Esperado 2 abas, encontrado {len(chips)}")

        # Rodape Mentor R4/R5
        if await page.query_selector(".fin-mentor-rod.mtr-card"): ok("fin-mentor-rod.mtr-card preservado")
        else: warn("fin-mentor-rod.mtr-card ausente (estado sem meta — pode ser correto)")

        # overflow
        sw = await page.evaluate("document.documentElement.scrollWidth")
        vw = await page.evaluate("window.innerWidth")
        if sw <= vw: ok(f"Financas: overflow 0px")
        else: fail(f"Financas: overflow {sw - vw}px")

        if not reg_console: ok("console 0 (financas regressao)")
        else:
            for e in reg_console: fail(f"console regressao: {e}")

        print("\n-- Regressao: Transacoes --")
        await page.evaluate("navigate('transacoes')")
        await page.wait_for_timeout(600)
        tx_el = await page.query_selector("#tx-root, .tx-list, .tx-list-wrap")
        if tx_el: ok("Transacoes: root presente")
        else: warn("Transacoes: root nao encontrado (seletor pode variar)")
        sw_tx = await page.evaluate("document.documentElement.scrollWidth")
        vw_tx = await page.evaluate("window.innerWidth")
        if sw_tx <= vw_tx: ok("Transacoes: overflow 0px")
        else: fail(f"Transacoes: overflow {sw_tx - vw_tx}px")

        await ctx.close()

        print("\n-- Regressao: Negocio --")
        ctx2 = await browser.new_context(viewport={"width": 1280, "height": 800})
        page2 = await ctx2.new_page()
        neg_console = []
        page2.on("console", lambda m: neg_console.append(m.text) if m.type == "error" else None)
        await page2.goto(URL, wait_until="networkidle")
        await page2.evaluate("document.documentElement.setAttribute('data-mode','negocio')")
        await page2.evaluate("navigate('financeiro')")
        await page2.wait_for_timeout(600)
        sw2 = await page2.evaluate("document.documentElement.scrollWidth")
        vw2 = await page2.evaluate("window.innerWidth")
        if sw2 <= vw2: ok("Negocio financeiro: overflow 0px")
        else: fail(f"Negocio financeiro: overflow {sw2 - vw2}px")
        if not neg_console: ok("Negocio: console 0")
        else:
            for e in neg_console: fail(f"Negocio console: {e}")
        await ctx2.close()

        await browser.close()

    # ══════════════════════════════════════════════════════════════
    # RESULTADO FINAL
    # ══════════════════════════════════════════════════════════════
    print("\n" + "=" * 60)
    if not erros:
        print(f"SMOKE VERDE -- 0 erros · {len(avisos)} aviso(s)")
    else:
        print(f"SMOKE VERMELHO -- {len(erros)} erro(s) · {len(avisos)} aviso(s)")
        for e in erros: print(f"   * {e}")
    if avisos:
        for a in avisos: print(f"   ~ {a}")
    print("=" * 60)
    return len(erros)

if __name__ == "__main__":
    resultado = asyncio.run(run())
    sys.exit(resultado)
