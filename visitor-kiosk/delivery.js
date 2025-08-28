// Added by DF to try and create a new function
// send a message to a pre-defined webex space for deliveries
function sendDeliveryMessage() {
  alert("Deliverymessagesent!");
}
const webexMsgUrlDF = 'https://webexapis.com/v1/messages';
const token = this.getToken();
const roomId = "Y2lzY29zcGFyazovL3VzL1JPT00vODBlY2Q5YjAtNTk5MC0xMWVhLWFlZGQtOGQxMWJmYzkxNGNm";
const message = "A delivery has arrived at reception.";

sendDeliveryMessage(token, roomId, markdown, message) {
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
  return fetch(webexMsgUrlDF, options);
}
