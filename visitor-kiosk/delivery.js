// Added by DF to try and create a new function
// send a message to a pre-defined webex space for deliveries
sendDeliveryMessage() {
  const token = this.getToken();
  const roomId = "Y2lzY29zcGFyazovL3VzL1JPT00vODBlY2Q5YjAtNTk5MC0xMWVhLWFlZGQtOGQxMWJmYzkxNGNm";
  const message = "A delivery has arrived at reception.";

  if (!token) {
    alert("No Webex token available!");
    return;
  }

  fetch("https://webexapis.com/v1/messages", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
   },
    body: JSON.stringify({
      roomId: roomId,
      text: message
    })
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    })
    .then(() => {
      alert("Delivery notification sent!");
    })
    .catch((error) => {
      alert("Failed to send delivery notification: " + error.message);
    });
},
