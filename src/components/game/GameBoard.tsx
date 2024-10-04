import MaxWidthWrapper from "../MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { CARDS } from "../../data/deck";
import { useEffect, useState } from "react";
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
import Card from "./Card";
import { cn } from "@/lib/utils";
import ResultModal, { GameResult } from "./ResultModal";

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

function GameBoard() {
  const [playerTotal, setPlayerTotal] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean | undefined>(true);
  const [gameResult, setGameResult] = useState<GameResult | null>();
  const [deck, setDeck] = useState<typeof CARDS>(shuffleDeck(CARDS));
  const [playerHand, setPlayerHand] = useState<typeof CARDS>([]);
  const [cpuHand, setCPUHand] = useState<typeof CARDS>([]);
  const [startDeal, setDealStart] = useState<boolean>(false);
  const [yourBank, setYourBank] = useState<number>(2000);
  const [yourBet, setYourBet] = useState<number>(0);

  useEffect(() => {
    if (
      cpuHand.reduce((acc, val) => acc + val.cardValue, 0) < 17 &&
      Math.round(Math.random()) === 1
    ) {
      setCPUHand((prev) => [...prev, deck.pop()!]);
    }
    if (gameResult?.result === "bust") {
      setDeck(shuffleDeck(CARDS));
      setDealStart(false);
      setYourBank(2000);
      return;
    }
    setPlayerTotal(playerHand.reduce((acc, val) => acc + val.cardValue, 0));
  }, [cpuHand, deck, gameResult?.result, playerHand, playerTotal]);

  if (gameResult?.result === "cpuWin" && yourBank === 0) {
    setDeck(shuffleDeck(CARDS));
    setDealStart(false);
    setYourBank(2000);
  }

  function shuffleDeck(deck: typeof CARDS) {
    return deck.sort(() => Math.random() - 0.5);
  }

  function drawCard() {
    const newDeck = [...deck];
    setPlayerHand([newDeck.pop()!, newDeck.pop()!]);
    setCPUHand([newDeck.pop()!, newDeck.pop()!]);
    setDeck(newDeck);
  }

  function calculateHandValue(cpuHand: typeof CARDS, playerHand: typeof CARDS) {
    let playerTotal = 0;
    let cpuTotal = 0;
    let playerAceCount = 0;
    let cpuAceCount = 0;

    playerHand.forEach((card) => {
      const { cardValue } = card;
      if (card.value === "A") playerAceCount++;
      playerTotal += cardValue;
    });

    cpuHand.forEach((card) => {
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
    if (cpu === player) {
      return setGameResult({
        result: "push",
        cpuTotal: cpu,
        playerTotal: player,
        setDealStart,
        setYourBet,
        setCPUHand,
        setPlayerHand,
        setGameResult,
        setIsOpen,
      });
    }

    if (cpu > 21 && player > 21) {
      setDeck(shuffleDeck(CARDS));
      return setGameResult({
        result: "bust",
        cpuTotal: cpu,
        playerTotal: player,
        setDealStart,
        setYourBet,
        setCPUHand,
        setPlayerHand,
        setGameResult,
        setIsOpen,
      });
    }

    if (cpu > 21) {
      setDeck(shuffleDeck(CARDS));
      setYourBank((prev) => prev + yourBet * 2);
      return setGameResult({
        result: "playerWin",
        cpuTotal: cpu,
        playerTotal: player,
        setDealStart,
        setYourBet,
        setCPUHand,
        setPlayerHand,
        setGameResult,
        setIsOpen,
      });
    }
    if (player > 21) {
      setDeck(shuffleDeck(CARDS));
      setYourBank((prev) => prev);
      return setGameResult({
        result: "bust",
        cpuTotal: cpu,
        playerTotal: player,
        setDealStart,
        setYourBet,
        setCPUHand,
        setPlayerHand,
        setGameResult,
        setIsOpen,
      });
    }
    const cpuDiff = 21 - cpu;
    const playerDiff = 21 - player;

    if (cpuDiff < playerDiff) {
      setYourBank((prev) => prev);
      return setGameResult({
        result: "cpuWin",
        cpuTotal: cpu,
        playerTotal: player,
        setDealStart,
        setYourBet,
        setCPUHand,
        setPlayerHand,
        setGameResult,
        setIsOpen,
      });
    } else {
      setYourBank((prev) => prev + yourBet * 2);
      return setGameResult({
        result: "playerWin",
        cpuTotal: cpu,
        playerTotal: player,
        setDealStart,
        setYourBet,
        setCPUHand,
        setPlayerHand,
        setGameResult,
        setIsOpen,
      });
    }
  }

  function playerHit() {
    setPlayerHand((prev) => [...prev, deck.pop()!]);
  }

  return (
    <MaxWidthWrapper className="relative py-4">
      {gameResult && isOpen && <ResultModal gameResult={gameResult} />}
      {startDeal && (
        <div className="flex gap-2 absolute left-10 w-max">
          <Button>
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
          <Button variant={"secondary"}>
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
      <div className="absolute right-10 w-max">
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
      <div className="flex flex-col items-center justify-center gap-8 h-dvh">
        <div className="h-[50%] flex flex-col items-center justify-center gap-6">
          {startDeal && (
            <>
              <DealStart playerTotal={playerTotal} cpuHand={cpuHand} />
            </>
          )}

          {!startDeal && (
            <>
              <div className="flex items-center justify-center">
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
                  setDealStart(true);
                  drawCard();
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

        <div
          className={cn(
            "bg-zinc-950 w-full pt-8 h-[60%] flex flex-col items-center gap-6 rounded-xl",

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

          <div
            className={cn(
              "flex items-center justify-center gap-2",
              startDeal && "absolute bottom-12 p-2"
            )}
          >
            {startDeal && (
              <>
                <Button
                  onClick={() => playerHit()}
                  size={"lg"}
                  className="w-max uppercase gap-2"
                >
                  <CirclePlusIcon />
                  Hit
                </Button>

                <Button
                  onClick={() => {
                    setIsOpen(true);
                    calculateHandValue(cpuHand, playerHand);
                  }}
                  size={"lg"}
                  className="w-max uppercase gap-2"
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
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

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
          <div className="flex items-center justify-center rounded-full absolute -right-32 size-20 bg-zinc-950">
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
              "flex items-center justify-center rounded-full absolute -left-32 size-20 bg-zinc-100",
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

export default GameBoard;
