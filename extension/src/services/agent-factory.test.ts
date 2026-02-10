import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import { createPR } from './agent-factory.js';
import { run_cmd } from './core-utils.js';

vi.mock('node:fs');
vi.mock('./core-utils.js', () => ({
  run_cmd: vi.fn(),
  getExtensionRoot: vi.fn(() => '/test-root'),
  Style: { GREEN: '', RED: '', RESET: '' },
}));

describe('agent_factory', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should create a PR using gh cli', () => {
    const sessionDir = '/session';
    const state = {
      working_dir: '/repo',
      original_prompt: 'Test prompt',
    };

    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(state));
    vi.mocked(run_cmd).mockReturnValue('https://github.com/pr/1');

    const result = createPR(sessionDir);

    expect(run_cmd).toHaveBeenCalledWith(
      expect.arrayContaining(['gh', 'pr', 'create']),
      expect.objectContaining({ cwd: '/repo' })
    );
    expect(result).toBe('https://github.com/pr/1');
  });
});
