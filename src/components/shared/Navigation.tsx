import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, Users } from 'lucide-react';
import { ModeToggle } from '@/components/shared/ModeToggle';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">TalentFlow</span>
          </Link>

          <div className="flex gap-4">
            <div className="flex gap-1">
              <Link to="/jobs">
                <Button
                  variant={isActive('/jobs') ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Jobs
                </Button>
              </Link>
              <Link to="/candidates">
                <Button
                  variant={isActive('/candidates') ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Candidates
                </Button>
              </Link>
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
