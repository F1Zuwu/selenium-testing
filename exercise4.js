const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

async function basicSearch() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Open DuckDuckGo
        await driver.get('https://www.duckduckgo.com');

        // Type 'WebDriver' into the search box and press Enter
        await driver.findElement(By.name('q')).sendKeys('Selenium WebDriver', Key.ENTER);

        // Wait for at least one search result to appear
        await driver.wait(
            until.elementLocated(By.css('h2 a')),
            10000
        );

        // Collect result link elements (selects the result title links)
        let results = await driver.findElements(By.css('h2 a'));
        const count = Math.min(results.length, 3);

        for (let i = 0; i < count; i++) {

            try {
                // Fallback to full-page screenshot
                const base64 = await driver.takeScreenshot();
                const filePath = path.join(process.cwd(), `result_full.png`);
                fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
                console.log(`Saved full-page screenshot: ${filePath}`);


            } catch (err) {
                console.error(`Failed to take screenshot for result ${i + 1}:`, err);
            }
        }

    } finally {
        // Close the browser
        await driver.quit();
    }
}

basicSearch();