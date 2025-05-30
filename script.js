const { Builder, By, until, Browser, Key } = require('selenium-webdriver');
const fs = require('fs');

(async function testScript() {
    const driver = await new Builder().forBrowser(Browser.CHROME).build(); // Chrome

    try {
        await driver.get('https://www.google.com/'); // Go to google.com

        // Search for 'selenium' and take a screenshot of the results page
        // Search bar has name = 'q', find element by name
        let searchInput = await driver.wait(until.elementLocated(By.name('q')), 5000);
        await searchInput.sendKeys('selenium'); // Input 'selenium'
        await searchInput.sendKeys(Key.RETURN); // Click Enter/Return key
        await driver.sleep(15000); // Wait 15 secs to solve captcha if it appears

        // Take screenshot
        let screenshot = await driver.takeScreenshot(); // Returns base-64 encoded PNG
        // Save screenshot as base-64 PNG
        fs.writeFile('screenshot.png', screenshot, 'base64', (e) => {
            if (e) {
                console.log("Error saving screenshot.");
            } 
            else {
                console.log('Screenshot saved as screenshot.png');
            }
        });

        // Find search results and store in a list
        await driver.sleep(10000);
        // Find all <a> elements in search results div (div#search)
        // Anchor tags <a> have href attribute
        let searchResults = await driver.findElements(By.css('div#search a'));
        let links = [];

        for (let searchResult of searchResults) {
            let href = await searchResult.getAttribute('href'); // Get href
            if (href) {
                links.push(href);
            }
        }

        // Export links to file
        let linksFile = links.join('\n');
        // Save as .txt
        fs.writeFile('links.txt', linksFile, 'utf8', (e) => {
            if (e) {
                console.log("Error exporting links.");
            } 
            else {
                console.log('Exported into links.txt');
            }
        });
    }
    finally {
        await driver.quit();
    }
})();
