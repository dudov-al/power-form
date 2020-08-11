const { GoogleSpreadsheet } = require("google-spreadsheet");
const { promisify } = require("util");

const creds = require("./client_secret.json");

async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet(
    "1wVMiLTJCvK1gvBAg79XyaWphYeYXv83g_VjMW8FbZCQ"
  );
  
  await doc.useServiceAccountAuth(require("./client_secret.json"));
  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]

  const larryRow = await sheet.addRow({
    Name: "Larry Page",
    Email: "larry@google.com",
    Telegram: "My",
    Twitter: "qwe",
    "ETH address": "sdfsf",
    Liquidity: "asfasf",
    Contribution: "fsfa",
  });
  
}

accessSpreadsheet();
