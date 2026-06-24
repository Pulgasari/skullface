// plugins/notifications/frontend.ts

export const notify = (options) =>
  window.__skullface_notifications.notify(options);

export const requestPermission = () =>
  window.__skullface_notifications.requestPermission();
