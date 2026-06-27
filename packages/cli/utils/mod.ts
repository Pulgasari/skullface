// @skullface/cli/utils/mod.ts

// Constants
export const DEFAULT_TEMPLATE   = 'vanilla';
export const REPO_ZIP_URL       = `https://github.com/pulgasari/skullface/archive/refs/heads/main.zip`;
export const TEMPLATE_PATH_PART = `skullface-main/templates/vanilla/`;

// Methods
export { default as applyTemplateVars } from './applyTemplateVars.ts';
export { default as copyTemplate      } from './copyTemplate.ts';
