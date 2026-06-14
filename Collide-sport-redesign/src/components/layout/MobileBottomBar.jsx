import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const tabs = [
  {
    label: "Home",
    path: "/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M3 12L12 3l9 9" />
        <path d="M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9" />
      </svg>
    ),
  },
  {
    label: "Shop",
    path: "/catalogue",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    label: "Cart",
    path: null,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    label: "Contact",
    path: "/contact",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
];

export default function MobileBottomBar() {
  const location = useLocation();
  const { totalItems, setOpen } = useCart();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-navy/10 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const active = tab.path !== null && isActive(tab.path);

          if (tab.label === "Cart") {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setOpen(true)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative ${
                  active ? "text-blue-600" : "text-navy/40"
                }`}
              >
                <span className="relative">
                  {tab.icon}
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-red-500 rounded-full leading-none">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </span>
                <span className="text-[10px] leading-tight">{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.label}
              to={tab.path}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full ${
                active ? "text-blue-600" : "text-navy/40"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] leading-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
