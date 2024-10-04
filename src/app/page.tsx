"use client";

import GameBoard from "@/components/game/GameBoard";
import StartScreen from "@/components/game/StartScreen";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  return (
    <main>
      <AnimatePresence>
        {gameStarted && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.4,
              },
            }}
            exit={{
              y: "50%",
              opacity: 0,
              transition: {
                duration: 0.6,
              },
            }}
          >
            <GameBoard />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!gameStarted && (
          <motion.div
            exit={{
              y: "50%",
              opacity: 0,
              transition: {
                duration: 0.6,
              },
            }}
          >
            <StartScreen setGameStarted={setGameStarted} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
