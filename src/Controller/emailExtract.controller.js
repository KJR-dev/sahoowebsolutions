import * as cheerio from 'cheerio';
import warpAsync from "../Utils/warpAsync.js";
import ExpressError from "../Utils/ExpressError.js";
import { fetchEmail } from "../Utils/fetchEmail.js";
import { fetchHtmlElement } from "../Utils/fetchHtmlElement.js";
import { json2csv } from 'json-2-csv';
import { join } from 'path';
import { writeFileSync, unlink } from 'fs';


export const form = (req, res, next) => {
    res.render('form');
};

export const emailExtract = warpAsync(async (req, res, next) => {
    let emailsData = {};
    const validPrefixes = ['/contact', '/contact-us', '/about', '/termsofuse'];
    let domainArray = req.body.websiteUrl;
    let count = 0;
    for (let domain of domainArray) {

        emailsData[domain] = {
            emails: [],
            links: [],
            additionalInfos: []
        };
        let modifyDomain = domain;
        if (!(domain.startsWith("https://www.") || domain.startsWith("https://"))) {
            modifyDomain = "https://www." + domain;
        }
        console.log(`🔥🔥🔥🔥 ${count++}`, modifyDomain);
        let fullHtml;
        try {
            fullHtml = await fetchHtmlElement(modifyDomain);
        } catch (error) {
            console.error(`❌ Error fetching HTML from ${modifyDomain}:`, error.message);
            continue;
        }

        if (!fullHtml) {
            console.log(`⚠️ Skipping ${modifyDomain} due to empty HTML response`);
            continue;
        }

        emailsData[domain].emails = await fetchEmail(fullHtml);

        if (emailsData[domain].emails.length === 0) {
            const $ = cheerio.load(fullHtml);
            $('a').each((i, element) => {
                const href = $(element).attr('href');
                emailsData[domain].additionalInfos.push(href);
                if (href && validPrefixes.some(prefix => href.startsWith(prefix))) {
                    emailsData[domain].links.push(href);
                }
            });

            emailsData[domain].links = [...new Set(emailsData[domain].links)];

            for (const link of emailsData[domain].links) {
                const fullLink = modifyDomain.concat(link);
                const linkedHtml = await fetchHtmlElement(fullLink);

                if (!linkedHtml) {
                    console.log(`⚠️ Skipping ${fullLink} due to empty HTML response`);
                    continue;
                }

                const linkedEmails = await fetchEmail(linkedHtml);
                emailsData[domain].emails = emailsData[domain].emails.concat(linkedEmails);
            }

            emailsData[domain].emails = [...new Set(emailsData[domain].emails)];

        } else {
            if (emailsData[domain].emails.length === 0) {
                throw new ExpressError(404, "Error occurred from DB", "No report exists with the provided id", "none");
            }
        }
    }
    res.render('download', { emailsData });
});


export const download = async (req, res, next) => {
    let emailsData = JSON.parse(req.body.emailsData);
    const data = Object.keys(emailsData).map(domain => {
        const sheetData = emailsData[domain];
        return {
            domain: domain,
            emails: sheetData.emails.join(','),
            links: sheetData.links.join(', '),
            additionalInfos: sheetData.additionalInfos.join(', ')
        };
    });
    // Convert JSON to CSV
    const csv = await json2csv(data);

    // Define the file path
    const filePath = join(process.cwd(), 'emails.csv');

    // Write the CSV to a file
    writeFileSync(filePath, csv);

    // Send the file as a download response
    res.download(filePath, 'emails.csv', (err) => {
        if (err) {
            res.status(500).send('Error generating file');
        } else {
            // File was successfully sent, now delete it
            unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(`Error deleting file: ${unlinkErr}`);
                } else {
                    console.log(`File ${filePath} deleted successfully`);
                }
            });
        }
    });
}