import { mswStore } from "./utils/store-persistence";

export async function startMSW(): Promise<void> {
  const { worker } = await import("./browser");

  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });

  /*
   * ── Dev Utilities (browser console) ──────────────────────────────
   *
   * __mswReset()     — Wipes all MSW localStorage state and reloads the page.
   *                    Useful when fixture data gets into a bad state.
   *
   * __mswUsers()     — Prints a table of all users (fixture + registered)
   *                    with email, role, and status. Useful for quickly
   *                    finding sign-in credentials when testing role-based flows.
   * Example:
   *   window.__mswReset()      → clears everything, fresh start
   *   window.__mswUsers()      → console.table of all available users
   */
  (window as unknown as Record<string, unknown>).__mswReset = () => {
    mswStore.clearAll();
    window.location.reload();
  };

  (window as unknown as Record<string, unknown>).__mswUsers = () => {
    const users = mswStore.getUsers();
    console.table(users.map(u => ({ email: u.email, role: u.role, status: u.status })));
  };
}
