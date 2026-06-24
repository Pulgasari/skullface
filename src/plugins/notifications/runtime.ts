// plugins/notifications/runtime.ts

export function injectRuntime (ctx) {
  const target = `${ctx.paths.backend}/notifications.runtime.js`;
  Deno.writeTextFileSync(target, RUNTIME_CODE);
}

const RUNTIME_CODE = `
(function() {
  async function requestPermission() {
    if (Notification.permission === "granted") return true;
    const result = await Notification.requestPermission();
    return result === "granted";
  }

  async function notify(options) {
    const { title, body, icon, actions = [] } = options;

    if (!(await requestPermission())) {
      console.warn("[notifications] permission denied");
      return;
    }

    const n = new Notification(title, {
      body,
      icon,
      actions
    });

    if (actions.length > 0) {
      n.onclick = (event) => {
        const action = actions.find(a => a.action === event.action);
        if (action && action.onClick) {
          action.onClick();
        }
      };
    }

    return n;
  }

  globalThis.__skullface_notifications = {
    notify,
    requestPermission
  };
})();
`;
