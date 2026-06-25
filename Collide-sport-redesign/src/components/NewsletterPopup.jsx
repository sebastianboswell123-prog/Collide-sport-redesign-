import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api";

const STORAGE_KEY = "collide_newsletter_dismissed";

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.subscribeNewsletter(email.trim());
      setSubmitted(true);
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (err) {
      setError(err.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed z-40 bottom-4 left-4 right-4 lg:bottom-6 lg:right-6 lg:left-auto max-w-sm mx-auto lg:mx-0 bg-white rounded-2xl shadow-2xl p-6"
        >
          {/* Close button */}
          <button
            onClick={dismiss}
            aria-label="Close newsletter popup"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none cursor-pointer"
          >
            &times;
          </button>

          {submitted ? (
            /* -------- Success state -------- */
            <div className="text-center py-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "#47db71" }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p
                className="font-semibold text-lg"
                style={{ color: "#0e1b4d" }}
              >
                You're in!
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Check your inbox for your R50 discount code.
              </p>
            </div>
          ) : (
            /* -------- Default state -------- */
            <>
              <h3
                className="text-lg font-bold pr-6"
                style={{ color: "#0e1b4d" }}
              >
                Get R50 Off Your First Order
              </h3>
              <p className="text-gray-500 text-sm mt-1 mb-4">
                Subscribe to our newsletter for exclusive deals and new product
                drops.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full text-white font-semibold py-2.5 text-sm transition hover:opacity-90 cursor-pointer disabled:opacity-60"
                  style={{ backgroundColor: "#4770db" }}
                >
                  {loading ? "Subscribing…" : "Subscribe"}
                </button>
              </form>

              {error && (
                <p className="text-[12px] text-red-500 text-center mt-2">{error}</p>
              )}

              <p className="text-[11px] text-gray-400 text-center mt-3">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
