import React from "react";
import { MapPin, Phone, Mail, Globe, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserFooter() {
  return (
    <footer className="w-full bg-[#2a2a2a] text-gray-300">

      {/* Main Footer */}
      <div className="
        px-4 sm:px-10 lg:px-20
        py-12 sm:py-16
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        gap-10 lg:gap-16
      ">

        {/* Left Column */}
        <div className="text-center sm:text-left">
          <h2 className="text-white text-lg sm:text-xl font-semibold mb-6">
            GARAGE24
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <MapPin size={16} className="text-red-500" />
              <p>HO: 31/216-Cholayil, Koduvally</p>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Phone size={16} className="text-red-500" />
              <p>(+91) 9947505770</p>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Mail size={16} className="text-red-500" />
              <p>ahmdjunaid206@gmail.com</p>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Globe size={16} className="text-red-500" />
              <p>www.garage24.in</p>
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="text-center sm:text-left">
          <h2 className="text-white text-lg sm:text-xl font-semibold mb-6">
            Quick Links
          </h2>

          <ul className="space-y-3 text-xs sm:text-sm">
            <li className="hover:text-white cursor-pointer">About Us</li>
            <li className="hover:text-white cursor-pointer">Why with Us</li>
            <li className="hover:text-white cursor-pointer">Our Services</li>
            <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">FAQ</li>
          </ul>
        </div>

        {/* Right Column */}
        <div className="text-center sm:text-left">
          <h2 className="text-white text-lg sm:text-xl font-semibold mb-6">
            List your Service Center?
          </h2>

          <p className="text-xs sm:text-sm mb-6 leading-relaxed">
            Don’t just wait for walk-ins! Let customers book their slots in
            advance and enjoy a smooth, stress-free service experience.
          </p>

          <Link
            to={"/garage/registration"}
            className="inline-flex items-center gap-2
            bg-red-600 hover:bg-red-700 transition
            px-5 sm:px-6 py-2.5 sm:py-3
            rounded-lg text-white text-xs sm:text-sm font-medium"
          >
            Join GARAGE24 <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-600 py-4 text-center text-xs sm:text-sm text-gray-400">
        Copyright © 2025 Garage24. All rights reserved.
      </div>
    </footer>
  );
}
