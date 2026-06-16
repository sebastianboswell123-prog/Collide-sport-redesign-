import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PRODUCTS, CATEGORIES } from "../data/products";
import AppImage from "./ui/AppImage";

const categoryLabel = (value) => {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat ? cat.label : value;
};

function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery("");
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const filtered = query.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelect = () => {
    navigate("/catalogue");
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleBackdropClick}
        >
          <div className="absolute top-1/4 left-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 px-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for scrum caps, activewear..."
                className="w-full rounded-xl bg-white px-6 py-4 text-2xl text-navy outline-none shadow-2xl placeholder:text-grey"
              />

              {query.trim() && (
                <motion.div
                  className="mt-3 overflow-hidden rounded-xl bg-white shadow-2xl"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {filtered.length > 0 ? (
                    <ul className="divide-y divide-grey/20">
                      {filtered.map((product) => (
                        <li key={product.id}>
                          <button
                            type="button"
                            onClick={handleSelect}
                            className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-lavender/30"
                          >
                            <AppImage
                              src={product.image}
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-medium text-navy">
                                {product.name}
                              </p>
                            </div>
                            <span className="rounded-full bg-lavender px-3 py-0.5 text-xs font-medium text-navy/70">
                              {categoryLabel(product.category)}
                            </span>
                            <span className="text-sm font-semibold text-navy whitespace-nowrap">
                              R{product.price}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-5 py-6 text-center text-grey">
                      No products found
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchOverlay;
