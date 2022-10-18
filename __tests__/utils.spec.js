import { formatChannelName, buildSlackAttachments } from '../src/utils';
import { GITHUB_PUSH_EVENT, GITHUB_PR_EVENT } from '../fixtures';
const runId = parseInt(process.env.GITHUB_RUN_ID, 10);

describe('Utils', () => {
  describe('formatChannelName', () => {
    it('strips #', () => {
      expect(formatChannelName('#app-notifications')).toBe('app-notifications');
    });

    it('strips @', () => {
      expect(formatChannelName('@app.buddy')).toBe('app.buddy');
    });
  });

  describe('buildSlackAttachments', () => {
    it('passes color', () => {
      const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });
      expect(attachments[0].color).toBe('good');
    });

    it('shows status', () => {
      const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });
      expect(attachments[0].blocks.find(b => b.type === 'section').text.text).toEqual(
        expect.stringContaining('STARTED')
      );
    });

    describe('for push events', () => {
      it('links to the action workflow', () => {
        const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });
        const link = `<https://github.com/ivelum/github-action-slack-notify-build/actions/runs/${runId} | CI>`;
        expect(attachments[0].blocks.find(b => b.type === 'section').text.text).toEqual(expect.stringContaining(link));
      });

      it('links to the action repo', () => {
        const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });
        const link = `<https://github.com/ivelum/github-action-slack-notify-build | ivelum/github-action-slack-notify-build>`;
        expect(attachments[0].blocks.find(b => b.type === 'context').elements[1].text).toEqual(link);
      });

      it('links to the branch', () => {
        const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });
        const link = `<https://github.com/ivelum/github-action-slack-notify-build/commit/abc123 | my-branch>`;
        expect(attachments[0].blocks.find(b => b.type === 'section').text.text).toEqual(expect.stringContaining(link));
      });

      it('shows build number', () => {
        const attachments = buildSlackAttachments({
          status: 'STARTED',
          color: 'good',
          github: GITHUB_PUSH_EVENT,
          buildNumber: '123',
        });
        expect(attachments[0].blocks.find(b => b.type === 'section').text.text).toEqual(expect.stringContaining('123'));
      });
    });

    describe('for PR events', () => {
      it('links to the action workflow', () => {
        const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PUSH_EVENT });
        const link = `<https://github.com/ivelum/github-action-slack-notify-build/actions/runs/${runId} | CI>`;
        expect(attachments[0].blocks.find(b => b.type === 'section').text.text).toEqual(expect.stringContaining(link));
      });

      it('links to the PR', () => {
        const attachments = buildSlackAttachments({ status: 'STARTED', color: 'good', github: GITHUB_PR_EVENT });
        const link = `<https://github.com/ivelum/github-action-slack-notify-build/pulls/1337 | #1337>`;
        expect(attachments[0].blocks.find(b => b.type === 'section').text.text).toEqual(expect.stringContaining(link));
      });
    });
  });
});
