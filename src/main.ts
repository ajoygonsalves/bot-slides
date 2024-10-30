import authorize from "./auth";
import { findAllVariables } from "./findAllVariables";
import { replaceAllText } from "./replaceAllText";
import { copyPresentation } from "./copyPresentation";
import "dotenv/config";

const template_id = process.env.PRESENTATION_ID as string;

async function main() {
  await authorize();

  // Make a copy of the template presentation - with a new title
  await copyPresentation(template_id, "Simple presentation");

  // Get the ID of the new presentation
  // const newPresentationId = createNewPresentation.id;

  // // Find all the variables in the new presentation
  // const variables = await findAllVariables(newPresentationId as string);

  // console.log(variables);

  // // Replace all the variables in the new presentation
  // const updatedPresentation = await replaceAllText(
  //   newPresentationId as string,
  //   {
  //     test: "hello world!",
  //   }
  // );
}

main();
