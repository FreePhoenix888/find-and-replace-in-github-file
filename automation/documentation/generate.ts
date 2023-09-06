import { generateDocumentation } from "@deep-foundation/npm-automation";

main();

async function main() {
  await generateDocumentation({
    generateCliAppsHelpInReadmeOptions: undefined,
    generateUsageWaysOfNpmCliAppsInMarkdownFormatOptions: undefined,
    generateTableOfContentsForMarkdownOptions: null,
  });
}
