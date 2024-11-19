import type { WebhookPayload } from '@actions/github/lib/interfaces';

const owner = 'kanade0404';
const repo = 'slatify';
export const repoUrl = `https://github.com/${owner}/${repo}`;
export const mockRepo = {
  owner: owner,
  repo: repo
};
export const mockSHA = '2';
export const mockRef = '1';
export const mockWorkflowURL = 'test';
export const mockNumber = 3;
export const mockPayload: WebhookPayload = {
  repository: {
    owner: {
      login: owner
    },
    name: repo
  },
  issue: {
    number: mockNumber
  }
};
