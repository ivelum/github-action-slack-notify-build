const { context } = require('@actions/github');

function buildSlackAttachments({ status, color, github }) {
  const { payload, ref, workflow, eventName } = github.context;
  const { owner, repo } = context.repo;
  const event = eventName;
  const branch = event === 'pull_request' ? payload.pull_request.head.ref : ref.replace('refs/heads/', '');

  const sha = event === 'pull_request' ? payload.pull_request.head.sha : github.context.sha;
  const runId = parseInt(process.env.GITHUB_RUN_ID, 10);

  const isPr = event === 'pull_request';
  const referenceLink = isPr ? payload.pull_request.html_url : `https://github.com/${owner}/${repo}/commit/${sha}`;
  const atLink = isPr ? `<${referenceLink} | #${payload.pull_request.number}>` : `<${referenceLink} | ${branch}>`;
  const workflowLink = `<https://github.com/${owner}/${repo}/actions/runs/${runId} | ${workflow}>`;

  return [
    {
      color,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Workflow*: ${workflowLink} @ ${atLink} | *Status*: ${status}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'image',
              image_url: 'https://github.githubassets.com/favicon.ico',
              alt_text: 'GitHub',
            },
            {
              type: 'mrkdwn',
              text: `<https://github.com/${owner}/${repo} | ${owner}/${repo}>`,
            },
          ],
        },
      ],
    },
  ];
}

module.exports.buildSlackAttachments = buildSlackAttachments;

function formatChannelName(channel) {
  return channel.replace(/[#@]/g, '');
}

module.exports.formatChannelName = formatChannelName;
