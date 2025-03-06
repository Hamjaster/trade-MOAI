import { Link } from "react-router-dom";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "About Trade MOAI", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Broker Support", href: "/support" },
  { label: "Sign Up", href: "/signup" },
  { label: "Login", href: "/login" },
];

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
