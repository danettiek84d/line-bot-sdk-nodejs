'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: "D0IiGzATJEyKVk7gZFohlSQijK7YnGeWyd3G63TyD23PC2BgYSJQb7cgSbyQ3Ez8EiSBpTo6/O4MF/IlkASlVUDTiQqJiIee6ss1bND+CBQkBi8GHLMvrXxvhSYF/JfkSlz3zQ/wvRTnjwzUIO58CAdB04t89/1O/w1cDnyilFU=",
  channelSecret: "cdb5490f1175370d36840378f858b420",
};

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: "D0IiGzATJEyKVk7gZFohlSQijK7YnGeWyd3G63TyD23PC2BgYSJQb7cgSbyQ3Ez8EiSBpTo6/O4MF/IlkASlVUDTiQqJiIee6ss1bND+CBQkBi8GHLMvrXxvhSYF/JfkSlz3zQ/wvRTnjwzUIO58CAdB04t89/1O/w1cDnyilFU="
});

// create Express app
// about Express itself: https://expressjs.com/
const app = express();
app.get("/",(req,rep)=>{

rep.end("hello 2034");
});

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create an echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo],
  });
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
