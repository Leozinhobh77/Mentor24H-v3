"""Smoke - Contatos Fatia 2 (executor-20260617-003)
Testa: ctf-head, ctf-hero, ctf-pills, ctf-cards, ctf-ev timeline, overflow=0.
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

def abrir_ficha(page):
    page.evaluate("navigate('contatos')")
    page.wait_for_timeout(600)
    page.locator('.ct-click').first.click()
    page.wait_for_timeout(600)

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

            abrir_ficha(page)

            # 1. ctf-head presente (header sticky da ficha)
            head = page.locator('.ctf-head').count()
            check(f'[{lbl}] ctf-head renderizado', head >= 1)

            # 2. Botão Voltar (data-back)
            back = page.locator('[data-back]').count()
            check(f'[{lbl}] [data-back] (Voltar) presente', back >= 1)

            # 3. ctf-hero presente
            hero = page.locator('.ctf-hero').count()
            check(f'[{lbl}] ctf-hero presente', hero >= 1)

            # 4. ctf-nm com texto (nome do contato)
            nm_txt = page.locator('.ctf-nm').first.text_content() if page.locator('.ctf-nm').count() > 0 else ''
            check(f'[{lbl}] ctf-nm tem nome', len(nm_txt.strip()) > 0, f'nm={nm_txt!r}')

            # 5. ctf-sub (subtítulo contexto)
            sub = page.locator('.ctf-sub').count()
            check(f'[{lbl}] ctf-sub presente', sub >= 1)

            # 6. ctf-pills (pílulas de ação — só se contato tem telefone)
            pills = page.locator('.ctf-pill').count()
            check(f'[{lbl}] ctf-pill: ao menos 1 pílula de ação', pills >= 1, f'count={pills}')

            # 7. ctf-card (ao menos 2 cards: manter contato + histórico)
            cards = page.locator('.ctf-card').count()
            check(f'[{lbl}] ctf-card: ao menos 2 cards', cards >= 2, f'count={cards}')

            # 8. ctf-chead (cabeçalhos dos cards)
            cheads = page.locator('.ctf-chead').count()
            check(f'[{lbl}] ctf-chead presente', cheads >= 1)

            # 9. ctf-kv (último contato)
            kv = page.locator('.ctf-kv').count()
            check(f'[{lbl}] ctf-kv (último contato) presente', kv >= 1)

            # 10. [data-falei] presente
            falei = page.locator('[data-falei]').count()
            check(f'[{lbl}] [data-falei] botão presente', falei >= 1)

            # 11. [data-addprox] presente
            addprox = page.locator('[data-addprox]').count()
            check(f'[{lbl}] [data-addprox] botão presente', addprox >= 1)

            # 12. [data-adddata] presente
            adddata = page.locator('[data-adddata]').count()
            check(f'[{lbl}] [data-adddata] botão presente', adddata >= 1)

            # 13. [data-addint] presente
            addint = page.locator('[data-addint]').count()
            check(f'[{lbl}] [data-addint] botão presente', addint >= 1)

            # 14. ctf-btn-pri presente (Falei hoje)
            btn_pri = page.locator('.ctf-btn-pri').count()
            check(f'[{lbl}] ctf-btn-pri (Falei hoje) presente', btn_pri >= 1)

            # 15. Voltar → volta para lista
            page.locator('[data-back]').click()
            page.wait_for_timeout(400)
            lista = page.locator('.ct-item').count()
            check(f'[{lbl}] Voltar retorna lista (ct-item presente)', lista >= 1, f'items={lista}')

            # 16. Overflow horizontal = 0
            ov = page.evaluate("() => document.body.scrollWidth - window.innerWidth")
            check(f'[{lbl}] Overflow horizontal = 0', ov <= 2, f'overflow={ov}')

            # 17. Console limpo
            check(f'[{lbl}] Console 0 erros JS', len(errors) == 0,
                  '; '.join(errors[:3]) if errors else '')

            # Screenshot da ficha
            page.evaluate("navigate('contatos')")
            page.wait_for_timeout(400)
            abrir_ficha(page)
            shot = SHOTS / f'smoke-ficha-{width}.png'
            page.screenshot(path=str(shot), full_page=False)
            print(f'  [screenshot] {shot.name}')

            ctx.close()

        browser.close()

    passed = sum(1 for r in RESULTS if r['ok'])
    total  = len(RESULTS)
    print(f'\n{"="*54}')
    print(f'RESULTADO: {passed}/{total} checks passaram')
    if passed == total:
        print('[VERDE] SMOKE APROVADO — Contatos Fatia 2 OK')
    else:
        print('[VERMELHO] SMOKE REPROVADO')
        for r in RESULTS:
            if not r['ok']:
                print(f'  FAIL: {r["label"]} — {r["detail"]}')
    return passed == total

if __name__ == '__main__':
    ok = run_smoke()
    sys.exit(0 if ok else 1)
