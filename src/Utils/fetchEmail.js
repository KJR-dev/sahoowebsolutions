import * as cheerio from "cheerio";
import he from "he"; // Import he as a default export
const { decode } = he;

export const fetchEmail = async (fullHtml) => {
  let emails = [];
  
  // Regular expression to match email addresses
  const emailRegex =
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|int|co|biz|info|io|me|tv|name|pro|us|uk|au|ca|de|fr|ru|cn|es|it|nl|se|no|fi|dk|ch|at|be|pt|br|za|mx|ar|cl|nz|sg|hk|my|ph|id|ae|sa|tr|pl|xyz|tech|online|site|store|app|club|design|ai|cloud|guru|space|life|world|solutions|media|agency|news|academy|capital|care|video|marketing|digital)/g;

  const $ = cheerio.load(fullHtml);

  // Extract emails from mailto links
  $('a[href^="mailto:"]').each((i, element) => {
    let email = $(element).attr("href").replace("mailto:", "");

    if (email.includes("?")) {
      email = email.split("?")[0];
    }

    emails.push(email);
  });

  // Decode the full HTML string to handle encoded characters
  const decodedHtml = decode(fullHtml);

  // Extract emails from the plain text of the decoded HTML
  const matchedEmails = decodedHtml.match(emailRegex) || [];
  emails = emails.concat(matchedEmails);

  // Remove duplicates
  emails = [...new Set(emails)];

  // Dynamically filter out fake/placeholder emails based on patterns
  emails = emails.filter((email) => {
    const localPart = email.split("@")[0];
    const domain = email.split("@")[1];

    // Patterns to detect fake emails
    return (
      !email.endsWith(".jpg") &&                        
      localPart.length <= 20 &&                        
      !/^[a-f0-9]{32}$/.test(localPart) &&                
      !/^(user|test|admin|yourname|example)$/i.test(localPart) && 
      !/^(example|domain|mail|email)\.com$/i.test(domain) &&       
      !/^\d{3,}_x@/.test(localPart) &&                   
      !/%[0-9A-Fa-f]{2}/.test(email) &&                  
      !/^your[a-z]+@/i.test(email)                       
    );
  });

  return emails;
};
