
// TODO: make button template

/**
 *
 * @param title
 * @param payload
 * @returns {{payload: *, type: string, title: *}}
 */
function postbackButtonTemplate(title, payload) {
    return {
        "type": "postback",
        "title": title,
        "payload": payload,
    }
}

/**
 *
 * @param text
 * @param buttons
 * @returns {{attachment: {payload: {buttons: *, template_type: string, text: *}, type: string}}}
 */
function buttonTemplate(text, buttons) {
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": text,
                "buttons": buttons
            }
        }
    }
}

module.exports = {
    postbackButtonTemplate: postbackButtonTemplate,
    buttonTemplate: buttonTemplate,

};