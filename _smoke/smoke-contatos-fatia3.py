"""Smoke - Contatos Fatia 3 (executor-20260617-005)
Testa: form múltiplos telefones, tags chips, email validado, toggle favorito,
       salvar novo contato, regressão CRUD, overflow=0, console limpo.
"""
import subprocess, sys, pathlib

def install(pkg):
    subprocess.check_call([sys.executable,'-m','pip','install',pkg,'-q'])

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    install('playwright')
    subprocess.check_call([sys.executable,'-m','playwright','install','chromium','--quiet'])
    from playwright.sync_api import sync_playwright

BASE  = pathlib.Path(__file__).parent.parent
URL   = f'file:///{(BASE / "index.html").resolve().as_posix()}'
SHOTS = BASE / 'tarefas' / 'screenshots'
SHOTS.mkdir(parents=True, exist_ok=True)

RESULTS = []

def check(label, ok, detail=''):
    status = '[OK  ]' if ok else '[FAIL]'
    RESULTS.append({'label': label, 'ok': ok, 'detail': detail})
    print(f'  {status} {label}' + (f' — {detail}' if detail else ''))

def abrir_form(page):
    """Abre o form de novo contato."""
    page.evaluate("navigate('contatos')")
    page.wait_for_timeout(500)
    page.locator('.ct-newbtn').click()
    page.wait_for_timeout(500)

