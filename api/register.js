import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const filePath = path.resolve('.', 'database.json');
    
    // Read existing data or create an empty array
    const existingData = fs.existsSync(filePath) 
      ? JSON.parse(fs.readFileSync(filePath, 'utf8'))
      : [];

    // Append new member data
    const newData = {
      slackHandle: req.body.slackHandle,
      membership: req.body.membership,
      walletAddress: req.body.walletAddress || '',
      paymentStatus: req.body.paymentStatus || 'Pending',
    };
    existingData.push(newData);

    // Save to "database.json"
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    res.status(200).json({ message: 'Registration successful!' });
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed.' });
  }
}
