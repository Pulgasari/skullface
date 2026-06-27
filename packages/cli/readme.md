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
├── bundler/
│   ├── backend.ts
│   ├── frontend.ts
│   └── mod.ts
├── commands/
│   ├── build.ts
│   ├── create.ts
│   ├── dev.ts
│   ├── doctor.ts
│   └── plugin.ts # handle skullface plugins
├── packer/
│   ├── linux.ts
│   ├── mac.ts
│   ├── mod.ts
│   └── windows.ts
├── utils/
├── index.ts   # main entry point
└── wizard.ts  # cli wizard
```

## TODO

### `wizard.ts`

- enhance methods
- rename methods ?
- use inquirer.js ?
