from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://monstera-by-showit.showit.site/")
        page.wait_for_timeout(3000)
        page.screenshot(path="monstera_site.png", full_page=True)
        browser.close()

if __name__ == "__main__":
    run()
