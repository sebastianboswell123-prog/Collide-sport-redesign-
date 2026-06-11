import React from "react";
import { motion } from "framer-motion";

const ambassadors = [
  {
    name: "Marco P.",
    initials: "MP",
    position: "Flyhalf",
    team: "Western Province U21",
    wears: "Predator Navy/Gold + Compression Top Black",
    quote: "The Predator cap gives me confidence in every tackle.",
    gradient: "from-[#0e1b4d] to-[#4770db]",
  },
  {
    name: "Siya M.",
    initials: "SM",
    position: "Flanker",
    team: "Sharks Academy",
    wears: "Warrior Scrum Cap + Running Top Black",
    quote: "Best scrum cap I've ever worn. Period.",
    gradient: "from-[#0e1b4d] to-[#47db71]",
  },
  {
    name: "Thando K.",
    initials: "TK",
    position: "Hooker",
    team: "Bulls U19",
    wears: "White Tribal Cap",
    quote: "Looks amazing and the protection is next level.",
    gradient: "from-[#4770db] to-[#0e1b4d]",
  },
  {
    name: "Jade V.",
    initials: "JV",
    position: "Centre",
    team: "WP Women's",
    wears: "Blue & White Camo + Compression Top White",
    quote: "I won't play without my Collide cap.",
    gradient: "from-[#4770db] to-[#47db71]",
  },
  {
    name: "Liam B.",
    initials: "LB",
    position: "Lock",
    team: "Maties RFC",
    wears: "Black/Grey Scrum Cap",
    quote: "Comfortable fit, stays put in the scrum.",
    gradient: "from-[#0e1b4d] via-[#4770db] to-[#0e1b4d]",
  },
  {
    name: "Naledi S.",
    initials: "NS",
    position: "Scrumhalf",
    team: "Pumas U21",
    wears: "Green & Black Scrum Cap + Undershorts",
    quote: "Great gear at an unbeatable price.",
    gradient: "from-[#47db71] to-[#0e1b4d]",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Ambassadors() {
  return (
    <div className="min-h-screen bg-[#eff0f5]">
      {/* Hero */}
      <section className="bg-[#0e1b4d] text-white py-20 px-6 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Ambassadors
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-[#eff0f5]/80 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Meet the players who trust Collide Sport on the field
        </motion.p>
      </section>

      {/* Ambassador Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {ambassadors.map((player) => (
            <motion.div
              key={player.name}
              variants={cardVariants}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Player Image Placeholder */}
              <div
                className={`aspect-[3/4] bg-gradient-to-br ${player.gradient} flex items-center justify-center`}
              >
                <span className="text-6xl md:text-7xl font-bold text-white/30 select-none">
                  {player.initials}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0e1b4d]">
                  {player.name}
                </h3>
                <p className="text-sm text-[#4770db] font-medium mt-1">
                  {player.position} &middot; {player.team}
                </p>

                <div className="mt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0e1b4d]/50">
                    Wears:
                  </span>
                  <p className="text-sm text-[#0e1b4d] mt-1 font-medium">
                    {player.wears}
                  </p>
                </div>

                <blockquote className="mt-4 text-sm italic text-[#0e1b4d]/70 border-l-2 border-[#47db71] pl-3">
                  &ldquo;{player.quote}&rdquo;
                </blockquote>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
