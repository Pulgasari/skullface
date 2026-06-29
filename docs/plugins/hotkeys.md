# @skullface => hotkeys

The `hotkeys` plugin provides a keyboard shortcut registration and scope management engine. 

Because keyboard events originate inside the window frame, this plugin executes entirely within the browser context to eliminate Inter-Process Communication (IPC) latency.

## API Reference

### Methods

#### `register(combo: string, callback: (e: KeyboardEvent) => void, options?: HotkeyOptions): void`
Binds a keyboard combination string to a execution handler function. Key combinations are automatically case-normalized and sorted regardless of user input order (e.g., `Ctrl+Shift+A` matches `shift+ctrl+a`).

#### `unregister(combo: string): void`
Removes an active keyboard combination execution binding from the internal event lookup map.

#### `createScope(name: string): HotkeyScope`
Generates a distinct shortcut evaluation boundary layer to prevent modal or view-specific hotkeys from triggering in globally unintended application contexts.

### Interfaces

```typescript
export interface HotkeyOptions {
  when?: () => boolean;
}

export interface HotkeyScope {
  name: string;
  enabled: boolean;
  enable(): void;
  disable(): void;
  when(fn: () => boolean): this;
}
```

## Examples

### Global Shortcut Registration

```typescript
// Automatically normalizes spacing and modifier sorting combinations
skullface.hotkeys.register('Ctrl + S', (event) => {
  console.log('Save command triggered');
});
```

### Contextual Scope Isolation

```typescript

// Define a scoped boundary layer for modal window frames
const modalScope = skullface.hotkeys.createScope('settings-modal');

// This hotkey only fires if the settings-modal scope is enabled and the condition passes
skullface.hotkeys.register('Escape', () => {
  closeSettingsModal();
  modalScope.disable();
});

modalScope.when(() => isModalVisibleInDOM() === true);

// Enable scope context when displaying the layout element
function openSettingsModal() {
  displayModalElement();
  modalScope.enable();
}
```



