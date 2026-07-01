// @skullface/plugins/notifications/deno.ts

// :::::: TYPES

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  actions?: NotificationAction[];
}

// :::::: HELPERS

/**
 * Executes a native operating system terminal application to display a notification
 */
async function runCommand (cmd: string, args: string[]) {
  const command = new Deno.Command(cmd, { args });
  const process = command.spawn();
  await process.status;
}

// :::::: API

export const api = {
  async requestPermission (): Promise<boolean> {
    // Desktop systems handle notifications directly via system shells implicitly
    return true;
  },

  async notify (options: NotificationOptions): Promise<void> {
    const os    = Deno.build.os;
    const body  = options.body || '';
    const title = options.title;
    
    if (os === 'windows') {
      // Inline PowerShell command payload creating a native Win32 balloon notification
      const psScript = `
        [void] [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms");
        $notification = New-Object System.Windows.Forms.NotifyIcon;
        $notification.Icon = [System.Drawing.Icon]::ExtractAssociatedIcon((Get-Process -Id $PID).Path);
        $notification.BalloonTipTitle = "${title}";
        $notification.BalloonTipText = "${body}";
        $notification.Visible = $true;
        $notification.ShowBalloonTip(5000);
      `.replace(/\n/g, ' ');
      
      await runCommand('powershell', ['-Command', psScript]);
    } else if (os === 'darwin') {
      // Trigger macOS notification system center using AppleScript layout definitions
      await runCommand('osascript', ['-e', `display notification "${body}" with title "${title}"`]);
    } else {
      // Standard Linux and FreeBSD POSIX notify-send bridge adapter execution
      await runCommand('notify-send', [title, body]);
    }
  }
};

// :::::: EXPORT

export default {
  api,
  name: 'notifications',
  hooks: {
    onInit() {
      console.log('[Notifications] Native desktop system alert adapters initialized.');
    }
  }
};
