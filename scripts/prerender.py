"""Bake JS-rendered sections into index.html for crawlers that skip JavaScript.

Renders the page in headless Chrome, copies the rendered updates and
certifications markup between the prerender markers in index.html.
At runtime script.js replaces that markup, so visitors see no change.

Run after changing posts.json, certifications or their rendering:
    python3 scripts/prerender.py
"""

import functools
import os
import re
import shutil
import subprocess
import tempfile
import threading
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
MAC_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
RENDER_TIMEOUT_S = 60
VIRTUAL_TIME_BUDGET_MS = 10000

# marker name -> (container id, markup that proves the render succeeded)
SECTIONS = {
    "updates": ("updates-container", 'class="update-entry card"'),
    "certifications": ("certifications-list", "cert-shell card"),
}

VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}

# script.js hides every unbound .card until it scrolls into view. Baked cards
# are replaced right after load, so marking them bound avoids a fade-then-swap.
CARD_TAG = re.compile(r'(<article\b[^>]*\bclass="[^"]*\bcard\b[^"]*")')
REVEAL_BOUND = r'\1 data-reveal-bound="true"'


class _Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class _InnerHtml(HTMLParser):
    """Finds the inner HTML range of the element with the given id."""

    def __init__(self, source, element_id):
        super().__init__(convert_charrefs=False)
        self._line_starts = [0] + [m.end() for m in re.finditer("\n", source)]
        self._id = element_id
        self._depth = 0
        self.start = None
        self.end = None

    def _offset(self):
        line, col = self.getpos()
        return self._line_starts[line - 1] + col

    def handle_starttag(self, tag, attrs):
        if self.end is not None or tag in VOID_TAGS:
            return

        if self.start is not None:
            self._depth += 1
            return

        if dict(attrs).get("id") == self._id:
            self.start = self._offset() + len(self.get_starttag_text())
            self._depth = 1

    def handle_startendtag(self, tag, attrs):
        pass

    def handle_endtag(self, tag):
        if self.start is None or self.end is not None or tag in VOID_TAGS:
            return

        self._depth -= 1
        if self._depth == 0:
            self.end = self._offset()


def _chrome():
    path = os.environ.get("CHROME") or shutil.which("google-chrome") or shutil.which("chromium")
    if path:
        return path

    if Path(MAC_CHROME).exists():
        return MAC_CHROME

    raise SystemExit("Chrome not found; set CHROME to its executable path.")


def _render(url):
    # A fresh profile has no saved language, so the page renders in English.
    with tempfile.TemporaryDirectory() as profile:
        result = subprocess.run(
            [
                _chrome(),
                "--headless=new",
                "--disable-gpu",
                "--force-prefers-reduced-motion",
                f"--user-data-dir={profile}",
                f"--virtual-time-budget={VIRTUAL_TIME_BUDGET_MS}",
                "--dump-dom",
                url,
            ],
            capture_output=True,
            text=True,
            timeout=RENDER_TIMEOUT_S,
            check=True,
        )
    return result.stdout


def _inner_html(dom, element_id):
    parser = _InnerHtml(dom, element_id)
    parser.feed(dom)
    if parser.start is None or parser.end is None:
        raise SystemExit(f"#{element_id} not found in rendered page.")

    return dom[parser.start:parser.end].strip()


def _inject(page, name, fragment):
    pattern = re.compile(
        rf"(?P<indent>[ \t]*)<!-- prerender:{name} -->.*?<!-- /prerender:{name} -->",
        re.S,
    )
    match = pattern.search(page)
    if not match:
        raise SystemExit(f"prerender:{name} markers missing in index.html.")

    indent = match.group("indent")
    block = f"{indent}<!-- prerender:{name} -->\n{fragment}\n{indent}<!-- /prerender:{name} -->"
    return page[:match.start()] + block + page[match.end():]


def main():
    handler = functools.partial(_Quiet, directory=str(ROOT))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()

    try:
        dom = _render(f"http://127.0.0.1:{server.server_port}/index.html")
    finally:
        server.shutdown()

    page = INDEX.read_text(encoding="utf-8")
    for name, (element_id, proof) in SECTIONS.items():
        fragment = _inner_html(dom, element_id)
        if proof not in fragment:
            raise SystemExit(f"#{element_id} did not render; index.html left unchanged.")

        page = _inject(page, name, CARD_TAG.sub(REVEAL_BOUND, fragment))

    INDEX.write_text(page, encoding="utf-8")
    print(f"Prerendered {', '.join(SECTIONS)} into {INDEX.name}.")


if __name__ == "__main__":
    main()
