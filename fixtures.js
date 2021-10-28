const repository = {
  name: 'github-action-slack-notify-build',
  owner: {
    login: 'ivelum',
  },
};

export const GITHUB_PUSH_EVENT = {
  context: {
    payload: {
      repository,
    },
    ref: 'refs/heads/my-branch',
    workflow: 'CI',
    eventName: 'push',
    sha: 'abc123',
  },
};

export const GITHUB_PR_EVENT = {
  context: {
    payload: {
      repository,
      pull_request: {
        html_url: 'https://github.com/ivelum/github-action-slack-notify-build/pulls/1337',
        title: 'This is a PR',
        number: 1337,
        head: {
          ref: 'my-branch',
          sha: 'xyz678',
        },
      },
    },
    workflow: 'CI',
    eventName: 'pull_request',
    sha: 'abc123',
  },
};
