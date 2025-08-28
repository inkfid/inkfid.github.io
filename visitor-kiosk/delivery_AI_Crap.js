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
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const deliveryButton = document.querySelector('button[class*="secondary"][@click="sendDeliveryMessage()"]');
  const feedbackDiv = document.createElement('div');
  feedbackDiv.id = 'delivery-feedback';
  feedbackDiv.style.marginTop = '10px';
  feedbackDiv.style.color = 'green';
  feedbackDiv.style.fontWeight = 'bold';
  deliveryButton?.parentNode?.appendChild(feedbackDiv);

  window.sendDeliveryMessage = function () {
    const token = getToken?.();
    if (!token) {
      feedbackDiv.textContent = 'No token found.';
      feedbackDiv.style.color = 'red';
      return;
    }

    feedbackDiv.textContent = 'Sending delivery message...';
    feedbackDiv.style.color = 'black';

    sendDeliveryMessage(token, roomId, markdown, message)
      .then(data => {
        feedbackDiv.textContent = 'Delivery message sent successfully!';
        feedbackDiv.style.color = 'green';
      })
      .catch(error => {
        feedbackDiv.textContent = 'Failed to send delivery message.';
        feedbackDiv.style.color = 'red';
        console.error(error);
      });
  };

