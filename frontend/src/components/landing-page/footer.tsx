import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full border-t bg-slate-50">
      <div className="container flex flex-col gap-8 px-4 py-10 md:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">COMPANY</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-500 hover:text-gray-900">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-500 hover:text-gray-900">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-500 hover:text-gray-900">
                  Docs
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">RESOURCES</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-500 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-500 hover:text-gray-900">
                  Support
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-500 hover:text-gray-900">
                  See All Resources
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">ABOUT</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-gray-500 hover:text-gray-900">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">FOLLOW US</h3>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-500 hover:text-gray-900">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link to="#" className="text-gray-500 hover:text-gray-900">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link to="#" className="text-gray-500 hover:text-gray-900">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            © 2024 Trade Moai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
