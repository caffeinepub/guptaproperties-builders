import { Link, useRouterState } from '@tanstack/react-router';
import { Building2 } from 'lucide-react';
import { businessInfo } from '../../data/siteData';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import ContactBar from './ContactBar';

export default function Header() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { identity } = useInternetIdentity();
  const { data: isAdmin = false, isLoading: adminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const showAdminLink = isAuthenticated && !adminLoading && isAdmin;

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Building2 className="h-7 w-7 text-primary" />
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight text-foreground">
                {businessInfo.name}
              </span>
              <span className="text-xs text-muted-foreground">Real Estate Excellence</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/properties"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === '/properties' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Properties
            </Link>
            <Link
              to="/inquiries"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === '/inquiries' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Inquiries
            </Link>
            {showAdminLink && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPath === '/admin' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="hidden lg:block">
            <ContactBar variant="compact" />
          </div>
        </div>

        <div className="block border-t border-border/40 py-2 md:hidden">
          <nav className="flex items-center justify-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/properties"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === '/properties' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Properties
            </Link>
            <Link
              to="/inquiries"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPath === '/inquiries' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Inquiries
            </Link>
            {showAdminLink && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPath === '/admin' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
