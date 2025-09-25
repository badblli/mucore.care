export async function initOneSignal() {
  if (typeof window === "undefined") return;

  // @ts-ignore
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  // @ts-ignore
  window.OneSignalDeferred.push(async function (OneSignal: any) {
    await OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
    });
  });
}
