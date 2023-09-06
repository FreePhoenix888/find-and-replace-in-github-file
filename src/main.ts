import { Octokit } from '@octokit/rest';
import debug from 'debug';

const log = debug('find-and-replace-in-github-file');

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
  octokit: Octokit;
  owner: string;
  repo: string;
  path: string;
  regex: RegExp;
  replacement: string;
  commitMessage: string;
}