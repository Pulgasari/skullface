# packages/cli

## Install

```sh
deno install jsr:@skullface/cli
```

```sh
npm install -g jsr:@skullface/cli
```

## Structure

```c
packages/cli/
├── commands/
│   ├── build.ts  # ...
│   ├── create.ts # ...
│   ├── dev.ts    # ...
│   ├── doctor.ts # ...
│   ├── plugin.ts # handle skullface plugins
├── index.ts   # main entry point
├── utils.ts   # helpers
└── wizard.ts  # cli wizard
```

## TODO

### `wizard.ts`

- enhance methods
- rename methods ?
- use inquirer.js ?
