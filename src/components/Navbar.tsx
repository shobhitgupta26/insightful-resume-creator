
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { Menu, X, FileText, BarChart, Home, Lock, ArrowRight } from "lucide-react";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const routes = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4" /> },
    { 
      name: "Resume Builder", 
      path: "/builder", 
      icon: <FileText className="h-4 w-4" />,
      protected: true 
    },
    { 
      name: "Resume Analyzer", 
      path: "/analyzer", 
      icon: <BarChart className="h-4 w-4" />,
      protected: true 
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue to-teal flex items-center justify-center text-white animate-float">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-bold text-xl blue-gradient-text">ResumeAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.protected && !isSignedIn ? "/sign-in" : route.path}
              className={`text-sm font-medium transition-colors hover:text-foreground/80 flex items-center gap-1.5 ${
                location.pathname === route.path ? "text-foreground" : "text-foreground/60"
              }`}
            >
              {route.icon}
              {route.name}
              {route.protected && !isSignedIn && (
                <Lock className="h-3 w-3 text-blue" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isLoaded && isSignedIn ? (
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9"
                }
              }}
            />
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignIn}
                className="hover:bg-blue/10 hover:text-blue rounded-full"
              >
                Sign In
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleSignUp}
                className="button-blue-gradient rounded-full"
              >
                Sign Up
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-full"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 bg-background/95 backdrop-blur-xl z-40 animate-fade-in md:hidden">
          <div className="container py-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-4">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.protected && !isSignedIn ? "/sign-in" : route.path}
                  className={`text-lg font-medium transition-colors hover:text-foreground/80 flex items-center gap-2 p-2 rounded-xl ${
                    location.pathname === route.path ? "text-foreground bg-muted" : "text-foreground/60"
                  }`}
                >
                  {route.icon}
                  {route.name}
                  {route.protected && !isSignedIn && (
                    <Lock className="h-4 w-4 text-blue ml-auto" />
                  )}
                </Link>
              ))}
            </nav>
            
            <div className="flex flex-col gap-3 mt-4">
              {isLoaded && isSignedIn ? (
                <div className="flex items-center gap-2 p-2">
                  <span className="text-sm text-muted-foreground">Manage account</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="default" 
                    className="w-full button-blue-gradient rounded-full"
                    onClick={handleSignUp}
                  >
                    Sign Up
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
