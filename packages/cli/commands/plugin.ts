// @skullface/cli/commands/plugin.ts

import { PLUGINS }    from '@/types';
import { loadConfig } from '@/utils';
import wizard         from '@/wizard';

const ERROR_MISSING_CONFIGFILE  = 'No skullface.config.js found in this directory.';
const ERROR_MISSING_PLUGIN_NAME = 'Please specify a plugin name.';

/**
 * Lists all globally available core plugins in the framework registry
 */
async function listPlugins() {
  console.log('💀 Available Skullface Plugins:');
  
  // Try to load local config to check which plugins are currently active
  const config        = await loadConfig().catch(() => ({}));
  const activePlugins = config.plugins || [];

  for (const plugin of PLUGINS) {
    const isInstalled = activePlugins.includes(plugin);
    const marker      = isInstalled ? ' [installed]' : '';
    console.log(`  - ${plugin}${marker}`);
  }
  console.log('\nUsage:\n  skullface plugin add <name>\n  skullface plugin remove <name>\n');
}

/**
 * Main orchestrator for managing project plugins via CLI
 */
export async function pluginCommand (args: string[]) {
  const [action, name] = args;
  const configPath = `${Deno.cwd()}/skullface.config.js`;

  // Fallback to listing if no action is provided or if action is 'list'
  if (!action || action === 'list') {
    await listPlugins();
    return;
  }

  // Verify that the command is executed inside an actual project directory
  try        { await Deno.stat(configPath); } 
  catch (_e) { wizard.error(ERROR_MISSING_CONFIGFILE); return; }

  // Load the current programmatic state of the config file
  const config = await loadConfig();
  const activePlugins: string[] = config.plugins || [];

  // ==========================================
  // ACTION: ADD PLUGIN
  // ==========================================
  if (action === 'add') {
    if (!name) wizard.error(ERROR_MISSING_PLUGIN_NAME, { exit: true });

    if (!PLUGINS.includes(name)) {
      console.error(`Error: Unknown plugin '${name}'.`);
      await listPlugins();
      return;
    }

    if (activePlugins.includes(name)) {
      console.warn(`Plugin '${name}' is already installed in this project.`);
      return;
    }

    console.log(`Installing plugin: '${name}'...`);
    activePlugins.push(name);
  } 
  // ==========================================
  // ACTION: REMOVE PLUGIN
  // ==========================================
  else if (action === 'remove') {
    if (!name) wizard.error(ERROR_MISSING_PLUGIN_NAME, { exit: true });
    if (!isInstalled(name)) wizard.warn(`Plugin '${name}' is not currently active in this project.`, {exit: true });

    if (!activePlugins.includes(name)) {
      console.warn(`Plugin '${name}' is not currently active in this project.`);
      return;
    }

    console.log(`Removing plugin: '${name}'...`);
    const index = activePlugins.indexOf(name);
    activePlugins.splice(index, 1);
  } 
  // Handle illegal command actions safely
  else {
    console.error(`Error: Invalid action '${action}'.`);
    await listPlugins();
    return;
  }

  // ==========================================
  // PERSIST TO FILE (Targeted Search & Replace)
  // ==========================================
  try {
    const rawConfigText = await Deno.readTextFile(configPath);
    
    // Format our updated array to fit single-quote syntax preference nicely
    const updatedPluginsText = JSON.stringify(activePlugins, null, 2).replaceAll('"', "'");
    
    // Target and swap out only the plugins property block array matching pattern
    const regexPattern = /plugins:\s*\[[\s\S]*?\]/;
    const rewrittenConfigText = rawConfigText.replace(regexPattern, `plugins: ${updatedPluginsText}`);

    await Deno.writeTextFile(configPath, rewrittenConfigText);
    console.log(`Successfully updated skullface.config.js plugins inventory.`);
  } catch (error: any) {
    console.error('❌ Failed to update configuration file:', error.message);
  }
}
