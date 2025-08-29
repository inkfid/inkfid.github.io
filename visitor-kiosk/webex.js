let currentSearchNumber = 0;

const webexMsgUrl = 'https://webexapis.com/v1/messages';
const webexSearchUrl = 'https://webexapis.com/v1/people?displayName=';

async function get(url, token) {
  if (!token) throw(new Error('No webex token specified'));

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  try {
    const data = await fetch(url, options);
    const json = await data.json();
    return json.items || [];
  }
  catch(e) {
    console.log('not able to fetch');
    return [];
  }
}

function sendMessage(token, toPersonEmail, markdown, file) {
  const formData = new FormData();
  if (file) {
    formData.append('files', file);
  }
  formData.set('markdown', markdown);
  formData.set('toPersonEmail', toPersonEmail);

  const options = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
    method: 'POST',
    body: formData,
  };

  return fetch(webexMsgUrl, options);
}

function mockResult(keyword) {
  const img = Math.ceil(Math.random() * 60);
  return [
    {
      displayName: `${keyword} Johnson`,
      avatar: `https://i.pravatar.cc/500?img=${img}`,
      emails: [`${keyword}@acme.com`],
    },
  ];
}

// async function searchPerson(keyword, token, callback) {
//  if (!keyword) return;
//  if (!token) {
//    callback(mockResult(keyword));
//    return;
//  }

//  currentSearchNumber++;
//  const id = currentSearchNumber; // avoid closure
//  const url = webexSearchUrl + keyword;
//  const result = await get(url, token);

//  // a newer search has been requested, discard this one
//  if (id < currentSearchNumber) {
//    return;
//  }

//  callback(result);
//}

// Trying to limit search results to a sepcific location
async function searchPerson(keyword, token, callback) {
  if (!keyword) return;
  if (!token) {
    callback(mockResult(keyword));
    return;
  }

  currentSearchNumber++;
  const id = currentSearchNumber; // avoid closure
  const locationID = '6c3c60d9-f595-42dd-8fba-96c2d6811cc0';
  const url = '${webexSearchUrl}${encodeURIComponent(keyword) }&locationId=${locationId}'; + keyword;
  const result = await get(url, token);

  // a newer search has been requested, discard this one
  if (id < currentSearchNumber) {
    return;
  }

  callback(result);
}
