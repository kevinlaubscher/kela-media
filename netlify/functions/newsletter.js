exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, name } = JSON.parse(event.body);

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      email,
      attributes: { FIRSTNAME: name },
      listIds: [parseInt(process.env.BREVO_LIST_ID)],
      updateEnabled: true
    })
  });

  if (response.ok || response.status === 204) {
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } else {
    return { statusCode: 400, body: JSON.stringify({ success: false }) };
  }
};