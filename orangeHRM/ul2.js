
const { Builder, By, Key, until } = require('selenium-webdriver');

let cookies = null;

async function basicSearch() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Open login page
        await driver.get('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

        await driver.wait(until.elementLocated(By.name('username')));

        await driver.findElement(By.name('username')).sendKeys('Admin');
        await driver.findElement(By.name('password')).sendKeys('admin123', Key.ENTER);

        // Wait until dashboard or some element that indicates login succeeded
        await driver.wait(until.urlContains('/dashboard'), 10000).catch(() => {});

        // Get cookies after login
        cookies = await driver.manage().getCookies();
        console.log('Saved cookies:', cookies);

        // Close this session properly
        await driver.quit();

        // Create a new browser session and restore cookies to navigate directly to dashboard
        const driver2 = await new Builder().forBrowser('chrome').build();
        try {
            // Navigate to base domain so cookies can be added
            await driver2.get('https://opensource-demo.orangehrmlive.com/');
            driver2.manage().deleteAllCookies();

            // Add cookies one-by-one. Some cookie objects may contain fields not accepted by addCookie,
            // so only pass name and value and optional path/domain if present.
            for (const c of cookies || []) {
                const cookieToAdd = { name: c.name, value: c.value };
                if (c.path) cookieToAdd.path = c.path;
                if (c.domain) cookieToAdd.domain = c.domain;
                if (c.secure !== undefined) cookieToAdd.secure = c.secure;
                // expiry / httpOnly are typically not required for adding; skip if problematic
                try {
                    await driver2.manage().addCookie(cookieToAdd);
                } catch (err) {
                    console.warn('Could not add cookie', cookieToAdd, err.message || err);
                }
            }

            // Navigate to dashboard now that cookies are set
            await driver2.get('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

            // Wait a moment so page settles, then optionally print current URL
            await driver2.sleep(1000);
            console.log('Final URL:', await driver2.getCurrentUrl());

        } finally {
            setTimeout(() => {
                driver2.quit();
            }, 1000);
        }

    } catch (e) {
        console.error(e);
        try { await driver.quit(); } catch (_) {}
    }
}

basicSearch();