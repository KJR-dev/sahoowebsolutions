import * as cheerio from 'cheerio';

export const fetchEmail = async (fullHtml) => {
    let emails = [];
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const $ = cheerio.load(fullHtml);
    $('a[href^="mailto:"]').each((i, element) => {
        const email = $(element).attr('href').replace('mailto:', '');
        emails.push(email);
        emails = [...new Set(emails)];
    });

    if (emails.length === 0) {
        emails = fullHtml.match(emailRegex) || [];
    }
    emails = [...new Set(emails)];
    return emails;
};