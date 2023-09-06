import { Octokit } from '@octokit/rest'
import {findAndReplaceInGithubFile} from '../src/find-and-replace-in-github-file.js'
import dotenv from 'dotenv'
dotenv.config({
  path: '.env.demo.local'
})

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

await findAndReplaceInGithubFile({
  octokit,
  owner: "username",
  repo: "repository",
  path: "path/to/file.txt",
  regex: /findMe/g,
  replacement: "replaceWithMe",
  commitMessage: "Replaced 'findMe' with 'replaceWithMe'"
});