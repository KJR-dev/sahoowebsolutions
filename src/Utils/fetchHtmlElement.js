import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from "axios";

export const fetchHtmlElement = async (websiteUrl) => {
    let fullHtml = null;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto(websiteUrl, { waitUntil: 'networkidle2' });
        fullHtml = await page.content();
    } catch (error) {
        const { data } = await axios.get(websiteUrl);
        fullHtml = cheerio.load(data);
        fullHtml = fullHtml.html();
    } finally {
        await browser.close();
    }
    return fullHtml;
};