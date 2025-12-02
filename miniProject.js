const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');

async function demoBlazeLaptops() {
    const driver = await new Builder().forBrowser('chrome').build();
    try {
        // Open DemoBlaze
        await driver.get('https://www.demoblaze.com/');

        // Find all category buttons that have id 'itemc' and pick the one whose text is 'Laptops'
        const cats = await driver.findElements(By.id('itemc'));
        let laptopsBtn = null;
        for (const c of cats) {
            const txt = (await c.getText()).trim();
            if (txt === 'Laptops') {
                laptopsBtn = c;
                break;
            }
        }

        if (!laptopsBtn) {
            throw new Error('Could not find the Laptops category button');
        }

        // Click the Laptops category
        await laptopsBtn.click();

        // Wait until products are loaded into the container with id 'tbodyid'
        await driver.wait(async () => {
            const items = await driver.findElements(By.css('#tbodyid .card'));
            return items.length > 0;
        }, 10000);

        // Collect product title elements (try common selectors used on the site)
        const selector = '#tbodyid .card .card-title a, #tbodyid .card h4 a';
        let initial = await driver.findElements(By.css(selector));
        const count = Math.min(initial.length, 5);

        // Re-query elements each loop to avoid stale element references if the DOM updates
        for (let i = 0; i < count; i++) {
            const current = await driver.findElements(By.css(selector));
            const name = await current[i].getText();
            console.log(`${i + 1}. ${name}`);
        }

        // Take a screenshot of the products page
        const base64 = await driver.takeScreenshot();
        const outPath = path.join(process.cwd(), 'products.png');
        fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
        console.log(`Saved screenshot: ${outPath}`);

    } finally {
        // Close the browser
        await driver.quit();
    }
}

demoBlazeLaptops().catch(err => {
    console.error(err);
    process.exit(1);
});