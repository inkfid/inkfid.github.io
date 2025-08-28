// Added by DF to try and create a new function
// send a message to a pre-defined webex space for deliveries

const webexMsgUrlDF = 'https://webexapis.com/v1/messages';
// this was working - const token = getToken();  // Assuming getToken is defined somewhere all references that are deliveryToken WERE token
const deliveryToken = "OTA4MDRhNjItMzQ3Yy00ZGIzLWEyNTYtODg1N2RjYmIyNjU1N2RlOTM3ODUtOTRk_PF84_895155b7-cc7a-426c-bb66-768bd3be1b8e";
const roomId = "Y2lzY29zcGFyazovL3VzL1JPT00vODBlY2Q5YjAtNTk5MC0xMWVhLWFlZGQtOGQxMWJmYzkxNGNm";
const markdown = "A delivery has arrived at reception.";
const message = "A parcel has been left at reception.";

function sendDeliveryMessage(deliveryToken, roomId, markdown, message) {
  const formData = new FormData();
  // formData.set('markdown', markdown);
  formData.set('roomId', roomId);
  formData.set('text', message);

  const options = {
    headers: {
      Authorization: 'Bearer ' + deliveryToken,
    },
    method: 'POST',
    body: formData,
  };

  return fetch(webexMsgUrlDF, options)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.json();
    })
    .then(data => {
      console.log("Message sent successfully:", data);
    })
    .catch(error => {
      console.error("Error sending message:", error);
    });
}

// Call the function - the sends the message on page load!
// sendDeliveryMessage(token, roomId, markdown, message);
