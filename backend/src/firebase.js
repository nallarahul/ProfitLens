// This module handles the connection to Firebase Firestore using the JSON key file.
// This version uses the Node.js 'fs' module for maximum compatibility.

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// A helper function to get the correct path to the JSON file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // 1. Read the service account key file synchronously.
  const serviceAccountRaw = readFileSync(join(__dirname, '../serviceAccountKey.json'));

  // 2. Parse the file content into a JavaScript object.
  const serviceAccount = JSON.parse(serviceAccountRaw);

  // 3. Initialize the Firebase Admin SDK with your service account credentials.
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('🔥 FATAL ERROR: "serviceAccountKey.json" not found. Please ensure the file is in the root directory.');
  } else {
    console.error('🔥 FATAL ERROR: Could not initialize Firebase. The "serviceAccountKey.json" file may be corrupt or invalid.', error);
  }
  process.exit(1);
}

// 4. Get a reference to our Firestore database.
const db = admin.firestore();

console.log('✅ Firebase Firestore connected successfully using JSON key file.');

// 5. Export the database connection for use in other files.
export { db };

