import React from "react";

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Branding */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-neutral rounded-lg flex items-center justify-center">
                <span className="text-neutral-content font-bold text-sm">DS</span>
              </div>
              <span className="text-xl font-bold text-info">DevSync</span>
            </div>
            <p className="text-neutral-content mb-4">
              The modern task manager that's simple yet universally reliable. Designed for developers and productivity lovers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-info font-semibold mb-3">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-base-100">Features</a></li>
              <li><a href="#app-preview" className="hover:text-base-100">Demo</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-info font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-base-100">About</a></li>
              <li><a href="#" className="hover:text-base-100">Contact</a></li>
              <li><a href="#" className="hover:text-base-100">Blog</a></li>
            </ul>
          </div>

          {/* Social / Legal */}
          <div>
            <h4 className="text-info font-semibold mb-3">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-base-100">GitHub</a>
              <a href="#" className="hover:text-base-100">Twitter</a>
              <a href="#" className="hover:text-base-100">LinkedIn</a>
            </div>
            <p className="text-neutral-content text-sm">© {new Date().getFullYear()} DevSync. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
