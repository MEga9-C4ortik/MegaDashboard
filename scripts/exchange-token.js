require('dotenv').config({ path: '.env' });
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

async function main() {
    const { tokens } = await oauth2Client.getToken('4/0AdkVLPwlNF2yPCSpk63H_P9ZxrKO81HP0_zoAzL2DzbNY9iMA__EU5Z3VxV3gxwoTR9kpg');
    console.log(tokens);
}

main();