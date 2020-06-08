require('dotenv').config();
messenger = require('./src/messenger');

const 
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json());

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

/**
 * Webhook challenge endpoint
 */
app.get('/webhook', (req, res) => {
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if(mode && token) {
	// Checks the mode and token sent is correct
        if(mode == 'subscribe' && token == VERIFY_TOKEN) {
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});


/**
 * Messenger webhook endpoint
 */
app.post('/webhook', (req, res) => {
    let body = req.body;
    // Checks this is an event from a page subscription
    if(body.object === 'page') {
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {
            // entry.messaging is an array, but will only ever contain one message
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;

            // check what type of webhook_event it is
            if (webhook_event.hasOwnProperty("message")) {
                messenger.handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.hasOwnProperty("postback")) {
                messenger.handlePostback(sender_psid, webhook_event.postback);
            } else {
                console.log("Error: do not know what type of webhook_event this is"); // TODO: add error handling
            }

        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

