export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
    }

    const emailPayload = {
      name: name.trim(),
      email: email.trim(),
      _subject: `[QRHub Inquiry] ${(subject || 'No Subject').trim()} (from ${name.trim()})`,
      message: message.trim(),
      _cc: 'm.quddous7271@gmail.com',
      _template: 'table',
      _captcha: 'false',
    };

    try {
      await fetch('https://formsubmit.co/ajax/m.quddous7172@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });
    } catch (mailErr) {
      console.error('Email dispatch error:', mailErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      id: Date.now().toString(),
    });
  } catch (err) {
    console.error('Error handling contact submission:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error processing message.',
    });
  }
}
