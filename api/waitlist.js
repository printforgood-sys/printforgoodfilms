import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, business, website } = req.body;

  // Validate required fields
  if (!name || !email || !business) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'printforgood@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: 'paul@pfgailabs.com',
      to: 'paul@pfgailabs.com',
      subject: 'New ClearPath Waitlist Submission',
      html: `
        <h2>New ClearPath Waitlist Signup</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Business Name:</strong> ${escapeHtml(business)}</p>
        <p><strong>Website:</strong> ${website ? escapeHtml(website) : 'Not provided'}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Submission received. We\'ll be in touch within 48 hours.' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to submit. Please try again.' });
  }
}

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
