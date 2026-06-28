# skullface
https://pulgasari.github.io/skullface/

![Logo](./logo.svg)

## About

This is an experimental project and not intended to be used in production (at least for now).

## Features

**Skullface** is a framework to build cross-plattform desktop and mobile apps with JavaScript.

### Frontend

Should work with any JS-Framework or Vanilla JavaScript/TypeScript but a special focus for these is provided:

- Aufbau
- Datastar
- HTMX
- Preact
- React
- Svelte

### Backend

The backend is provided by the Deno runtime or Blue.

---

## Get started

### Installation

You need to install the CLI-Tool to create and manage Skullfaceprojects.

```sh
deno install jsr:@skullface/cli
```

```sh
deno install --allow-run --allow-read --allow-write -g -n skullface jsr:@skullface/cli
```

```sh
npm install -g jsr:@skullface/cli
```

### Create Project

Navigate into the directory of your projects and use the `create` command to start the wizard.

```sh
skullface create
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

## Notes

```
Deno.writeTextFileSync()
https://raw.githubusercontent.com/pulgasari/skullface/main/templates/preact/
```

