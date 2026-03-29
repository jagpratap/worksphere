import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
