/**
 * Browser Notification API helper for prayer time alerts in ADZKAR.
 */

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

export function getNotificationPermission(): NotificationPermissionStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch {
    return 'default';
  }
}

export function sendPrayerNotification(prayerName: string, timeString: string): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const title = `ADZKAR: Waktu Shalat ${prayerName} Tiba (${timeString})`;
    const options: NotificationOptions = {
      body: `Panggilan shalat ${prayerName} telah berkumandang. Mari segera bersiap, berwudhu, dan tunaikan shalat.`,
      icon: '/favicon.ico',
      tag: `prayer-${prayerName}-${timeString}`,
      badge: '/favicon.ico',
      silent: false,
    };

    const notif = new Notification(title, options);
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    return true;
  } catch {
    return false;
  }
}

export function sendTestNotification(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notif = new Notification('ADZKAR: Notifikasi Pengingat Shalat Aktif', {
      body: 'Tes pengingat shalat berhasil! Sistem akan otomatis memunculkan notifikasi dan memutar seruan adzan saat masuk waktu.',
      tag: 'adzkar-test',
    });
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    return true;
  } catch {
    return false;
  }
}
