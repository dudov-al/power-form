const express = require("express");
const router = express.Router();
const { check, validationResult, matchedData } = require("express-validator");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { promisify } = require("util");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });

const creds = require("../client_secret.json");

router.get("/contact", csrfProtection, (req, res) => {
  res.render("contact", {
    data: {},
    errors: {},
    csrfToken: req.csrfToken(),
  });
});

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/", (req, res) => {
  res.render("contact", {
    data: req.body, // { message, email }
    errors: {
      message: {
        msg: "A message is required",
      },
      email: {
        msg: "That email doesn‘t look right",
      },
    },
  });
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    data: {},
    errors: {},
  });
});

router.post(
  "/contact",
  [
    check("message")
      .isLength({ min: 1 })
      .withMessage("Message is required")
      .trim(),
    check("email")
      .isEmail()
      .withMessage("That email doesn‘t look right")
      .bail()
      .trim()
      .normalizeEmail(),
    check("address").trim(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("contact", {
        data: req.body,
        errors: errors.mapped(),
      });
    }

    const data = matchedData(req);
    console.log("Sanitized: ", data, "REq",req);
    // Homework: send sanitized data in an email or persist to a db

    req.flash("success", "Thanks for the message! I‘ll be in touch :)");
    res.redirect("/");
    async function accessSpreadsheet() {
      const doc = new GoogleSpreadsheet(
        "1wVMiLTJCvK1gvBAg79XyaWphYeYXv83g_VjMW8FbZCQ"
      );
    
      await doc.useServiceAccountAuth(require("../client_secret.json"));
      await doc.loadInfo(); // loads document properties and worksheets
      console.log(doc.title);
    
      const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
    
      const larryRow = await sheet.addRow({
        Name: "Sergey",
        Email: data.email,
        Telegram: req.body.telegram,
        Twitter: "qwe",
        "ETH address": data.address,
        Liquidity: "asfasf",
        Contribution: data.message,
      });
    }
    
    accessSpreadsheet();
  }
);
module.exports = router;


