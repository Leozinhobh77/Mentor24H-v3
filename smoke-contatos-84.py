"""
Smoke T84 — Redesign Contatos (executor-20260617-001)
Verifica: KPIs, lista, badge score, chips tag, busca, CRUD,
          telefone mascarado, e-mail validado, ficha, modais,
          regressão Negócio/Clientes, responsivo 360/1280,
          console 0 erros, overflow 0px.
"""
import asyncio, re
from pathlib import Path
from playwright.async_api import async_playwright

BASE = Path(__file__).parent
INDEX = (BASE / "index.html").as_uri()
SHOTS_DIR = BASE / "tarefas" / "screenshots"
SHOTS_DIR.mkdir(parents=True, exist_ok=True)

errors = []
ok_list = []

def chk(label, cond, msg=""):
    if cond:
        ok_list.append(label)
        print(f"  [OK]   {label}")
    else:
        errors.append(f"{label}: {msg}" if msg else label)
        print(f"  [FAIL] {label}" + (f" -- {msg}" if msg else ""))

async def nav_contatos(page):
    """Navega para a tela Contatos via JS navigate()."""
    await page.evaluate("navigate('contatos')")
    await page.wait_for_selector("#contatos-root", timeout=3000)
    await page.wait_for_timeout(300)

async def nav_clientes(page):
    """Navega para Clientes via botão mode-switch (desktop) + navigate JS."""
    mode_btn = await page.query_selector(".mode-switch button[data-mode='negocio']")
    if mode_btn:
        await mode_btn.click()
        await page.wait_for_timeout(300)
    await page.evaluate("navigate('clientes')")
    await page.wait_for_timeout(400)

