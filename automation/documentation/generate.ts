import { generateDocumentation } from "@deep-foundation/npm-automation";
import fsExtra from 'fs-extra'
import path from 'path'

main();

async function main() {
  const files = fsExtra.readdirSync(path.resolve(process.cwd(), 'dist', 'cli'));
  const writeMode = '755'
  for (const file of files) {
    fsExtra.chmodSync(file, writeMode)
  }

  await generateDocumentation({
    generateCliAppsHelpInReadmeOptions: undefined,
    generateUsageWaysOfNpmCliAppsInMarkdownFormatOptions: undefined,
    generateTableOfContentsForMarkdownOptions: null,
  });
}
