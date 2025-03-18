import { NextApiRequest, NextApiResponse } from "next";
import * as crypto from "crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Generate a temporary token
  const token = crypto.randomBytes(16).toString('hex');
  
  // Set an expiry time (e.g., 15 minutes from now)
  const expiryTime = Date.now() + 15 * 60 * 1000;
  
  // Store this token server-side (in memory for now)
  // This is a simple implementation - you might want to use a more robust solution
  global.validTokens = global.validTokens || {};
  global.validTokens[token] = expiryTime;
  
  // Clean up expired tokens
  Object.keys(global.validTokens).forEach(key => {
    if (global.validTokens[key] < Date.now()) {
      delete global.validTokens[key];
    }
  });
  
  // Return the token to the client
  return res.status(200).json({ token });
}