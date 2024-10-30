/**
 * Copys a Google Slide presentation.
 * @param {string} presentationId The presentation to copy.
 * @param {string} copyTitle The new title.
 */

import authorize from "./auth";
import { google } from "googleapis";
import "dotenv/config";
import { OAuth2Client } from "google-auth-library";
import { config } from "dotenv";

config();

const template_id = process.env.PRESENTATION_ID;

export async function copyPresentation(
  presentationId: string,
  copyTitle: string
) {
  const auth = await authorize();
  const service = google.drive({
    version: "v3",
    auth: auth as unknown as OAuth2Client,
  });

  try {
    const driveResponse = await service.files.copy({
      fileId: presentationId,
      supportsAllDrives: true,
      requestBody: {
        name: copyTitle,
      },
    });
    const presentationCopyId = driveResponse.data.id;
    console.log("Created copied presentation with ID: " + presentationCopyId);
    return await driveResponse.data;
  } catch (err) {
    throw err;
  }
}

// Sample usage
// copyPresentation(template_id as string, "Test Presentation");
