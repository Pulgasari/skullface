export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
  onClick?: () => void;
}

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  actions?: NotificationAction[];
}
