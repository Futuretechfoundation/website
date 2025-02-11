import { MongoClient } from 'mongodb';

// MongoDB URI and Client Setup
const uri = process.env.MONGODB_URI; // Store your MongoDB URI in an environment variable
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { slack_handle, membership } = req.body;

    if (!slack_handle || !membership) {
      console.error("Missing required fields");
      return res.status(400).json({ error: 'Slack handle and membership are required.' });
    }

    try {
      // Connect to the MongoDB client
      await client.connect();

      // Access the FuturetechDB database and the members collection
      const database = client.db('FuturetechDB');
      const collection = database.collection('members');

      // Create a new member document
      const newMember = {
        slack_handle,
        membership,
        payment_status: "Pending",
      };

      // Insert the new member into the MongoDB collection
      const result = await collection.insertOne(newMember);

      return res.status(200).json({ message: 'Registration successful', memberId: result.insertedId });
    } catch (error) {
      console.error("Error inserting to MongoDB:", error);
      return res.status(500).json({ error: 'Server error. Check logs.' });
    } finally {
      // Close the MongoDB connection
      await client.close();
    }
  } else {
    console.error("Invalid request method");
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
    }
