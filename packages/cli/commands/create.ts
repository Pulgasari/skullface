// @skullface/cli/commands/create.ts

import { PLUGINS, TEMPLATES }              from '@/types';
import { applyTemplateVars, copyTemplate } from '@/utils';
import wizard from '@/wizard';

const DEFAULT_TEMPLATE = 'vanilla';

export default async function createCommand () {
  wizard.print('Skullface Create Wizard');

  // 1. Gather project details from user input
  const slugRaw   = await wizard.ask('App ID / Slug:');
  const slug      = slugRaw.toLowerCase().replace(/\s+/g, '-');
  const name      = (await wizard.ask(`App Name (Enter = same as slug):`)) || slug;
  const framework = (await wizard.select('Choose frontend:', TEMPLATES)) || DEFAULT_TEMPLATE;
  const plugins   =  await wizard.multiselect('Select plugins:', PLUGINS);
  const targetDir = `./${slug}`;

  wizard.print(`Creating project: ${targetDir}`);

  // 2. Download and extract all template files (including skullface.config.js)
  await copyTemplate({ name: framework, dir: targetDir });

  // 3. Prepare dataset for template injection
  const templateVars = {
    name, slug,
    plugins: JSON.stringify(plugins, null, 2) // beautify array
  };

  // 4. Run interpolation engine across all extracted files
  await applyTemplateVars(templateVars, targetDir);

  wizard.print('Done!');
  wizard.print(`cd ${slug}`);
  wizard.print('skullface dev');
}
