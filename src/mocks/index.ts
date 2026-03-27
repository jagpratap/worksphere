import { mswStore } from "./utils/store-persistence";

export async function startMSW(): Promise<void> {
  const { worker } = await import("./browser");

  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });

  // ── Dev Utilities (browser console) ──────────────────────────────────────

  const w = window as unknown as Record<string, unknown>;

  w.__mswReset = () => {
    mswStore.clearAll();
    window.location.reload();
  };

  w.__mswUsers = () => {
    const users = mswStore.getUsers();
    console.table(users.map(u => ({ email: u.email, role: u.role, status: u.status })));
  };

  w.__mswProjects = () => {
    const projects = mswStore.getProjects();
    console.table(projects.map(p => ({ id: p.id, key: p.key, name: p.name, status: p.status, owner: p.ownerId })));
  };

  w.__mswTasks = () => {
    const tasks = mswStore.getTasks();
    console.table(tasks.map(t => ({ id: t.id, key: t.key, title: t.title, status: t.status, project: t.projectId })));
  };
}
