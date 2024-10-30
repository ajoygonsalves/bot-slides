import fs from "fs/promises"; // Using fs/promises for async compatibility
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/presentations",
];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, "utf8");
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials) as unknown as OAuth2Client;
  } catch (err) {
    console.error("Error loading saved credentials:", err);
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: OAuth2Client): Promise<void> {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH, "utf8");
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
    console.log("Credentials saved to", TOKEN_PATH);
  } catch (err) {
    console.error("Error saving credentials:", err);
  }
}

/**
 * Load or request authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }

  try {
    const authClient = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    if (authClient.credentials) {
      await saveCredentials(authClient as OAuth2Client);
    }
    return authClient as OAuth2Client;
  } catch (err) {
    console.error("Error during authorization:", err);
  }
}

export default authorize;