def run_smoke():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for width, theme, lbl in [(360, 'dark', 'Mobile-escuro'), (1280, 'light', 'Desktop-claro')]:
            print(f'\n--- {lbl} ({width}px) ---')
            ctx = browser.new_context(viewport={'width': width, 'height': 812})
            page = ctx.new_page()

            errors = []
            page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
            page.on('pageerror', lambda e: errors.append(str(e)))

            page.goto(URL, wait_until='networkidle', timeout=15000)
            page.evaluate(f"document.documentElement.setAttribute('data-theme','{theme}')")
            page.wait_for_timeout(400)

            # ── 1. Lista renderiza ───────────────────────────────
            page.evaluate("navigate('contatos')")
            page.wait_for_timeout(500)
            lista = page.locator('.ct-item').count()
            check(f'[{lbl}] lista ct-item renderiza', lista >= 1, f'items={lista}')

            # ── 2. Botão "Novo contato" presente ────────────────
            newbtn = page.locator('.ct-newbtn').count()
            check(f'[{lbl}] ct-newbtn presente', newbtn >= 1)

            # ── 3. Form abre ─────────────────────────────────────
            abrir_form(page)
            modal_h = page.locator('.modal-h h3').text_content()
            check(f'[{lbl}] modal título "Novo contato"', 'Novo contato' in (modal_h or ''), f'título={modal_h!r}')

            # ── 4. Seção Identidade + input Nome ─────────────────
            nome_inp = page.locator('#cf-nome').count()
            check(f'[{lbl}] #cf-nome presente', nome_inp >= 1)

            # ── 5. Bloco de telefone renderiza ────────────────────
            tel_block = page.locator('.ct-tel').count()
            check(f'[{lbl}] .ct-tel bloco inicial', tel_block >= 1, f'blocos={tel_block}')

            # ── 6. Seletor de tipo de telefone ────────────────────
            tel_tipo = page.locator('.ct-tel-tipo').count()
            check(f'[{lbl}] .ct-tel-tipo select presente', tel_tipo >= 1)

            # ── 7. Seletor de país (DDI) ──────────────────────────
            tel_cc = page.locator('.ct-tel-cc').count()
            check(f'[{lbl}] .ct-tel-cc (país) presente', tel_cc >= 1)

            # ── 8. Input de número de telefone ─────────────────────
            tel_inp = page.locator('.ct-tel-input').count()
            check(f'[{lbl}] .ct-tel-input presente', tel_inp >= 1)

            # ── 9. Botão estrela principal ─────────────────────────
            star = page.locator('.ct-tel-star').count()
            check(f'[{lbl}] .ct-tel-star presente', star >= 1)

            # ── 10. Botão "Adicionar telefone" ─────────────────────
            addtel = page.locator('.ct-addtel').count()
            check(f'[{lbl}] .ct-addtel presente', addtel >= 1)

            # ── 11. Adicionar 2º telefone ──────────────────────────
            page.locator('.ct-addtel').click()
            page.wait_for_timeout(300)
            tel_blocks2 = page.locator('.ct-tel').count()
            check(f'[{lbl}] "+" gera 2º bloco de telefone', tel_blocks2 >= 2, f'blocos={tel_blocks2}')

            # ── 12. Input de número aceita máscara BR ──────────────
            first_num = page.locator('.ct-tel-input').first
            first_num.fill('31988887777')
            page.wait_for_timeout(300)
            val = first_num.input_value()
            check(f'[{lbl}] máscara BR aplicada (31) 9XXXX-XXXX', '(' in val and ')' in val, f'val={val!r}')

            # ── 13. Campo e-mail presente ──────────────────────────
            email_inp = page.locator('#cf-email').count()
            check(f'[{lbl}] #cf-email presente', email_inp >= 1)

            # ── 14. Tagbox presente ────────────────────────────────
            tagbox = page.locator('.ct-tagbox').count()
            check(f'[{lbl}] .ct-tagbox presente', tagbox >= 1)

            # ── 15. Tag input e add via Enter ──────────────────────
            tag_inp = page.locator('#ct-taginput')
            tag_inp.fill('Amigo')
            tag_inp.press('Enter')
            page.wait_for_timeout(300)
            chips = page.locator('.ct-form-chip').count()
            check(f'[{lbl}] chip "Amigo" adicionado via Enter', chips >= 1, f'chips={chips}')

            # ── 16. Favorito toggle presente ──────────────────────
            fav_tog = page.locator('#cf-fav-tog').count()
            check(f'[{lbl}] #cf-fav-tog presente', fav_tog >= 1)

            # ── 17. Favorito toggle liga/desliga ────────────────────
            fav_row = page.locator('#cf-fav-row')
            fav_row.click()
            page.wait_for_timeout(200)
            is_on = page.locator('#cf-fav-tog.on').count()
            check(f'[{lbl}] toggle favorito acende (classe .on)', is_on >= 1, f'on={is_on}')

            # ── 18. Salvar novo contato sem nome → erro ────────────
            page.locator('[data-save]').click()
            page.wait_for_timeout(300)
            # Modal ainda aberto (nome vazio → deve ter dado erro)
            modal_still = page.locator('.modal').count()
            check(f'[{lbl}] salvar sem nome mantém modal aberto', modal_still >= 1)

            # ── 19. Salvar com nome ────────────────────────────────
            page.locator('#cf-nome').fill('Teste Smoke Fatia3')
            page.locator('[data-save]').click()
            page.wait_for_timeout(500)
            modal_gone = page.locator('.modal').count()
            check(f'[{lbl}] modal fecha após salvar com nome', modal_gone == 0, f'modals={modal_gone}')

            # ── 20. Contato criado aparece na lista ─────────────────
            lista_post = page.locator('.ct-item').count()
            check(f'[{lbl}] lista cresce após salvar', lista_post > lista, f'antes={lista} depois={lista_post}')

            # ── 21. Abrir ficha do contato criado ───────────────────
            page.evaluate("navigate('contatos')")
            page.wait_for_timeout(400)
            page.locator('.ct-click').last.click()
            page.wait_for_timeout(500)
            ctf_head = page.locator('.ctf-head').count()
            check(f'[{lbl}] ficha do contato criado abre', ctf_head >= 1)

            # ── 22. Editar contato existente → form abre ────────────
            page.locator('[data-editf]').click()
            page.wait_for_timeout(500)
            edit_modal = page.locator('.modal-h h3').text_content()
            check(f'[{lbl}] modal Editar contato abre', 'Editar contato' in (edit_modal or ''), f'título={edit_modal!r}')
            # ct-tel bloco do contato editado (deve ter telefones do seed)
            edit_tel = page.locator('.ct-tel').count()
            check(f'[{lbl}] Editar: bloco telefone renderiza', edit_tel >= 1, f'blocos={edit_tel}')
            # Fechar
            page.locator('[data-close]').first.click()
            page.wait_for_timeout(300)

            # ── 23. Voltar para lista ────────────────────────────────
            back_btn = page.locator('[data-back]')
            if back_btn.count():
                back_btn.click()
                page.wait_for_timeout(400)

            # ── 24. Overflow horizontal = 0 ──────────────────────────
            ov = page.evaluate("() => document.body.scrollWidth - window.innerWidth")
            check(f'[{lbl}] Overflow horizontal = 0', ov <= 2, f'overflow={ov}')

            # ── 25. Console 0 erros JS ────────────────────────────────
            check(f'[{lbl}] Console 0 erros JS', len(errors) == 0,
                  '; '.join(errors[:3]) if errors else '')

            # Screenshot
            page.evaluate("navigate('contatos')")
            page.wait_for_timeout(400)
            page.locator('.ct-newbtn').click()
            page.wait_for_timeout(400)
            shot = SHOTS / f'smoke-form-contatos-{width}.png'
            page.screenshot(path=str(shot), full_page=False)
            print(f'  [screenshot] {shot.name}')

            ctx.close()

        browser.close()

    passed = sum(1 for r in RESULTS if r['ok'])
    total  = len(RESULTS)
    print(f'\n{"="*58}')
    print(f'RESULTADO: {passed}/{total} checks passaram')
    if passed == total:
        print('[VERDE] SMOKE APROVADO — Contatos Fatia 3 OK')
    else:
        print('[VERMELHO] SMOKE REPROVADO')
        for r in RESULTS:
            if not r['ok']:
                print(f'  FAIL: {r["label"]} — {r["detail"]}')
    return passed == total

if __name__ == '__main__':
    ok = run_smoke()
    sys.exit(0 if ok else 1)
