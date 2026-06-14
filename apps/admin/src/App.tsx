import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { LoginPage, RequireAuth } from "./pages/Login";
import { DashboardPage } from "./pages/Dashboard";
import { LeadsPage } from "./pages/Leads";
import { MediaPage } from "./pages/Media";
import { SettingsPage } from "./pages/Settings";
import { UsersPage } from "./pages/Users";
import { AiBlogPage } from "./pages/AiBlog";
import {
  BlogPage,
  CareersPage,
  GalleryPage,
  LocationsPage,
  PagesPage,
  RedirectsPage,
  ServiceCategoriesPage,
  ServicesPage,
  TestimonialsPage,
} from "./pages/content";

/** Routed CMS shell: public /login, everything else behind RequireAuth. */
export function App() {
  // Honour the Vite base path so the SPA can be served under a subpath
  // (e.g. /cms in production) as well as at root in local dev.
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="service-categories" element={<ServiceCategoriesPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="ai-blog" element={<AiBlogPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="pages" element={<PagesPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="redirects" element={<RedirectsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
