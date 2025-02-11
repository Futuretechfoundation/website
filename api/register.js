import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { slack_handle, membership } = req.body;

    if (!slack_handle || !membership) {
      return res.status(400).json({ error: 'Slack handle and membership are required.' });
    }

    const filePath = path.join(process.cwd(), 'data', 'members.json');

    try {
      let members = [];
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        members = JSON.parse(fileData);
      }

      members.push({ slack_handle, membership, payment_status: "Pending" });

      fs.writeFileSync(filePath, JSON.stringify(members, null, 2));

      return res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
        }
