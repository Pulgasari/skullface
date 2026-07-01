// @skullface/plugins/router/deno.ts

// :::::: API

export const api = {
  // Client routing is executed natively inside the local frontend view context
};

// :::::: EXPORT

export default {
  api,
  name: 'router',
  hooks: {
    onInit() {
      console.log('[Router] Desktop runtime shell loader mounted.');
    }
  }
};
