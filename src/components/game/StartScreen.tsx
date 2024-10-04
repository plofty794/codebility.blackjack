"use client";
import Image from "next/image";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

function StartScreen({
  setGameStarted,
}: {
  setGameStarted: Dispatch<SetStateAction<boolean>>;
}) {
  const spring = {
    type: "spring",
    damping: 10,
    stiffness: 100,
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
      <motion.div
        initial={{
          y: "20%",
          opacity: 0,
        }}
        animate={{
          y: "0%",
          opacity: 1,
          transition: {
            delay: 0.5,
          },
        }}
        style={{
          left: "-1.25rem",
          top: "-0.75rem",
          rotate: "12deg",
        }}
        transition={spring}
        className="md:block hidden absolute w-52 h-72"
      >
        <div className="relative h-full w-full">
          <Image className="object-cover" src={"/back.png"} fill alt="" />
        </div>
      </motion.div>

      <motion.div
        initial={{
          y: "20%",
          opacity: 0,
        }}
        animate={{
          y: "0%",
          opacity: 1,
          transition: {
            delay: 0.5,
          },
        }}
        style={{
          right: "-1.25rem",
          top: "8rem",
          rotate: "-45deg",
        }}
        transition={spring}
        className="md:block hidden absolute w-52 h-72"
      >
        <div className="relative h-full w-full">
          <Image
            className="object-cover"
            src={"https://www.deckofcardsapi.com/static/img/AS.png"}
            fill
            alt=""
          />
        </div>
      </motion.div>

      <MaxWidthWrapper>
        <div className="flex items-center justify-center flex-col gap-4 md:gap-6">
          <motion.div
            initial={{
              y: "20%",
              opacity: 0,
            }}
            animate={{
              y: "0%",
              opacity: 1,
            }}
            transition={spring}
            className="relative size-56 md:size-64 rounded-full overflow-hidden"
          >
            <Image
              className="object-cover"
              src={"/blackjack logo.png"}
              width={500}
              height={500}
              alt=""
            />
          </motion.div>

          <Button onClick={() => setGameStarted(true)} size={"lg"}>
            Let&apos;s play
          </Button>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default StartScreen;
