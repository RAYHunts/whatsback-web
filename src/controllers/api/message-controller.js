const { phoneNumberFormatter } = require("../../helper");
const { client } = require("../../whatsapp-client");

/**
 * @api {post} /send-message Send message to user
 * @apiName sendMessageToUser
 * @apiGroup WhatsApp API
 *
 * @apiParam {string} number Recipient phone number
 * @apiParam {string} message Message text to send
 *
 * @apiSuccess {boolean} status Success status
 * @apiSuccess {string} message Success message
 *
 * @apiError {boolean} status Error status
 * @apiError {string} message Error message
 *
 * @apiExample {curl} Example usage:
 *     curl -X POST \
 *     http://localhost:5001/api/send-message \
 *     -H 'Content-Type: application/json' \
 *     -d '{"number": "+628123456789", "message": "Hello from WhatsApp"}'
 *
 * @apiSampleRequest off
 */
const sendMessageToUser = async (req, res) => {
  try {
    const { number, message } = req.body;

    const phoneNumber = phoneNumberFormatter(number);
    await client.sendMessage(phoneNumber, message);

    res.status(200).json({
      status: true,
      message: `Message sent`,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `API Error - ${error}`,
    });
  }
};

/**
 * Sends a message to a specified WhatsApp group.
 *
 * @param {Object} req - The request object containing the groupId and message.
 * @param {Object} res - The response object used to send the result of the operation.
 * 
 * @api {post} /send-group-message Send message to group
 * @apiName sendMessageToGroup
 * @apiGroup WhatsApp API
 *
 * @apiParam {string} groupId Group ID to which the message is sent.
 * @apiParam {string} message Message text to send.
 *
 * @apiSuccess {boolean} status Success status.
 * @apiSuccess {string} message Success message indicating the message was sent.
 *
 * @apiError {boolean} status Error status.
 * @apiError {string} message Error message describing the failure.
 *
 * @apiExample {curl} Example usage:
 *     curl -X POST \
 *     http://localhost:5001/api/send-group-message \
 *     -H 'Content-Type: application/json' \
 *     -d '{"groupId": "<group-id>@g.us", "message": "Hello Group"}'
 *
 * Validates the groupId to ensure it ends with "@g.us".
 * Logs an error if the validation fails and returns a 422 status code.
 * Sends the message using the WhatsApp client.
 * Returns a 200 status code upon successful sending.
 * Handles errors and sends a 500 status code with an error message.
 */

const sendMessageToGroup = async (req, res) => {
  try {
    const { groupId, message } = req.body;

    if (!groupId.endsWith("@g.us")) {
      res.status(422).json({
        status: false,
        message: `Message sent to group`,
      });
      serverLog("Invalid group ID. Group IDs must end with '@g.us'.");
    }

    await client.sendMessage(groupId, message);

    res.status(200).json({
      status: true,
      message: `Message sent to group`,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `API Error - ${error.message}`,
    });
  }
};

module.exports = { sendMessageToUser, sendMessageToGroup };
