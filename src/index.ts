import * as core from '@actions/core';
import type { IncomingWebhookDefaultArguments } from '@slack/webhook';
import * as github from './github';
import { Slack } from './slack';
import { isValidCondition, validateStatus } from './utils';

async function run() {
  const status = validateStatus(
    core.getInput('type', { required: true }).toLowerCase()
  );
  const jobName = core.getInput('job_name', { required: true });
  const url = process.env.SLACK_WEBHOOK || core.getInput('url');
  let mention = core.getInput('mention');
  let mentionCondition = core.getInput('mention_if').toLowerCase();
  const slackOptions: IncomingWebhookDefaultArguments = {
    username: core.getInput('username'),
    channel: core.getInput('channel'),
    icon_emoji: core.getInput('icon_emoji')
  };
  const commitFlag = core.getInput('commit') === 'true';
  const token = core.getInput('token');

  if (mention && !isValidCondition(mentionCondition)) {
    mention = '';
    mentionCondition = '';
    core.warning(`Ignore slack message metion:
      mention_if: ${mentionCondition} is invalid
      `);
  }

  if (!url) {
    throw new Error(`Missing Slack Incoming Webhooks URL.
      Please configure "SLACK_WEBHOOK" as environment variable or
      specify the key called "url" in "with" section.
      `);
  }

  let commit: github.CommitContext | undefined;
  if (commitFlag) {
    commit = await github.getCommit(token);
  }

  const payload = Slack.generatePayload(
    jobName,
    status,
    mention,
    mentionCondition,
    commit
  );
  core.debug(`Generated payload for slack: ${JSON.stringify(payload)}`);

  await Slack.notify(url, slackOptions, payload);
  core.info('Post message to Slack');
}

run().catch(err => core.setFailed(err.message));
