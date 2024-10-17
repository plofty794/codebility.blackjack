import MaxWidthWrapper from "../MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { CARDS } from "../../data/deck";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import Chip from "./Chip";
import {
  DollarSignIcon,
  Hand,
  CirclePlusIcon,
  HandshakeIcon,
  CircleXIcon,
  BookUpIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedNumber } from "../AnimatedNumber";

import { cn } from "@/lib/utils";
import ResultModal, { GameResult } from "./ResultModal";
import DealStart from "./DealStart";

const CHIP_VALUES = [
  {
    value: 1,
    fill: "#2B2A29",
  },
  {
    value: 5,
    fill: "#990000",
  },
  {
    value: 10,
    fill: "#000099",
  },
  {
    value: 25,
    fill: "#004D00",
  },
  {
    value: 100,
    fill: "#01011D",
  },
  {
    value: 500,
    fill: "#4D004D",
  },
  {
    value: 1000,
    fill: "#999900",
  },
];

export function shuffleDeck(deck: typeof CARDS) {
  return deck.sort(() => Math.random() - 0.5);
}

function GameBoard() {
  const [yourBank, setYourBank] = useState<number>(2000);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [deck, setDeck] = useState<typeof CARDS>(shuffleDeck(CARDS));
  const [playerHand, setPlayerHand] = useState<typeof CARDS>([]);
  const [cpuHand, setCPUHand] = useState<typeof CARDS>([]);
  const [startDeal, setDealStart] = useState<boolean>(false);
  const [yourBet, setYourBet] = useState<number>(0);

  const playerTotal = useMemo(() => {
    if (!playerHand.length) return 0;
    return playerHand.reduce((acc, val) => acc + val.cardValue, 0);
  }, [playerHand]);

  useEffect(() => {
    if (playerTotal > 21 && yourBank === 0) {
      setDeck(shuffleDeck(CARDS));
      setGameResult({
        cpuTotal: cpuHand.reduce((acc, val) => acc + val.cardValue, 0),
        playerTotal,
        result: "playerBust",
        setGameResult,
        setDealStart,
        setCPUHand,
        setPlayerHand,
        setYourBet,
        setYourBank,
      });
      return;
    }
    if (playerTotal > 21 && yourBank > 1) {
      setDeck(shuffleDeck(CARDS));
      setYourBank(Math.abs(yourBet + yourBank - yourBet));
      setGameResult({
        cpuTotal: cpuHand.reduce((acc, val) => acc + val.cardValue, 0),
        playerTotal,
        result: "playerBust",
        setGameResult,
        setDealStart,
        setCPUHand,
        setPlayerHand,
        setYourBet,
      });
      return;
    }
  }, [cpuHand, playerTotal, setYourBank, yourBank, yourBet]);

  function drawCard() {
    const newDeck = [...deck];
    setPlayerHand([newDeck.pop()!, newDeck.pop()!]);
    setCPUHand([newDeck.pop()!, newDeck.pop()!]);
    setDeck(newDeck);
  }

  function playerStand(cpu: typeof CARDS) {
    let playerTotal = 0;
    let cpuTotal = 0;
    let playerAceCount = 0;
    let cpuAceCount = 0;

    playerHand.forEach((card) => {
      const { cardValue } = card;
      if (card.value === "A") playerAceCount++;
      playerTotal += cardValue;
    });

    cpu.forEach((card) => {
      const { cardValue } = card;
      if (card.value === "A") cpuAceCount++;
      cpuTotal += cardValue;
    });

    while (playerTotal > 21 && playerAceCount > 0) {
      playerTotal -= 10;
      playerAceCount--;
    }

    while (cpuTotal > 21 && cpuAceCount > 0) {
      cpuTotal -= 10;
      cpuAceCount--;
    }
    closestTo21(cpuTotal, playerTotal);
  }

  function closestTo21(cpu: number, player: number): void | null {
    if (cpu > 21 && player > 21) {
      setDeck(shuffleDeck(CARDS));
      setGameResult({
        cpuTotal: cpu,
        playerTotal: player,
        result: "bust",
        setGameResult,
        setDealStart,
        setCPUHand,
        setPlayerHand,
        setYourBet,
        setYourBank,
      });
      return;
    }
    if (cpu === player) {
      setGameResult({
        cpuTotal: cpu,
        playerTotal: player,
        result: "push",
        setGameResult,
        setDealStart,
        setCPUHand,
        setPlayerHand,
        setYourBet,
        setYourBank,
      });
      return;
    }
    if (cpu > 21) {
      setYourBank((prev) => {
        if (prev === 0) {
          return yourBet * 2;
        } else {
          return prev + yourBet * 2;
        }
      });
      setGameResult({
        cpuTotal: cpu,
        playerTotal: player,
        result: "cpuBust",
        setGameResult,
        setDealStart,
        setCPUHand,
        setPlayerHand,
        setYourBet,
      });
      return;
    }
    if (player > 21) {
      setDeck(shuffleDeck(CARDS));
      setGameResult({
        cpuTotal: cpu,
        playerTotal: player,
        result: "playerBust",
        setGameResult,
        setDealStart,
        setCPUHand,
        setPlayerHand,
        setYourBet,
        setYourBank,
      });
      return;
    }

    if (player === 21) {
      setYourBank((prev) => {
        if (prev === 0) {
          return yourBet * 2;
        } else {
          return prev + yourBet * 2;
        }
      });
      setGameResult({
        cpuTotal: cpu,
        playerTotal: player,
        result: "playerWin",
        setGameResult,
        setDealStart,
        setCPUHand,
        setPlayerHand,
        setYourBet,
      });
      return;
    }

    if (cpu === 21) {
      setDeck(shuffleDeck(CARDS));
      setGameResult({
        cpuTotal: cpu,
        playerTotal: player,
        result: "cpuWin",
        setGameResult,
        setDealStart,
        setCPUHand,
        setPlayerHand,
        setYourBet,
        setYourBank: yourBank === 0 ? setYourBank : undefined,
      });
      return;
    }

    const cpuDiff = 21 - cpu;
    const playerDiff = 21 - player;

    if (cpuDiff < playerDiff) {
      setDeck(shuffleDeck(CARDS));
      setYourBank(Math.abs(yourBet + yourBank - yourBet));
      setGameResult({
        cpuTotal: cpu,
        playerTotal: player,
        result: "cpuWin",
        setGameResult,
        setDealStart,
        setCPUHand,
        setPlayerHand,
        setYourBet,
        setYourBank: yourBank === 0 ? setYourBank : undefined,
      });
      return;
    } else {
      setYourBank((prev) => {
        if (prev === 0) {
          return yourBet * 2;
        } else {
          return prev + yourBet * 2;
        }
      });
      setGameResult({
        cpuTotal: cpu,
        playerTotal: player,
        result: "playerWin",
        setGameResult,
        setDealStart,
        setCPUHand,
        setPlayerHand,
        setYourBet,
      });
      return;
    }
  }

  function playerHit() {
    setPlayerHand((prev) => [...prev, deck.pop()!]);
  }

  return (
    <MaxWidthWrapper className="relative">
      {startDeal && gameResult && <ResultModal gameResult={gameResult} />}

      <div className="hidden md:block absolute top-10 right-10 w-max">
        <Badge>
          remaining cards:
          <AnimatedNumber
            className="ml-1"
            springOptions={{
              bounce: 0,
              duration: 500,
            }}
            value={deck.length}
          />
        </Badge>
      </div>
      <div className="flex flex-col items-center justify-center gap-8 h-screen">
        {startDeal && (
          <div className="md:w-2/5 flex flex-col md:flex-row items-center justify-center gap-2 left-10">
            <Button className="w-full">
              Bank:
              <span className="font-bold ml-1 flex items-center justify-center">
                <DollarSignIcon className="size-4" />
                <AnimatedNumber
                  springOptions={{
                    bounce: 0,
                    duration: 500,
                  }}
                  value={yourBank}
                />
              </span>
            </Button>
            <Button className="w-full" variant={"secondary"}>
              Current bet:
              <span className="font-bold ml-1 flex items-center justify-center">
                <DollarSignIcon className="size-4" />
                <AnimatedNumber
                  springOptions={{
                    bounce: 0,
                    duration: 500,
                  }}
                  value={yourBet}
                />
              </span>
            </Button>
          </div>
        )}
        <div className="flex flex-col items-center justify-center gap-2 md:gap-6">
          {startDeal && (
            <>
              <DealStart playerTotal={playerTotal} cpuHand={cpuHand} />
            </>
          )}

          {!startDeal && (
            <>
              <div className="hidden md:flex items-center justify-center">
                <p className="uppercase text-xl font-medium text-white mr-2">
                  bet
                </p>
                <DollarSignIcon stroke="white" />
                <AnimatedNumber
                  className="inline-flex items-center font-mono text-2xl font-light text-white"
                  springOptions={{
                    bounce: 0,
                    duration: 500,
                  }}
                  value={yourBet}
                />
              </div>

              <Button
                onClick={() => {
                  setDealStart(() => {
                    drawCard();
                    return true;
                  });
                }}
                size={"lg"}
                variant={"secondary"}
                disabled={!yourBet}
                className="w-max uppercase p-6 font-bold gap-2"
              >
                <HandshakeIcon /> Deal
              </Button>
            </>
          )}
        </div>

        <motion.div
          className={cn(
            "bg-zinc-950 p-4 md:py-8 md:px-6 flex flex-col items-center gap-4 md:gap-6 rounded-xl ",

            startDeal && "relative"
          )}
        >
          {startDeal && (
            <DealStart playerTotal={playerTotal} playerHand={playerHand} />
          )}
          {!startDeal && (
            <>
              <div className="p-2 rounded-md bg-green-600 flex items-center justify-center">
                <p className="text-white text-lg">Bank</p>
                <DollarSignIcon className="ml-1" stroke="white" />
                <AnimatedNumber
                  className="inline-flex items-center font-mono text-xl font-light text-white"
                  springOptions={{
                    bounce: 0,
                    duration: 500,
                  }}
                  value={yourBank}
                />
              </div>

              {2000 > 1 && (
                <div className="flex items-center justify-center flex-wrap">
                  {CHIP_VALUES.map((chip) => (
                    <AnimatePresence key={chip.fill}>
                      {yourBank >= chip.value && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{
                            scale: 0,
                          }}
                          transition={{ duration: 0.2 }}
                          onClick={() => {
                            setYourBank((prev) => prev - chip.value);
                            setYourBet((prev) => prev + chip.value);
                          }}
                          className="p-0"
                        >
                          <Chip fill={chip.fill} value={chip.value} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex items-center justify-center gap-2">
            {startDeal && (
              <>
                <Button
                  disabled={playerTotal === 21}
                  onClick={() => playerHit()}
                  size={"lg"}
                  variant={playerTotal === 21 ? "destructive" : "default"}
                  className="w-max uppercase gap-2"
                >
                  <CirclePlusIcon />
                  Hit
                </Button>

                <Button
                  onClick={() => {
                    if (
                      cpuHand.reduce((acc, val) => acc + val.cardValue, 0) <
                        17 &&
                      Math.round(Math.random()) === 1
                    ) {
                      setCPUHand((prev) => {
                        playerStand([...prev, deck.pop()!]);
                        return [...prev, deck.pop()!];
                      });
                    } else {
                      playerStand(cpuHand);
                    }
                  }}
                  size={"lg"}
                  className={cn(
                    "w-max uppercase gap-2",
                    playerTotal === 21 &&
                      "animate-bounce bg-green-700 hover:bg-green-600"
                  )}
                >
                  <Hand />
                  Stand
                </Button>
              </>
            )}
            {!startDeal && (
              <>
                <Button
                  disabled={!yourBank}
                  onClick={() => {
                    setYourBank(0);
                    setYourBet((prev) => prev + yourBank);
                  }}
                  className="w-max gap-2"
                >
                  <BookUpIcon />
                  All in
                </Button>

                <Button
                  disabled={!yourBet}
                  onClick={() => {
                    setYourBank((prev) => prev + yourBet);
                    setYourBet(0);
                  }}
                  className="w-max gap-2"
                >
                  <CircleXIcon /> Clear bet
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </MaxWidthWrapper>
  );
}

export default GameBoard;
