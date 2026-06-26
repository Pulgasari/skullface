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

## Notes

```
Deno.writeTextFileSync()
https://raw.githubusercontent.com/pulgasari/skullface/main/templates/preact/
```

