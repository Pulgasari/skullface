# skullface
https://pulgasari.github.io/skullface/

![Logo](./logo.svg)

## Note

This is an experimental project and not intended to be used in production (at least for now).

## About

**Skullface** is a framework to build cross-plattform desktop and mobile apps with JavaScript.

Should work with any JS-Framework or Vanilla JavaScript/TypeScript but a special focus for these is provided:

- Aufbau
- Datastar
- HTMX
- Preact
- React
- Svelte

The backend is provided by the Deno runtime or Blue.

## Documentation

Read the fucking [docs](docs)! >.<

- Plugins
  - [hotkeys](docs/plugins/hotkeys.md)
  - [router](docs/plugins/router.md)

---

## Get started

### Installation

You need to install the CLI-Tool to create and manage Skullface projects.

```sh
deno install jsr:@skullface/cli
```

```sh
npm install -g jsr:@skullface/cli
```

### Create Project

Navigate into the directory of your projects and use the `create` command to start the wizard.

```sh
skullface create
```

## Plugins (official)

**Skullface** provides a bunch of plugins out of the box:

```
clipboard
dialogs
external
fs
hotkeys
logger
notifications
router
sqlite
store
```

To install a skullface-plugin run for example:

```sh
skullface plugin add clipboard
```

And to remove it:

```sh
skullface plugin remove clipboard
```

## Create Custom Commands

You can define commands in the backend to be called from the frontend by the `skullface.createBridge` interface.

```javascript
// src-backend/main.ts (User Application Backend)

import skullface from '@skullface/core';

skullface.createBridge({
  async sayHello(name: string): Promise<string> {
    return `Hello from Deno backend, ${name}!`;
  },

  async readSystemLogs(): Promise<string> {
    const logPath = skullface.paths.join(skullface.paths.app.logs, 'app.log');
    return await Deno.readTextFile(logPath);
  },

  async calculateHash(input: string): Promise<string> {
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
});
```

To make use of autocomplete:

```javascript
// src-frontend/bridge.d.ts (User Frontend Type Declarations)

export interface CustomAppBridge {
  sayHello(name: string): Promise<string>;
  readSystemLogs(): Promise<string>;
  calculateHash(input: string): Promise<string>;
}

declare global {
  interface Window {
    skullface: {
      bridge: CustomAppBridge;
    };
  }
}
```

Usage in frontend:

```javascript
// src-frontend/app.js

const { calculateHash, sayHello } = skullface.bridge;

const greeting = await sayHello('Alex');
console.log(greeting); // Output: Hello from Deno backend, Alex!

const secureHash = await calculateHash('secret_password');
console.log('SHA-256:', secureHash);
```
