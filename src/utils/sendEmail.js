const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, senderName) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: ["139kumargaurav@gmail.com"],
      ToAddresses: [toAddress],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h2>You got an request from ${senderName}<h2>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `You got an request from ${senderName}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Congratulations! You have received a friend request",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (receiverEmail, senderName) => {
  const sendEmailCommand = createSendEmailCommand(
    receiverEmail,
    "ctc-buddy@chattocode.in",
    senderName
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { run };
