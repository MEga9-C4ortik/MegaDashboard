require('dotenv').config({ path: '.env' });
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

async function main() {
    const { tokens } = await oauth2Client.getToken('4/0AdkVLPzEvFlJ_r5Kk4joTR_l9GfPzYUn_9uWGgEM0X2Cit8lyQ9aoDPiPiSz-iZMEd_now');
    console.log(tokens);
}

main();