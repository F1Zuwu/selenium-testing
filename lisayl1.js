
const { Builder, By, Key, until } = require('selenium-webdriver');

async function addRemoveElements() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Open the page
        await driver.get('https://practice.expandtesting.com/add-remove-elements');

        // Click "Add Element" button 5 times
        const addBtn = By.xpath('//button[text()="Add Element"]');
        for (let i = 0; i < 5; i++) {
            await driver.findElement(addBtn).click();
            console.log(`Added element ${i + 1}`);
        }

        // Wait a moment for all elements to be added
        await driver.sleep(500);

        // Delete all added elements one by one
        // The delete buttons have the class "btn btn-danger" or similar
        let deleteBtn = By.xpath('//button[contains(text(), "Delete") or contains(@class, "btn-danger")]');
        let deleteCount = 0;
        
        while (true) {
            try {
                const elements = await driver.findElements(deleteBtn);
                if (elements.length === 0) {
                    break;
                }
                // Click the first delete button found
                await elements[0].click();
                deleteCount++;
                console.log(`Deleted element ${deleteCount}`);
                // Small delay between deletions
                await driver.sleep(300);
            } catch (err) {
                // No more delete buttons found
                break;
            }
        }

        console.log(`Task complete: Added 5 elements and deleted ${deleteCount} elements.`);
        
    } finally {
        // Close the browser
        await driver.quit();
    }
}

addRemoveElements().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});