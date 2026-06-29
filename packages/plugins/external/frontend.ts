// @skullface/plugins/external/frontend.ts

export interface ExternalAPI {
  file   (path: string) : Promise<void>;
  url     (url: string) : Promise<void>;
  reveal (path: string) : Promise<void>;
}

declare global {
  interface Window {
    skullface: {
      external: ExternalAPI;
    };
  }
}

// Global Shortcut Export
export const external: ExternalAPI = (window as any).skullface?.external;
