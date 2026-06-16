# -*- coding: utf-8 -*-
"""
smoke-financas-r4.py — T56 Sentinela (executor-20260615-003)
Audita: anatomia mtr-card no card Mentor, valor /dia 1x so, 3 personas,
        Mentor semana, estados passado/futuro, overflow 0, regressao.
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
        # BLOCO 1 — console 0 + overflow 0 (1280+360, claro+escuro)
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

                # console
                if not console_erros: ok(f"[{label}] console 0 erros")
                else:
                    for e in console_erros: fail(f"[{label}] console: {e}")

                # overflow
                sw = await page.evaluate("document.documentElement.scrollWidth")
                vw = await page.evaluate("window.innerWidth")
                if sw <= vw: ok(f"[{label}] overflow 0px (scrollW={sw})")
                else: fail(f"[{label}] overflow {sw-vw}px")

                # screenshots no 1280/360 (1 por tamanho, tema claro)
                if tema == "light":
                    shot = SHOTS / f"smoke-r4-{nome_tam}.png"
                    await page.screenshot(path=str(shot), full_page=False)
                    ok(f"[{label}] screenshot: {shot.name}")

                await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 2 — anatomia .mtr-card no rodapé Mentor (estado meta)
        # ══════════════════════════════════════════════════════════════
        print("\n-- Anatomia .mtr-card (rodape estado meta) --")
        ctx = await browser.new_context(viewport={"width":1280,"height":800})
        page = await ctx.new_page()
        console2 = []
        page.on("console", lambda m: console2.append(m.text) if m.type=="error" else None)
        await page.goto(URL, wait_until="networkidle")
        await nav_financas(page)

        rod = await page.query_selector(".fin-mentor-rod.mtr-card")
        if rod: ok(".fin-mentor-rod.mtr-card presente")
        else: fail(".fin-mentor-rod.mtr-card ausente (estado meta nao visivel ou classe faltando)")

        mtr_ico = await page.query_selector(".fin-mentor-rod .mtr-ico")
        if mtr_ico: ok(".fin-mentor-rod .mtr-ico presente")
        else: fail(".fin-mentor-rod .mtr-ico ausente")

        mtr_t = await page.query_selector(".fin-mentor-rod .mtr-t")
        if mtr_t:
            t_txt = await mtr_t.inner_text()
            if "Meta diária" in t_txt or "Meta" in t_txt:
                ok(f".mtr-t = '{t_txt}'")
            else:
                warn(f".mtr-t inesperado: '{t_txt}'")
        else: fail(".fin-mentor-rod .mtr-t ausente")

        mtr_s = await page.query_selector(".fin-mentor-rod .mtr-s")
        if mtr_s:
            s_txt = await mtr_s.inner_text()
            # A FRASE NAO pode conter "/dia" (o hero e o unico lugar com /dia)
            if "/dia" in s_txt.lower():
                fail(f"DUPLICACAO: .mtr-s contem '/dia': '{s_txt[:80]}'")
            else:
                ok(f".mtr-s sem '/dia' (OK): '{s_txt[:60]}'")
        else: fail(".fin-mentor-rod .mtr-s ausente")

        # hero unico
        hero_val = await page.query_selector(".fin-mentor-rod .fin-mentor-hero-val")
        hero_leg = await page.query_selector(".fin-mentor-rod .fin-mentor-hero-leg")
        if hero_val and hero_leg:
            h_txt = await hero_val.inner_text()
            l_txt = await hero_leg.inner_text()
            ok(f"Hero unico: '{h_txt}' + legenda '{l_txt}'")
        else: fail(f"Hero ausente: val={bool(hero_val)} leg={bool(hero_leg)}")

        # verificar que ha APENAS 1 elemento com /dia visivel
        dia_count = await page.evaluate("""
            [...document.querySelectorAll('#contas-root .fin-mentor-rod *')]
                .filter(el => el.children.length === 0 && el.innerText && el.innerText.includes('/dia'))
                .length
        """)
        if dia_count == 1: ok(f"'/dia' aparece 1x so no card (dia_count={dia_count})")
        elif dia_count == 0: warn("'/dia' nao encontrado no card — hero ausente?")
        else: fail(f"'/dia' aparece {dia_count}x no card (duplicacao!)")

        if not console2: ok("console 0 erros no bloco anatomia")

        # ══════════════════════════════════════════════════════════════
        # BLOCO 3 — 3 personas: frase muda, sem /dia na frase
        # ══════════════════════════════════════════════════════════════
        print("\n-- 3 personas (frase muda, sem /dia na frase) --")
        frases_vistas = set()
        for ton in ["serio","descontraido","motivador"]:
            # mudar o tom via JS e re-renderizar
            await page.evaluate(f"""
                if(typeof Mentor !== 'undefined') {{
                    // forcar tom diretamente no localStorage ou variavel interna
                    try {{ localStorage.setItem('mtr-tom','{ton}'); }} catch(e) {{}}
                    document.querySelectorAll('.mtr-tom button').forEach(b=>{{
                        if(b.dataset.tom==='{ton}') b.click();
                    }});
                }}
            """)
            await page.wait_for_timeout(400)
            await nav_financas(page)
            s_el = await page.query_selector(".fin-mentor-rod .mtr-s")
            if s_el:
                s_txt2 = await s_el.inner_text()
                if "/dia" in s_txt2.lower():
                    fail(f"[ton={ton}] frase contem '/dia': '{s_txt2[:70]}'")
                else:
                    frases_vistas.add(s_txt2.strip())
                    ok(f"[ton={ton}] frase OK sem /dia: '{s_txt2[:55]}'")
            else:
                warn(f"[ton={ton}] .mtr-s nao encontrado (estado diferente?)")
        if len(frases_vistas) > 1:
            ok(f"Frases distintas por persona ({len(frases_vistas)} textos diferentes)")
        elif len(frases_vistas) == 1:
            warn("Frase nao variou entre personas (pode estar no mesmo tom ou frase unica aleatoria)")

        # ══════════════════════════════════════════════════════════════
        # BLOCO 4 — Mentor por semana
        # ══════════════════════════════════════════════════════════════
        print("\n-- Mentor por semana --")
        sem_card = await page.query_selector(".fin-mentor-sem.mtr-card")
        if sem_card:
            sem_t = await page.query_selector(".fin-mentor-sem .mtr-t")
            sem_hero = await page.query_selector(".fin-mentor-sem .fin-mentor-hero-val")
            t_ok = (await sem_t.inner_text()).strip() if sem_t else ""
            ok(f".fin-mentor-sem.mtr-card presente; .mtr-t='{t_ok}'")
            if sem_hero:
                h_sem = await sem_hero.inner_text()
                ok(f"Hero semana: '{h_sem}'")
            else:
                warn(".fin-mentor-sem sem hero (pode nao ser esta semana ou diasRest=0)")
        else:
            warn(".fin-mentor-sem.mtr-card nao encontrado (pode nao ser esta semana ou apagar=0)")

        # ══════════════════════════════════════════════════════════════
        # BLOCO 5 — Estados passado e futuro (sem hero)
        # ══════════════════════════════════════════════════════════════
        print("\n-- Estado futuro (mes seguinte) --")
        # Navegar pro proximo mes
        btn_next = await page.query_selector("button[data-mes='1']")
        if btn_next:
            await btn_next.click()
            await page.wait_for_timeout(500)
            rod_fut = await page.query_selector(".fin-mentor-rod.fin-mentor-futuro")
            if rod_fut:
                mtr_t_fut = await page.query_selector(".fin-mentor-rod.fin-mentor-futuro .mtr-t")
                hero_fut = await page.query_selector(".fin-mentor-rod.fin-mentor-futuro .fin-mentor-hero-val")
                t_fut = await mtr_t_fut.inner_text() if mtr_t_fut else ""
                ok(f"Estado futuro: .fin-mentor-futuro presente · .mtr-t='{t_fut}'")
                if not hero_fut: ok("Estado futuro sem hero (correto)")
                else: fail("Estado futuro TEM hero (nao deveria)")
            else: fail(".fin-mentor-rod.fin-mentor-futuro ausente no mes seguinte")
        else: warn("Botao next mes nao encontrado")

        print("\n-- Estado passado (mes anterior) --")
        # re-query apos render (referencia stale apos mudanca de mes)
        btn_prev2 = await page.query_selector("button[data-mes='-1']")
        if btn_prev2:
            # voltar 2x: mes seguinte -> mes atual -> mes anterior
            await btn_prev2.click(); await page.wait_for_timeout(400)
            btn_prev3 = await page.query_selector("button[data-mes='-1']")
            if btn_prev3:
                await btn_prev3.click(); await page.wait_for_timeout(500)
            rod_pass = await page.query_selector(".fin-mentor-rod.fin-mentor-passado")
            if rod_pass:
                mtr_t_pass = await page.query_selector(".fin-mentor-rod.fin-mentor-passado .mtr-t")
                hero_pass = await page.query_selector(".fin-mentor-rod.fin-mentor-passado .fin-mentor-hero-val")
                t_pass = await mtr_t_pass.inner_text() if mtr_t_pass else ""
                ok(f"Estado passado: .fin-mentor-passado presente · .mtr-t='{t_pass}'")
                if not hero_pass: ok("Estado passado sem hero (correto)")
                else: fail("Estado passado TEM hero (nao deveria)")
            else: fail(".fin-mentor-rod.fin-mentor-passado ausente no mes anterior")
        else: warn("Botao prev mes nao encontrado apos navegar ao futuro")

        await ctx.close()

        # ══════════════════════════════════════════════════════════════
        # BLOCO 6 — Regressao: aba Mentor, Transacoes, Negocio
        # ══════════════════════════════════════════════════════════════
        print("\n-- Regressao: aba Mentor --")
        ctx3 = await browser.new_context(viewport={"width":1280,"height":800})
        page3 = await ctx3.new_page()
        reg_console = []
        page3.on("console", lambda m: reg_console.append(m.text) if m.type=="error" else None)
        await page3.goto(URL, wait_until="networkidle")
        await page3.evaluate("navigate('mentor')")
        await page3.wait_for_timeout(600)
        mentor_feed = await page3.query_selector(".mtr-feed, .mtr-spotlight, .mtr-grupos")
        if mentor_feed: ok("aba Mentor: feed/spotlight presente")
        else: fail("aba Mentor: feed/spotlight ausente")
        sw3 = await page3.evaluate("document.documentElement.scrollWidth")
        vw3 = await page3.evaluate("window.innerWidth")
        if sw3 <= vw3: ok(f"aba Mentor: overflow 0px")
        else: fail(f"aba Mentor: overflow {sw3-vw3}px")

        print("\n-- Regressao: Transacoes --")
        await page3.evaluate("navigate('transacoes')")
        await page3.wait_for_timeout(600)
        tx_el = await page3.query_selector("#transacoes-root, .tx-lista, .tx-root")
        if tx_el: ok("Transacoes: root presente")
        else: warn("Transacoes: root nao encontrado (nome de seletor pode variar)")
        sw_tx = await page3.evaluate("document.documentElement.scrollWidth")
        vw_tx = await page3.evaluate("window.innerWidth")
        if sw_tx <= vw_tx: ok(f"Transacoes: overflow 0px")
        else: fail(f"Transacoes: overflow {sw_tx-vw_tx}px")

        if not reg_console: ok("Regressao (mentor+tx): console 0")
        else:
            for e in reg_console: fail(f"Regressao console: {e}")
        await ctx3.close()

        print("\n-- Regressao: Negocio --")
        ctx4 = await browser.new_context(viewport={"width":1280,"height":800})
        page4 = await ctx4.new_page()
        neg_console = []
        page4.on("console", lambda m: neg_console.append(m.text) if m.type=="error" else None)
        await page4.goto(URL, wait_until="networkidle")
        await page4.evaluate("document.documentElement.setAttribute('data-mode','negocio')")
        await page4.evaluate("navigate('financeiro')")
        await page4.wait_for_timeout(600)
        sw4 = await page4.evaluate("document.documentElement.scrollWidth")
        vw4 = await page4.evaluate("window.innerWidth")
        if sw4 <= vw4: ok(f"Negocio financeiro: overflow 0px")
        else: fail(f"Negocio financeiro: overflow {sw4-vw4}px")
        if not neg_console: ok("Negocio: console 0")
        else:
            for e in neg_console: fail(f"Negocio console: {e}")
        await ctx4.close()

        await browser.close()

    # ══════════════════════════════════════════════════════════════
    # RESULTADO FINAL
    # ══════════════════════════════════════════════════════════════
    print("\n" + "="*60)
    total = len(erros) + len(avisos)
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
