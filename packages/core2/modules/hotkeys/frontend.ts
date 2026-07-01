// @skullface/plugins/hotkeys/frontend.ts

// :::::: TYPES

export interface HotkeyOptions {
  when?: () => boolean;
}

export interface HotkeyScope {
  name: string;
  enabled: boolean;
  enable(): void;
  disable(): void;
  when(fn: () => boolean): this;
  condition?: () => boolean;
}

export interface HotkeysAPI {
  register(combo: string, callback: (e: KeyboardEvent) => void, options?: HotkeyOptions): void;
  unregister(combo: string): void;
  createScope(name: string): HotkeyScope;
}

declare global {
  interface Window {
    skullface: {
      hotkeys: HotkeysAPI;
    };
  }
}

const normalize = (combo: string): string => {
  return combo
    .toLowerCase()
    .replace(/\s+/g, '')
    .split('+')
    .sort((a, b) => {
      const order = ['ctrl', 'alt', 'shift', 'meta'];
      return order.indexOf(a) - order.indexOf(b);
    })
    .join('+');
};

const scopes = new Map<string, HotkeyScope>();
let activeScope: HotkeyScope | null = null;
const bindings = new Map<string, { callback: (e: KeyboardEvent) => void; options: HotkeyOptions }>();

// Core DOM event listener evaluating runtime keystroke mappings
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', event => {
    const parts: string[] = [];
    if (event.ctrlKey)  parts.push('ctrl');
    if (event.altKey)   parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey)  parts.push('meta');
    parts.push(event.key.toLowerCase());

    const combo = normalize(parts.join('+'));
    const binding = bindings.get(combo);
    if (!binding) return;

    const { callback, options } = binding;

    // Scope boundary validation
    if (activeScope) {
      if (!activeScope.enabled) return;
      if (activeScope.condition && !activeScope.condition()) return;
    }

    // Custom runtime condition rule guard validation
    if (options.when && !options.when()) return;

    event.preventDefault();
    callback(event);
  });
}

// :::::: API

export const hotkeys: HotkeysAPI = {
  register(combo, callback, options = {}) {
    const key = normalize(combo);
    bindings.set(key, { callback, options });
  },

  unregister(combo) {
    bindings.delete(normalize(combo));
  },

  createScope(name) {
    const scope: HotkeyScope = {
      name,
      enabled: false,
      enable() { this.enabled = true; activeScope = this; },
      disable() { this.enabled = false; if (activeScope === this) activeScope = null; },
      when(fn) { this.condition = fn; return this; }
    };
    scopes.set(name, scope);
    return scope;
  }
};

// Expose inside the window global namespace container automatically if browser layer is ready
if (typeof window !== 'undefined') {
  if (!(window as any).skullface) (window as any).skullface = {};
  (window as any).skullface.hotkeys = hotkeys;

}
