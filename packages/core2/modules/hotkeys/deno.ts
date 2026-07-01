// @skullface/plugins/hotkeys/deno.ts

// :::::: API

export const api = {
  // Key triggers are intercepted directly within the local view layout engine context loop
};

// :::::: EXPORT

export default {
  api,
  name: 'hotkeys',
  hooks: {
    onInit() {
      console.log('[Hotkeys] Desktop runtime loader context mounted.');
    }
  }
};
