import { google } from "googleapis";
import authorize from "./auth";
import "dotenv/config";

export async function findAllVariables(presentationId: string) {
  const auth = await authorize();
  const slideService = google.slides({ version: "v1", auth });

  let variables: Record<string, string> = {};

  try {
    // Fetch the presentation
    const presentation = await slideService.presentations.get({
      presentationId,
    });

    const slides = presentation.data.slides;
    if (!slides) {
      console.log("No slides found.");
      return;
    }

    const placeholderRegex = /<<([^>>]+)>>/g;
    const placeholders = new Set<string>();

    slides.forEach((slide, slideIndex) => {
      console.log(`Slide ${slideIndex + 1}:`);
      if (slide.pageElements && Array.isArray(slide.pageElements)) {
        slide.pageElements.forEach((element) => {
          // Check for text in shapes (normal text boxes)
          if (
            element.shape &&
            element.shape.text &&
            Array.isArray(element.shape.text.textElements)
          ) {
            element.shape.text.textElements.forEach((textElement) => {
              if (textElement.textRun && textElement.textRun.content) {
                const matches =
                  textElement.textRun.content.matchAll(placeholderRegex);
                for (const match of matches) {
                  const variable = match[1]; // Capture the inside of <<Title>>
                  placeholders.add(variable);
                  console.log(`  Found placeholder: ${variable}`);
                }
              }
            });
          }

          // Check for text in table cells
          if (
            element.table &&
            Array.isArray(element.table.tableRows) &&
            element.table.tableRows.length > 0
          ) {
            element.table.tableRows.forEach((row, rowIndex) => {
              if (Array.isArray(row.tableCells)) {
                row.tableCells.forEach((cell, cellIndex) => {
                  if (cell.text && Array.isArray(cell.text.textElements)) {
                    cell.text.textElements.forEach((textElement) => {
                      if (textElement.textRun && textElement.textRun.content) {
                        const matches =
                          textElement.textRun.content.matchAll(
                            placeholderRegex
                          );
                        for (const match of matches) {
                          const variable = match[1]; // Capture the inside of <<Title>>
                          placeholders.add(variable);
                          console.log(
                            `  Found placeholder in table (Row ${
                              rowIndex + 1
                            }, Cell ${cellIndex + 1}): ${variable}`
                          );
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });

    if (placeholders.size === 0) {
      console.log("No placeholders found.");
    } else {
      console.log("\nAll placeholders found in the presentation:");
      placeholders.forEach((placeholder) => (variables[placeholder] = ""));
    }

    return variables;
  } catch (error) {
    console.error("Error fetching presentation:", error);
  }
}

// Example usage:
findAllVariables(process.env.PRESENTATION_ID as string)
  .then((variables) => console.log(variables))
  .catch((error) => console.error(error));
