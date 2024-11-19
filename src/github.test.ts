import * as github from '@actions/github';
import { getWorkflowUrls } from './github';
import {
  mockNumber,
  mockPayload,
  mockRef,
  mockRepo,
  mockSHA,
  mockWorkflowURL,
  repoUrl
} from './tests/shared';

describe('Workflow URL Tests', () => {
  beforeAll(() => {
    jest.spyOn(github.context, 'repo', 'get').mockReturnValue(mockRepo);
    github.context.sha = mockSHA;
    github.context.ref = mockRef;
    github.context.workflow = mockWorkflowURL;
    github.context.payload = mockPayload;
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Pull Request event', () => {
    github.context.eventName = 'pull_request';
    const expectedEventUrl = `${repoUrl}/pull/${mockNumber}`;
    const expectedUrls = {
      repo: repoUrl,
      event: expectedEventUrl,
      action: `${expectedEventUrl}/checks`
    };
    expect(getWorkflowUrls()).toEqual(expectedUrls);
  });

  test('Push event', () => {
    github.context.eventName = 'commit';
    const expectedUrls = {
      repo: repoUrl,
      action: `${repoUrl}/commit/${mockSHA}/checks`
    };
    expect(getWorkflowUrls()).toEqual(expectedUrls);
  });
});
