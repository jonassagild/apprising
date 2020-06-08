axios = require('axios');

// access environment variables
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const SEND_API = process.env.SEND_API;

/**
 * Calls the Messenger API to send the message
 */
function callSendAPI(psid, message) {
    let data = { 
        "recipient": { "id": psid }, 
        "message": message 
    };
    return axios({
        method: 'POST',
        url: SEND_API,
        params: { access_token: PAGE_ACCESS_TOKEN },
        data: data
    })
    .catch((error) => {
        if (error.response) {
            console.log('PSID: ', psid);
            console.log('Status code: ', error.response.status);
            console.log('Response: ', error.response.data);
        } else if (error.request) {
            console.log('Request: ', error.request); 
        } else {
            console.log('Error: ', error.message);
        }
    });
}


/**
 * Incoming Message Handler
 */
function handleMessage(sender_psid, received_message) {
    // TODO: check whether this is the first message in a while (somehow)
    // assumes this has been checked
    // send welcome message
    let first_message = true;
    let message = "";
    if (first_message) {
        message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "Welcome! Do you want to play now?",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Start a new game",
                                "payload": "start_new_game"
                            },
                            {
                                "type": "postback",
                                "title": "Join a game",
                                "payload": "join_a_game"
                            },
                            {
                                "type": "postback",
                                "title": "Not right now.",
                                "payload": "something"
                            }
                        ]
                    }
                }
            }
    } else {
        message = {
            "text": received_message.text.toLowerCase()
        };
    }
    callSendAPI(sender_psid, message);
}


/**
 * Incoming postback handler
 *
 * @param sender_psid
 * @param postback
 */
function handlePostback(sender_psid, postback) {
    // TODO: implement
    // to test, send a message
    let message = {
        "text": "PostBack event received"
    };
    callSendAPI(sender_psid, message);
}

module.exports = {
    handleMessage: handleMessage,
    handlePostback: handlePostback,
}
