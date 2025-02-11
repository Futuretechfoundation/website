// Import dependencies if needed (e.g., for database connections)
import { writeFile } from 'fs/promises'; // For simple file storage (temporary, replace with a DB later)
import path from 'path';

// Handler function for the API
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { slackHandle, membership } = req.body;

      // Basic validation
      if (!slackHandle || !membership) {
        return res.status(400).json({ error: 'Slack handle and membership type are required.' });
      }

      // Save data to a file (temporary solution, replace with DB)
      const filePath = path.join(process.cwd(), 'data', 'members.json');

      // Read existing data if available
      let existingData = [];
      try {
        const data = await readFile(filePath, 'utf-8');
        existingData = JSON.parse(data);
      } catch (err) {
        console.log('No existing data found. Creating a new file.');
      }

      // Append new member
      existingData.push({ slackHandle, membership, registeredAt: new Date() });

      // Write updated data back
      await writeFile(filePath, JSON.stringify(existingData, null, 2));

      // Respond with success
      res.status(200).json({ message: 'Registration successful!' });
    } catch (error) {
      console.error('Error saving registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
