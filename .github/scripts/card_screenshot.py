#!/usr/bin/env python
'''
This script generates a screenshot from a tool card on the proceedings page.

NOTE: requires `selenium==4.34.x` to be installed
'''

import sys
import time
from collections.abc import Generator
from contextlib import contextmanager

from selenium import webdriver
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


@contextmanager
def headless_browser() -> Generator[webdriver.Chrome, None, None]:
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--window-size=1280,1024")

    try:
        driver = webdriver.Chrome(options=options)
    except WebDriverException as e:
        raise WebDriverException("Failed to start Chrome WebDriver") from e
    
    try:
        yield driver
    except Exception as e:
        raise RuntimeError("Unexpected error while using Chrome WebDriver") from e
    finally:
        driver.quit()


def screenshot(tool: str, timeout: int = 30) -> None:
    with headless_browser() as driver:
        driver.get("https://jasonkai.com/nmind-proceedings")
        wait = WebDriverWait(driver, timeout)

        # Filter for tool so it displays on page
        filter_input = wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "input[placeholder*='tool name/description']")
            )
        )
        filter_input.click()
        filter_input.clear()
        filter_input.send_keys(tool)

        # Wait for result to load
        time.sleep(1)
        tool_xpath = f"//a[contains(@href, '/proceedings/{tool}')]/ancestor::div[1]"
        element = wait.until(
            EC.visibility_of_element_located((By.XPATH, tool_xpath))
        )

        # If display==contents, visibility disappears - force visibility for screenshot
        if element.value_of_css_property('display') == 'contents':
            driver.execute_script("""
                arguments[0].style.display = 'block';
                arguments[0].style.visibility = 'visible';
                arguments[0].style.width = 'auto';
                arguments[0].style.height = 'auto';
                arguments[0].style.position = 'static';
            """, element
            )
            time.sleep(0.5)

        # Ensure element is in viewport and screenshot
        driver.execute_script("arguments[0].scrollIntoView(true);", element)
        element.screenshot(f"{tool}.png")

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: card_screenshot.py <tool_url_name>")
        sys.exit(1)
    screenshot(tool=sys.argv[1])
