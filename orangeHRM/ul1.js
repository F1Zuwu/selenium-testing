
const { Builder, By, Key, until } = require('selenium-webdriver');

let cookies = null;

async function basicSearch() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Open login page
        await driver.get('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

        await driver.wait(until.elementLocated(By.name('username')));

        // First (incorrect) login attempt
        await driver.findElement(By.name('username')).sendKeys('Adn1');
        await driver.findElement(By.name('password')).sendKeys('admin1234', Key.ENTER);

        // Give the page a short moment for the error to appear
        await driver.sleep(1200);

        // Check for the "Invalid credentials" message using the alert's specific classes
        // The alert uses classes like: "oxd-text oxd-text--p oxd-alert-content-text"
        const alertSelector = '.oxd-text.oxd-text--p.oxd-alert-content-text, .oxd-alert-content-text';
        const alertEls = await driver.findElements(By.css(alertSelector));
        let invalidFound = false;
        for (const el of alertEls) {
            try {
                const txt = (await el.getText()) || '';
                if (txt.trim().toLowerCase().includes('invalid credentials'.toLowerCase())) {
                    invalidFound = true;
                    break;
                }
            } catch (err) {
                // ignore stale/read errors on individual elements
            }
        }
        if (invalidFound) {
            console.log('Invalid credentials message appeared after first attempt');
        } else {
            console.log('No invalid credentials message found after first attempt');
        }

        // Clear inputs and retry with correct credentials
        const userInput = await driver.findElement(By.name('username'));
        await userInput.clear();
        await userInput.sendKeys('Admin');
        const passInput = await driver.findElement(By.name('password'));
        await passInput.clear();
        await passInput.sendKeys('admin123', Key.ENTER);

        // Wait until dashboard or some element that indicates login succeeded
        await driver.wait(until.urlContains('/dashboard'), 10000)
        .then(()=> {console.log("Login successful");})
        .catch(() => {});

        // Close this session properly
        await driver.quit();

    } catch (e) {
        console.error(e);
        try { await driver.quit(); } catch (_) {}
    }
}

basicSearch();