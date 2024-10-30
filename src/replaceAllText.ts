import { google } from "googleapis";
import authorize from "./auth";

export async function replaceAllText(
  presentationId: string,
  variablesToReplace: Record<string, string>
) {
  const auth = await authorize();
  const slideService = google.slides({ version: "v1", auth });

  try {
    const presentation = await slideService.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests: Object.keys(variablesToReplace).map((key) => {
          return {
            replaceAllText: {
              replaceText: variablesToReplace[key],
              containsText: {
                text: `<<${key}>>`,
                matchCase: false,
              },
            },
          };
        }),
      },
    });

    return presentation;
  } catch (e) {
    console.log("Error in replaceAllText.js: ", e);
  }
}
