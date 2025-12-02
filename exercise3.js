const { Builder, By, Key, until } = require('selenium-webdriver');

async function basicSearch() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Open DuckDuckGo
        await driver.get('https://www.w3schools.com/html/html_forms.asp');

        await driver.findElement(By.name('fname')).clear();
        await driver.findElement(By.name('fname')).sendKeys('Raimo')
        
        await driver.findElement(By.name('lname')).clear();
        await driver.findElement(By.name('lname')).sendKeys('Kivi', Key.ENTER);

        console.log("Form submitted");

    } finally {
        // Close the browser
        await driver.quit();
    }
}

basicSearch();