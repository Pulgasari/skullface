// @skullface/plugins/notifications/frontend.ts

export interface NotificationAction {
  action  : string;
  title   : string;
  icon   ?: string;
}

export interface NotificationOptions {
  title    : string;
  body    ?: string;
  icon    ?: string;
  actions ?: NotificationAction[];
}

export interface NotificationsAPI {
  notify            (options: NotificationOptions) : Promise<void>;
  requestPermission ()                             : Promise<boolean>;
}

declare global {
  interface Window {
    skullface: {
      notifications: NotificationsAPI;
    };
  }
}

// Global Shortcut Export
export const notifications: NotificationsAPI = (window as any).skullface?.notifications;
