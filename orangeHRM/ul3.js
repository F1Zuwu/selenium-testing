
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
        await driver.wait(until.elementLocated((By.xpath('//*[@id="app"]/div[1]/div[1]/aside/nav/div[2]/ul/li[1]'))), 10000).catch(() => {});
        await driver.findElement(By.xpath('//*[@id="app"]/div[1]/div[1]/aside/nav/div[2]/ul/li[1]')).click();
        
        

        await driver.wait(until.elementLocated(By.xpath('//*[@id="app"]/div[1]/div[2]/div[2]/div/div[2]/div[1]/button')), 5000).then(
            console.log("Add button exitsts on Admin page")
        )

        await driver.findElement(By.xpath('//*[@id="app"]/div[1]/div[1]/header/div[1]/div[3]/ul/li/span')).click()

    } finally {
        setTimeout(() => {
            driver.quit()
        }, 2000);
    }
}

basicSearch();