import * as cheerio from "cheerio";

export const fetchEmail = async (fullHtml) => {
  let emails = [];
  const emailRegex =
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|int|co|biz|info|io|me|tv|name|pro|us|uk|au|ca|de|fr|jp|ru|cn|es|it|nl|se|no|fi|dk|ch|at|be|pt|br|za|mx|ar|cl|nz|sg|hk|my|ph|id|ae|sa|tr|pl|xyz|tech|online|site|store|app|club|design|ai|cloud|guru|space|life|world|solutions|media|agency|news|academy|capital|care|video|marketing|digital)/g;

  const $ = cheerio.load(fullHtml);

  // Extract emails from mailto links
  $('a[href^="mailto:"]').each((i, element) => {
    let email = $(element).attr("href").replace("mailto:", "");

    if (email.includes("?")) {
      email = email.split("?")[0];
    }

    emails.push(email);
  });

  // Extract emails from the plain text of the HTML
  const matchedEmails = fullHtml.match(emailRegex) || [];
  emails = emails.concat(matchedEmails);

  // Remove duplicates
  emails = [...new Set(emails)];

  return emails;
};
