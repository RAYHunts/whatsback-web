const { phoneNumberFormatter } = require("../../helper");
const { client } = require("../../whatsapp-client");

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
