import { CARDS } from "@/data/deck";
import Card from "./Card";
import { AnimatedNumber } from "../AnimatedNumber";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function DealStart({
  cpuHand,
  playerHand,
  playerTotal,
}: {
  cpuHand?: typeof CARDS;
  playerHand?: typeof CARDS;
  playerTotal: number;
}) {
  return (
    <div className="relative flex items-center justify-center gap-1">
      {cpuHand && (
        <>
          <div className="hidden sm:flex items-center justify-center rounded-full absolute -right-32 size-20 bg-zinc-950">
            <AnimatedNumber
              className="inline-flex items-center font-mono text-xl font-light text-white"
              springOptions={{
                bounce: 0,
                duration: 500,
              }}
              value={
                cpuHand.length > 2
                  ? cpuHand[0].cardValue + cpuHand[1].cardValue
                  : cpuHand[1].cardValue
              }
            />
          </div>

          <motion.div
            initial={{
              opacity: 0,
              translateX: "-50%",
            }}
            animate={{
              opacity: 1,
              translateX: "0%",
            }}
            transition={{
              delay: 0.3,
            }}
            className="flex items-center justify-center gap-1 w-32 h-44"
          >
            <Card imageUrl={"/back.png"} />
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              translateX: "-50%",
            }}
            animate={{
              opacity: 1,
              translateX: "0%",
            }}
            transition={{
              delay: 0.4,
            }}
            className="flex items-center justify-center gap-1 w-32 h-44"
          >
            <Card imageUrl={cpuHand[1].imageUrl} />
          </motion.div>
          {cpuHand.length > 2 &&
            cpuHand.slice(0, 1).map((card, idx) => (
              <motion.div
                initial={{
                  opacity: 0,
                  translateX: "-50%",
                }}
                animate={{
                  opacity: 1,
                  translateX: "0%",
                }}
                transition={{
                  delay: idx > 0 ? idx / 10 : idx + 0.1,
                }}
                key={card.imageUrl}
                className="flex items-center justify-center gap-1 w-32 h-44"
              >
                <Card imageUrl={card.imageUrl} />
              </motion.div>
            ))}
        </>
      )}
      {playerHand && (
        <>
          <div
            className={cn(
              "hidden sm:flex items-center justify-center rounded-full absolute -left-32 size-20 bg-zinc-100",
              playerTotal > 21 && "bg-red-600",
              playerTotal === 21 && "bg-green-600 animate-bounce"
            )}
          >
            <AnimatedNumber
              className={cn(
                "inline-flex items-center font-mono text-xl font-light",
                playerTotal > 21 && "text-white",
                playerTotal === 21 && " text-white"
              )}
              springOptions={{
                bounce: 0,
                duration: 500,
              }}
              value={playerTotal}
            />
          </div>
          {playerHand.map((card, idx) => (
            <motion.div
              initial={{
                opacity: 0,
                translateX: "-50%",
              }}
              animate={{
                opacity: 1,
                translateX: "0%",
              }}
              transition={{
                delay: idx > 0 ? idx / 10 : idx + 0.1,
              }}
              key={card.imageUrl}
              className="flex items-center justify-center gap-1 w-32 h-44"
            >
              <Card imageUrl={card.imageUrl} />
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}

export default DealStart;
