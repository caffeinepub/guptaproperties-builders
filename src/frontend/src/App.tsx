import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import InquiriesPage from './pages/InquiriesPage';
import AdminPage from './pages/AdminPage';
import SiteLayout from './components/layout/SiteLayout';

const rootRoute = createRootRoute({
  component: SiteLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const propertiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/properties',
  component: PropertiesPage,
});

const inquiriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inquiries',
  component: InquiriesPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([indexRoute, propertiesRoute, inquiriesRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
