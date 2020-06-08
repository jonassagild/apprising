axios = require('axios');
templates = require('./templates');
constants = require('./constants');

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
    .catch((error) => {message = {
                "text": constants.ERROR_MSG
            }
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
        message = createFirstMessage();
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
    let message = "";

    // implement join a game and start a new game
    if (postback.payload == "start_new_game") {
        // todo
        message = {
            "text": "Superb! Please write a name that you wish to use during the game. You may forward the next message" +
                " to the people that you wish to play with. "
        };
        callSendAPI(sender_psid, message);
        message = {
            "text": "Hi! Someone invited you to play. Send a message to apprising on facebook to join, and use the code" +
                " blalbalba to join the game."
        };
        callSendAPI(sender_psid, message);

    } else if (postback.payload == "join_a_game") {
        // todo
        message = {
            "text": "Superb! Please write a name that you wish to use during the game."
        };
        callSendAPI(sender_psid, message);
    } else if (postback.payload == "not_right_now") {
        // todo
        message = {
            "text": "We hope to see you again! "
        };
        callSendAPI(sender_psid, message);

    } else {
        message = {
            "text": constants.ERROR_MSG
        };
        callSendAPI(sender_psid, message);

    }
}

/**
 *
 * @returns {{attachment: {payload: {buttons: *, template_type: string, text: *}, type: string}}}
 */
function createFirstMessage() {
    let buttons = [
        templates.postbackButtonTemplate("Start a new game", "start_new_game"),
        templates.postbackButtonTemplate("Join a game", "join_game"),
        templates.postbackButtonTemplate("Not right now.", "not_right_now")
    ];
    let message = templates.buttonTemplate(constants.WELCOME_MSG, buttons);
    return message;
}


module.exports = {
    handleMessage: handleMessage,
    handlePostback: handlePostback,
}
