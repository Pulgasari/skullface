// @skullface/cli/commands/dev.js

import { loadConfig } from '@/utils';
import Wizard         from '@/wizard';
const wizard = new Wizard({ prefix: '[dev]' });

const DEFAULT_DEV_PORT = 5173;

/**
 * Boots up the synchronous frontend dev server and native Deno window shell.
 * Orchestrates background lifecycle teardown when the native app shuts down.
 */
export default async function () {
  wizard.print('Starting Skullface Development Environment ...');

  // 1. Load active project layout configurations
  const config      = await loadConfig();
  const port        = config.dev?.port || DEFAULT_DEV_PORT;
  const projectRoot = Deno.cwd();
  
  // 2. Spawn the Frontend Dev Server (e.g., Vite/Preact/HTMX dev task)
  wizard.print('Launching frontend development server on port ' + String(port) + ' ...');
  const npmCmd = Deno.build.os === 'windows' ? 'npm.cmd' : 'npm';
  
  const frontendProcess = new Deno.Command(npmCmd, {
    args   : ['run', 'dev'],
    cwd    : projectRoot,
    stdout : 'inherit',
    stderr : 'inherit'
  }).spawn();

  // Give the frontend bundler a brief moment to bind to the network port
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 3. Spawn the Native Deno Core GUI process
  wizard.print('Launching native core runtime environment...');
  const coreEntry = `${projectRoot}/packages/core/mod.ts`;
  const flags     = ['--allow-all'];
  if (config.dev?.hmr) flags.push('--watch-hmr');

  const backendProcess = new Deno.Command('deno', {
    args   : ['run', flags.join(' '), coreEntry],
    cwd    : projectRoot,
    env    : { 'SKULLFACE_ENV': 'development' },
    stdout : 'inherit',
    stderr : 'inherit'
  }).spawn();

  // 4. Handle synchronous cleanup when the developer closes the application
  // The command execution halts here as long as the desktop window stays open
  const backendStatus = await backendProcess.status;
  wizard.print('Native application window closed with exit code:', backendStatus.code);

  // Safely kill the frontend background server to prevent leaked ports hanging
  wizard.print('Stopping frontend background infrastructure tasks ...');
  try { frontendProcess.kill('SIGTERM'); }
  catch (_e) {} // Process might have been closed manually by the user already
  
  wizard.success('Development server shut down successfully.');
}
