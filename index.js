//Import require dependencies
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

//Call express
const app = express();
const token = process.env.TOKEN;
const mytoken = process.env.MY_TOKEN;

//use bodyparser middlewere to get the data in JSON format
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Runing server at defined port
app.listen(PORT, () => {
  console.log(`Server is listening at : ${PORT}`);
});

//to verify the callback url from dashboard url from dashboard side -cloud api side
app.get("/webhook", (req, res) => {
  let mode = req.query[hub.mode];
  let challenge = req.query[hub.challenge];
  let verify_token = req.query[hub.verify_token];

  if (mode && token) {
    if (mode === "subscribe" && verify_token === mytoken) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  let bodyParam = req.body;
  console.log(JSON.stringify(bodyParam, null, 2));

  if (bodyParam.object) {
    if (
      bodyParam.entry &&
      bodyParam.entry[0].changes &&
      bodyParam.entry[0].changes[0].value.messages &&
      bodyParam.entry[0].changes[0].value.messages[0]
    ) {
      let phoneNoId =
        bodyParam.entry[0].changes[0].value.metadata.phone_number_id;
      let from = bodyParam.entry[0].changes[0].value.messages[0].from;
      let msgBody = bodyParam.entry[0].changes[0].value.messages[0].text.body;

      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v17.0/" +
          phoneNoId +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi... I am Debabrata Paul",
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});
