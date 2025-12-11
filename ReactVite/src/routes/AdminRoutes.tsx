import { Loadable } from "@/components";
import { AuthGuard } from "@/guards";
import { AdminLayout } from "@/layout";
import { delayTimeout } from "@/utils";
import React from "react";
const DashboardPage = Loadable(React.lazy(() => delayTimeout(import("@/pages/admin/DashboardPage"))));
const RoleList = Loadable(React.lazy(() => delayTimeout(import("@/pages/admin/role/RoleList"))));
const RoleForm = Loadable(React.lazy(() => delayTimeout(import("@/pages/admin/role/RoleForm"))));
const UserList = Loadable(React.lazy(() => delayTimeout(import("@/pages/admin/user/UserList"))));
const UserForm = Loadable(React.lazy(() => delayTimeout(import("@/pages/admin/user/UserForm"))));
const MenuList = Loadable(React.lazy(() => delayTimeout(import("@/pages/admin/menu/MenuList"))));
const MenuForm = Loadable(React.lazy(() => delayTimeout(import("@/pages/admin/menu/MenuForm"))));
const AdminRoutes = {
  path: "admin",
  element: (
    <AuthGuard>
      <AdminLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: "dashboard",
      element: <DashboardPage />
    },
    {
      path: "role",
      children: [
        {
          path: "list",
          element: <RoleList />
        },
        {
          path: "add",
          element: <RoleForm />
        },
        {
          path: "edit/:id",
          element: <RoleForm />
        }
      ]
    },
    {
      path: "user",
      children: [
        {
          path: "list",
          element: <UserList />
        },
        {
          path: "add",
          element: <UserForm />
        },
        {
          path: "edit/:id",
          element: <UserForm />
        }
      ]
    },
    {
      path: "menu",
      children: [
        {
          path: "list",
          element: <MenuList />
        },
        {
          path: "add",
          element: <MenuForm />
        },
        {
          path: "edit/:id",
          element: <MenuForm />
        }
      ]
    }
  ]
};
export { AdminRoutes };
