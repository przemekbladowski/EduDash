import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "./components/login/LoginPage";
import { OnboardingPage } from "./components/onboarding/OnboardingPage";
import { TeacherLayout } from "./components/teacher/TeacherLayout";
import { TeacherDashboard } from "./components/teacher/TeacherDashboard";
import { TeacherSchedule } from "./components/teacher/TeacherSchedule";
import { TeacherFinance } from "./components/teacher/TeacherFinance";
import { TeacherSettings } from "./components/teacher/TeacherSettings";
import { TeacherAvailability } from "./components/teacher/TeacherAvailability";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminSchedule } from "./components/admin/AdminSchedule";
import { AdminFinance } from "./components/admin/AdminFinance";
import { AdminSettings } from "./components/admin/AdminSettings";

export const router = createBrowserRouter([
  { path: "/", Component: LoginPage },
  { path: "/onboarding", Component: OnboardingPage },
  {
    path: "/teacher",
    Component: TeacherLayout,
    children: [
      { index: true, Component: TeacherDashboard },
      { path: "schedule", Component: TeacherSchedule },
      { path: "finance", Component: TeacherFinance },
      { path: "availability", Component: TeacherAvailability },
      { path: "settings", Component: TeacherSettings },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "schedule", Component: AdminSchedule },
      { path: "finance", Component: AdminFinance },
      { path: "settings", Component: AdminSettings },
    ],
  },
  { path: "*", Component: () => <Navigate to="/" replace /> },
]);