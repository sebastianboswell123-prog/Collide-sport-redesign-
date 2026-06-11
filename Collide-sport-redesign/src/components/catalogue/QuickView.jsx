import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const COLOUR_MAP = {
  Black: '#1a1a1a',
  White: '#f5f5f5',
  Blue: '#4770db',
  Navy: '#0e1b4d',
  Turquoise: '#40E0D0',
  Green: '#47db71',
  Gold: '#FFD700',
  Grey: '#808080',
  Red: '#DC2626',
  Maroon: '#800000',
  Camo: 'repeating-conic-gradient(#4a5a3a, #6b7a5a, #3a4a2a)',
};

const BADGE_STYLES = {
  New: 'bg-[#47db71]/15 text-[#47db71]',
  Premium: 'bg-[#4770db]/15 text-[#4770db]',
  'Low Stock': 'bg-orange-500/15 text-orange-500',
  'Sold Out': 'bg-red-500/15 text-red-500',
};

export default function QuickView({ product, onClose }) {
  const { addToCart } = useCart();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const isWhite = (colour) => colour === 'White';
  const isCamo = (colour) => colour === 'Camo';

  const getSwatchStyle = (colour) => {
    const value = COLOUR_MAP[colour] || '#ccc';
    if (isCamo(colour)) {
      return { background: value };
    }
    return { backgroundColor: value };
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="quickview-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0e1b4d]/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-[#0e1b4d] text-lg font-bold transition-colors cursor-pointer"
              aria-label="Close quick view"
            >
              &times;
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left -- Image */}
              <div className="relative h-64 md:h-full min-h-[280px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right -- Details */}
              <div className="p-6 flex flex-col gap-4">
                {/* Name */}
                <h2 className="font-display font-bold text-xl text-[#0e1b4d]">
                  {product.name}
                </h2>

                {/* Badge */}
                {product.badge && (
                  <span
                    className={`inline-block self-start px-3 py-1 text-xs font-semibold rounded-full ${
                      BADGE_STYLES[product.badge] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {product.badge}
                  </span>
                )}

                {/* Price */}
                <p className="text-2xl font-bold text-[#0e1b4d]">
                  R {product.price}
                </p>

                {/* Colour swatches */}
                {product.colours && product.colours.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-[#0e1b4d]/60 uppercase tracking-wide">
                      Colours
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.colours.map((colour) => (
                        <span
                          key={colour}
                          title={colour}
                          className={`w-6 h-6 rounded-full shrink-0 ${
                            isWhite(colour) ? 'border border-[#0e1b4d]/20' : ''
                          }`}
                          style={getSwatchStyle(colour)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-sm text-[#0e1b4d]/70 leading-relaxed">
                  Closed-cell foam design. Flexible &amp; durable. Dual expansion
                  foam technology for superior impact absorption.
                </p>

                {/* Stock indicator */}
                <div className="text-sm font-medium">
                  {product.stock > 0 ? (
                    <span className="text-[#47db71]">
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </div>

                {/* Add to Cart */}
                <button
                  disabled={!product.stock || product.stock <= 0}
                  onClick={() => addToCart(product)}
                  className="w-full py-3 rounded-xl bg-[#4770db] text-white font-semibold text-sm hover:bg-[#4770db]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Add to Cart
                </button>

                {/* View Full Details */}
                <a
                  href={`/product/${product.id || ''}`}
                  className="text-center text-sm text-[#4770db] underline hover:text-[#4770db]/80 transition-colors"
                >
                  View Full Details
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
