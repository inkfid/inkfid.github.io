//Added by DF - Send a message to a pre-defined space when the deliveries button is pressed.  The BOT must be a member of the space.

const webexMsgUrlDF = 'https://webexapis.com/v1/messages';
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

// Register with Alpine
document.addEventListener('alpine:init', () => {
  Alpine.data('dataModel', (original = {}) => ({
    ...original,
    sendDeliveryMessage() {
      const token = getToken();
      sendDeliveryMessage(token, roomId, markdown, message);
    }
  }));
});
