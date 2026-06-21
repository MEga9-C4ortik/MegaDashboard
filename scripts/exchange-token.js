require('dotenv').config({ path: '.env' });
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

async function main() {
    const { tokens } = await oauth2Client.getToken('4/0AdkVLPyO_oUP1VOvSFRs8ayRGIHpyb_5VQoDPr8jxcKtPpDomvHxIvjpWiPrWlJ3Sz5glw');
    console.log(tokens);
}

main();