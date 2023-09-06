import { Octokit } from '@octokit/rest';
import debug from 'debug';

const log = debug('find-and-replace-in-github-file');

/**
 * Finds and replaces text in a file hosted on a GitHub repository.
 *
 * @example
 * #### Find and replace text in a file hosted on a GitHub repository
 * ```typescript
 * const octokit = new Octokit({ auth: "your-github-token" });
 * await findAndReplaceInGithubFile({
 *   octokit,
 *   owner: "username",
 *   repo: "repository",
 *   path: "path/to/file.txt",
 *   regex: /findMe/g,
 *   replacement: "replaceWithMe",
 *   commitMessage: "Replaced 'findMe' with 'replaceWithMe'"
 * });
 * ```
 *
 * @throws Will throw an error if any GitHub API request fails (except for 404 errors, which only log a warning).
 */
export async function findAndReplaceInGithubFile(options: FindAndReplaceInGithubFileOptions) {
  const { octokit, owner, repo, path, regex, replacement, commitMessage } = options;
  
  const fileResponse = await octokit.repos.getContent({ owner, repo, path }).catch(error => {
    log('Error:', error);
    if (error.status === 404) {
      return null;
    }
    throw error;
  });

  log('FileResponse:', fileResponse);

  if (fileResponse && Array.isArray(fileResponse.data)) {
    log(`Skipped repo ${repo}, ${path} appears to be a directory`);
    return;
  }

  if (!fileResponse || !('content' in fileResponse.data)) {
    log(`Skipped repo ${repo}, ${path} not found`);
    return;
  }

  let content = Buffer.from(fileResponse.data.content, 'base64').toString('utf-8');
  log('Original Content:', content);

  content = content.replace(regex, replacement);
  log('Updated Content:', content);

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: fileResponse.data.path,
    message: commitMessage,
    content: Buffer.from(content).toString('base64'),
    sha: fileResponse.data.sha,
  });

  log(`Updated file in repo ${repo}: ${fileResponse.data.path}`);
};

export interface FindAndReplaceInGithubFileOptions {
  /**
   * An instance of the Octokit client.
   */
  octokit: Octokit;

  /**
   * GitHub username or organization that owns the repository.
   */
  owner: string;

  /**
   * The name of the GitHub repository.
   */
  repo: string;

  /**
   * The file path in the repository to find and replace text in.
   */
  path: string;

  /**
   * The regular expression used to find the text to be replaced.
   */
  regex: RegExp;

  /**
   * The text that will replace the text found using the `regex`.
   */
  replacement: string;

  /**
   * The commit message for the changes.
   */
  commitMessage: string;
}