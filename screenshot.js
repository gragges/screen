const puppeteer = require('puppeteer');
const path = require('path');
const { v4: uuid } = require('uuid');
const fs = require('fs');
// Main screenshot function
const screenshot = async (req, res) => {
    const url = "https://www.bankier.pl/gielda/notowania/akcje";
    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }
    let browser;
    try {
        // Launch Puppeteer with specific Chrome executable path and options
        browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            executablePath: process.env.CHROME_PATH || '/opt/bin/chromium',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.setViewport({ width: 1920, height: 1080 });
        const fileName = `${uuid()}.png`;
        const screenshotPath = path.join(__dirname, '..', 'public', fileName);
        await page.screenshot({ path: screenshotPath });
        res.json({ screenshotPath: `/image/${fileName}` });
    } catch (err) {
        console.error('Error capturing screenshot:', err);
        res.status(500).json({ error: 'Failed to capture screenshot' });
    } finally {
        if (browser) await browser.close();
    }
};
module.exports = {screenshot};