export async function sendCardMessage(token, toPersonEmail, cardJson) {
  const body = {
    toPersonEmail,
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: cardJson
      }
    ]
  };

  return fetch("https://webexapis.com/v1/messages", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}