async def run():
    console_errors = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--allow-file-access-from-files", "--disable-web-security"]
        )

        # ── 1280px claro ──────────────────────────────────────────
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await ctx.new_page()
        page.on("console", lambda m: console_errors.append(m) if m.type == "error" else None)
        page.on("pageerror", lambda e: console_errors.append(f"PageError: {e}"))

        await page.goto(INDEX)
        await page.wait_for_load_state("domcontentloaded")
        await page.wait_for_timeout(600)

        print("\n── Navegação ──────────────────────────────────────────")
        await nav_contatos(page)

        # A1 KPIs
        kpi_pills = await page.query_selector_all(".ct-kpi-pill")
        chk("A1 KPIs: 3 pílulas presentes", len(kpi_pills) >= 3, f"encontrados {len(kpi_pills)}")

        # A2 Toolbar: busca + seg + botão novo
        search = await page.query_selector(".ct-search-inp")
        chk("A2 Campo de busca presente", search is not None)
        seg_btns = await page.query_selector_all(".ct-seg button")
        chk("A2 Filtro contexto (Todos/Pessoal/Negócio)", len(seg_btns) >= 3, f"encontrados {len(seg_btns)}")
        add_btn = await page.query_selector("#contatos-root [data-add], .ct-btn-add")
        chk("A2 Botão 'Novo' presente", add_btn is not None)

        # A4 Group labels
        group_labels = await page.query_selector_all(".ct-group-label")
        chk("A4 Group labels presentes", len(group_labels) >= 1, f"encontrados {len(group_labels)}")

        # A5 Linha com avatar + score badge
        items = await page.query_selector_all(".ct-item")
        chk("A5 Linhas de contato presentes", len(items) >= 1, f"encontrados {len(items)}")
        score_badges = await page.query_selector_all(".ct-score-badge")
        chk("A5 Badge de score visível na lista", len(score_badges) >= 1, f"encontrados {len(score_badges)}")
        avatars = await page.query_selector_all(".ct-av")
        chk("A5 Avatares coloridos presentes", len(avatars) >= 1)

        # A6 Ações com aria-label (44px garantidos via CSS)
        acts = await page.query_selector_all(".ct-acts button, .ct-acts a")
        chk("A6 Ações da linha presentes", len(acts) >= 1)

        # A7 Estado vazio — testar com busca inválida
        print("\n── Busca e estado vazio ────────────────────────────────")
        await page.fill(".ct-search-inp", "zzzzzzzzzzzz_nenhum")
        await page.wait_for_timeout(300)
        empty = await page.query_selector(".ct-empty")
        chk("A7 Estado vazio aparece em busca sem resultado", empty is not None)
        # Limpar busca via botão X ou redigitar vazio
        clr_btn = await page.query_selector("[data-clear-q]")
        if clr_btn:
            await clr_btn.click()
        else:
            await page.fill(".ct-search-inp", "")
        await page.wait_for_timeout(300)

        # A2 Tags como chips roláveis
        tag_chips = await page.query_selector_all(".ct-tag-fc")
        chk("A2 Chips de tag roláveis presentes", len(tag_chips) >= 1)

        print("\n── CRUD criar contato ──────────────────────────────────")
        add_ct = await page.query_selector("#contatos-root [data-add], .ct-btn-add")
        if add_ct:
            await add_ct.click()
        else:
            await page.click("[data-add]", timeout=5000)
        await page.wait_for_timeout(400)
        modal = await page.query_selector(".modal-body, .modal, [id^='modal']")
        chk("D1 Modal Novo contato abriu", modal is not None)

        # Preencher nome
        nome_input = await page.query_selector("#c-nome")
        chk("D1 Campo nome presente", nome_input is not None)
        if nome_input:
            await nome_input.fill("Maria Smoke Test")

        # Preencher telefone (com máscara)
        tel_input = await page.query_selector("#c-tel")
        chk("E2 Campo telefone com DDI presente", tel_input is not None)
        ddi_sel = await page.query_selector("#c-tel-ddi")
        chk("E2 Seletor DDI presente", ddi_sel is not None)
        if tel_input:
            await tel_input.fill("")
            await tel_input.type("31988887777", delay=30)
            await page.wait_for_timeout(200)
            tel_val = await tel_input.input_value()
            chk("E2 Máscara aplicada (contém parêntese)", "(" in tel_val, f"valor: {tel_val}")

        # E-mail inválido → erro inline
        email_input = await page.query_selector("#c-email")
        if email_input:
            await email_input.fill("emailinvalido")
            # Tentar salvar para acionar validação
            save_btn = await page.query_selector("button[class*='primary']")
            # Precisamos do botão DENTRO do modal
            modal_save = await page.query_selector(".modal-footer .btn-primary, .modal .btn-primary")
            if modal_save:
                await modal_save.click()
                await page.wait_for_timeout(200)
                email_err = await page.query_selector("#c-email-err")
                err_text = await email_err.inner_text() if email_err else ""
                chk("E1 Erro inline e-mail inválido aparece", bool(err_text), f"texto: '{err_text}'")
            # Corrigir e-mail
            await email_input.fill("maria.smoke@test.com")

        # E3 Chip input de tags
        chip_in = await page.query_selector("#c-tags")
        chk("E3 Chip input de tags presente", chip_in is not None)
        if chip_in:
            await chip_in.fill("Teste")
            await chip_in.press("Enter")
            await page.wait_for_timeout(150)
            chips_after = await page.query_selector_all("#c-tags-chips .ct-chip-tag")
            chk("E3 Chip adicionado ao Enter", len(chips_after) >= 1, f"chips: {len(chips_after)}")

        # Salvar contato
        modal_save2 = await page.query_selector(".modal-footer .btn-primary, .modal .btn-primary")
        if modal_save2:
            await modal_save2.click()
            await page.wait_for_timeout(400)
        else:
            # Tentar fechar via botão de submit
            await page.keyboard.press("Enter")
            await page.wait_for_timeout(400)

        # Verificar que contato aparece na lista
        items_after = await page.query_selector_all(".ct-item")
        nomes = [await (await item.query_selector(".ct-nm-txt")).inner_text() if await item.query_selector(".ct-nm-txt") else "" for item in items_after]
        chk("CRUD criar: contato salvo aparece na lista", "Maria Smoke Test" in nomes, f"nomes: {nomes[:3]}")

        print("\n── Ficha (renderFicha) ─────────────────────────────────")
        # Clicar no primeiro contato
        first_click = await page.query_selector(".ct-click[data-open]")
        if first_click:
            await first_click.click()
            await page.wait_for_timeout(400)
            hero = await page.query_selector(".ct-hero")
            chk("C2 Hero da ficha presente", hero is not None)
            hero_nome = await page.query_selector(".ct-hero-nome")
            chk("C2 Nome no hero", hero_nome is not None)
            pills = await page.query_selector_all(".ct-pill")
            chk("E5 Pílulas de ação no hero", len(pills) >= 1, f"encontradas {len(pills)}")
            back_btn = await page.query_selector("[data-back]")
            chk("C1 Botão voltar presente", back_btn is not None)

            # C3 Manter contato
            freq_sel = await page.query_selector("[data-freq]")
            chk("C3 Select frequência presente", freq_sel is not None)
            falei_btn = await page.query_selector("[data-falei]")
            chk("C3 Botão 'Falei hoje' presente", falei_btn is not None)

            # D3 Falei hoje — abrir e verificar chips canal
            if falei_btn:
                await falei_btn.click()
                await page.wait_for_timeout(300)
                tipo_chips = await page.query_selector_all(".ct-tipo-chip")
                chk("D7 Chips de canal no modal Falei hoje", len(tipo_chips) >= 4, f"encontrados {len(tipo_chips)}")
                # Fechar com ESC
                await page.keyboard.press("Escape")
                await page.wait_for_timeout(200)
                modal_after_esc = await page.query_selector(".modal-back.show")
                chk("D3 Modal fecha com ESC", modal_after_esc is None)

            # C6 Histórico
            hist = await page.query_selector("[data-addint]")
            chk("C6 Botão Registrar interação presente", hist is not None)

            # Voltar para lista
            if back_btn:
                await back_btn.click()
                await page.wait_for_timeout(300)
                list_back = await page.query_selector(".ct-item")
                chk("Voltar: lista renderizou de volta", list_back is not None)

        print("\n── CRUD excluir ────────────────────────────────────────")
        # Hover sobre o último item para revelar os botões de ação
        all_items = await page.query_selector_all(".ct-item")
        target_item = None
        for it in all_items:
            nm = await it.query_selector(".ct-nm-txt")
            if nm and "Maria Smoke Test" in (await nm.inner_text()):
                target_item = it
                break
        if not target_item and all_items:
            target_item = all_items[-1]
        if target_item:
            await target_item.hover()
            await page.wait_for_timeout(200)
        # Re-query fresh del buttons after hover (evita stale handles)
        del_btn = None
        if target_item:
            del_btn = await target_item.query_selector("[data-del]")
        if not del_btn:
            del_btns_fresh = await page.query_selector_all("[data-del]")
            if del_btns_fresh:
                del_btn = del_btns_fresh[-1]
        if del_btn:
            try:
                await del_btn.click()
            except Exception:
                await page.evaluate("el => el.click()", del_btn)
            await page.wait_for_timeout(300)
            confirm_btn = await page.query_selector("[data-yes]")
            if confirm_btn:
                await confirm_btn.click()
                await page.wait_for_timeout(300)
                items_final = await page.query_selector_all(".ct-item")
                chk("CRUD excluir: lista reduziu", len(items_final) < len(items_after), f"antes={len(items_after)}, depois={len(items_final)}")
            else:
                chk("CRUD excluir: lista reduziu", False, "modal [data-yes] não apareceu")
        else:
            chk("CRUD excluir: lista reduziu", False, "botão [data-del] não encontrado")

        print("\n── Overflow 1280px ─────────────────────────────────────")
        overflow_h = await page.evaluate("""() => {
            const root = document.getElementById('contatos-root');
            return root ? root.scrollWidth - root.clientWidth : -1;
        }""")
        chk("Overflow horizontal 0px (1280px)", overflow_h == 0, f"overflow: {overflow_h}px")

        await page.screenshot(path=str(SHOTS_DIR / "smoke-contatos-1280.png"), full_page=False)
        print("  [SS]  smoke-contatos-1280.png")

        # ── Regressão modo Negócio/Clientes ───────────────────────
        print("\n── Regressão Negócio/Clientes ──────────────────────────")
        await nav_clientes(page)
        await page.wait_for_timeout(400)
        clientes_root = await page.query_selector("#clientes-root, [data-page='clientes'] .page-kpis, [data-page='clientes']")
        chk("Regressão: Clientes carrega sem erro", clientes_root is not None)
        overflow_neg = await page.evaluate("""() => {
            const pg = document.querySelector('[data-page="clientes"]') || document.body;
            return pg.scrollWidth - pg.clientWidth;
        }""")
        chk("Regressão: overflow 0px no Negócio", overflow_neg == 0, f"overflow: {overflow_neg}px")

        await ctx.close()

        # ── 360px mobile ──────────────────────────────────────────
        print("\n── Responsivo 360px ────────────────────────────────────")
        ctx360 = await browser.new_context(viewport={"width": 360, "height": 780})
        page360 = await ctx360.new_page()
        page360.on("console", lambda m: console_errors.append(m) if m.type == "error" else None)

        await page360.goto(INDEX)
        await page360.wait_for_load_state("domcontentloaded")
        await page360.wait_for_timeout(600)
        await nav_contatos(page360)

        # Verificar lista renderiza no mobile
        items360 = await page360.query_selector_all(".ct-item")
        chk("Mobile 360px: lista renderiza", len(items360) >= 1)

        overflow360 = await page360.evaluate("""() => {
            const root = document.getElementById('contatos-root');
            return root ? root.scrollWidth - root.clientWidth : -1;
        }""")
        chk("Mobile 360px: overflow 0px", overflow360 == 0, f"overflow: {overflow360}px")

        # Abrir ficha no mobile
        first360 = await page360.query_selector(".ct-click[data-open]")
        if first360:
            await first360.click()
            await page360.wait_for_timeout(400)
            hero360 = await page360.query_selector(".ct-hero")
            chk("Mobile 360px: ficha hero renderiza", hero360 is not None)
            overflow360_ficha = await page360.evaluate("""() => {
                const root = document.getElementById('contatos-root');
                return root ? root.scrollWidth - root.clientWidth : -1;
            }""")
            chk("Mobile 360px: overflow 0px na ficha", overflow360_ficha == 0, f"overflow: {overflow360_ficha}px")

        await page360.screenshot(path=str(SHOTS_DIR / "smoke-contatos-360.png"), full_page=False)
        print("  [SS]  smoke-contatos-360.png")
        await ctx360.close()

        # ── Tema escuro ───────────────────────────────────────────
        print("\n── Tema escuro ─────────────────────────────────────────")
        ctx_dark = await browser.new_context(
            viewport={"width": 1280, "height": 900},
            color_scheme="dark"
        )
        page_dark = await ctx_dark.new_page()
        await page_dark.goto(INDEX)
        await page_dark.wait_for_load_state("domcontentloaded")
        await page_dark.wait_for_timeout(500)
        await nav_contatos(page_dark)
        items_dark = await page_dark.query_selector_all(".ct-item")
        chk("Tema escuro: lista renderiza", len(items_dark) >= 1)
        overflow_dark = await page_dark.evaluate("""() => {
            const root = document.getElementById('contatos-root');
            return root ? root.scrollWidth - root.clientWidth : -1;
        }""")
        chk("Tema escuro: overflow 0px", overflow_dark == 0, f"overflow: {overflow_dark}px")
        await ctx_dark.close()

        await browser.close()

    # ── Console ───────────────────────────────────────────────────
    print("\n── Console ─────────────────────────────────────────────")
    real_errors = [e for e in console_errors if "favicon" not in str(e).lower()]
    chk(f"Console: 0 erros JS", len(real_errors) == 0, f"{len(real_errors)} erros: {[str(e)[:80] for e in real_errors[:3]]}")

    # ── Resultado final ───────────────────────────────────────────
    total = len(ok_list) + len(errors)
    print(f"\n{'='*55}")
    print(f"RESULTADO: {len(ok_list)}/{total} OK  |  {len(errors)} falha(s)")
    if errors:
        print("\nFALHAS:")
        for e in errors:
            print(f"  ✗ {e}")
    else:
        print("VERDE — todos os asserts passaram")
    print('='*55)
    return len(errors) == 0

if __name__ == "__main__":
    ok = asyncio.run(run())
    exit(0 if ok else 1)
