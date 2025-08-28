// Added by DF to try and create a new function
// send a message to a pre-defined webex space for deliveries

const webexMsgUrlDF = 'https://webexapis.com/v1/messages';
const token = getToken();  // Assuming getToken is defined somewhere
const roomId = "Y2lzY29zcGFyazovL3VzL1JPT00vODBlY2Q5YjAtNTk5MC0xMWVhLWFlZGQtOGQxMWJmYzkxNGNm";
const markdown = "A delivery has arrived at reception.";
const message = "A delivery has arrived at reception.";

function sendDeliveryMessage(token, roomId, markdown, message) {
  const formData = new FormData();
  formData.set('markdown', markdown);
  formData.set('roomId', roomId);
  formData.set('text', message);

  const options = {
    headers: {
      Authorization: 'Bearer ' + token,
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

// Call the function
sendDeliveryMessage(token, roomId, markdown, message);
