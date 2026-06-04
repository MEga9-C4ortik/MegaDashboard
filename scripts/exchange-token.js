const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

async function main() {
    const { tokens } = await oauth2Client.getToken('4/0AeoWuM9IQ0O9JRem5dljfuFOQDnpN4MuTfrJIfHBLC8KRalt2CNbO35cjcLnG4B8a1JiGw');
    console.log(tokens);
}

main();