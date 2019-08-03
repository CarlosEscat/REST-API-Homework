const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
let times = 0;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fiveMessagesMiddleware = (req, res, next) => {
  times += 1;
  if (times <= 5) {
    console.log("You have logged " + times + " messages");
    console.log(req.body);
    const text = req.body;

    if (!text || text === "") {
      res.status(400).send({
        message: "Bad Request"
      });
    } else {
      res.json({
        message: "Message received loud and clear"
      });
    }
  } else {
    console.log("You have logged more than 5 messages");
    res.status(429).send({
      message: "Too Many Requests"
    });
  }
};

app.post("/messages", fiveMessagesMiddleware, (req, res) => {});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
