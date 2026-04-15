from playwright.sync_api import sync_playwright
import time

BASE_URL = "https://bridge-hospice.com"
OUT_DIR = "/Users/milanmandic/Desktop/MonteKristo AI/clients/bridge-hospice/screenshots"

PAGES = [
    ("homepage", "/"),
]

VIEWPORTS = [
    ("desktop", 1440, 900),
    ("mobile",  375,  812),
]

def slugify(text):
    return text.lower().replace(" ", "-").replace("/", "-").strip("-")

def capture_nav_links(page):
    """Extract unique internal links from the navigation."""
    links = page.eval_on_selector_all(
        "nav a, header a, .menu a, .nav a, [role='navigation'] a",
        "els => els.map(e => e.href)"
    )
    seen = set()
    result = []
    for href in links:
        if not href:
            continue
        href = href.split("#")[0].split("?")[0].rstrip("/")
        if BASE_URL not in href:
            continue
        if href in seen:
            continue
        seen.add(href)
        result.append(href)
    return result

def capture(page, url, out_path):
    print(f"  Capturing: {url} -> {out_path}")
    try:
        page.goto(url, wait_until="networkidle", timeout=30000)
        time.sleep(1)
        # close any cookie banners / overlays
        for sel in ["button:has-text('Accept')", "button:has-text('Close')", "[aria-label='Close']", ".cookie-accept"]:
            try:
                el = page.query_selector(sel)
                if el and el.is_visible():
                    el.click()
                    time.sleep(0.5)
            except Exception:
                pass
        page.screenshot(path=out_path, full_page=True)
        print(f"    Saved.")
    except Exception as e:
        print(f"    ERROR: {e}")

with sync_playwright() as p:
    browser = p.chromium.launch()

    # --- Discover nav links from desktop homepage first ---
    discovery_page = browser.new_page(viewport={"width": 1440, "height": 900})
    discovery_page.goto(BASE_URL + "/", wait_until="networkidle", timeout=30000)
    time.sleep(1)
    nav_links = capture_nav_links(discovery_page)
    print("Discovered nav links:")
    for l in nav_links:
        print("  ", l)

    # Build page list: (slug, full_url)
    pages_to_capture = [("homepage", BASE_URL + "/")]
    seen_slugs = {"homepage"}
    for href in nav_links:
        path = href.replace(BASE_URL, "") or "/"
        if path == "/" or path == "":
            continue
        slug = slugify(path.replace("/", " ").strip())
        if not slug:
            slug = "page"
        if slug in seen_slugs:
            slug += "-2"
        seen_slugs.add(slug)
        pages_to_capture.append((slug, href))

    discovery_page.close()

    for vp_name, vp_w, vp_h in VIEWPORTS:
        print(f"\n=== Viewport: {vp_name} ({vp_w}x{vp_h}) ===")
        page = browser.new_page(viewport={"width": vp_w, "height": vp_h})
        for slug, url in pages_to_capture:
            out_path = f"{OUT_DIR}/{slug}-{vp_name}.png"
            capture(page, url, out_path)
        page.close()

    browser.close()
    print("\nAll screenshots captured.")
