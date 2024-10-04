import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";

export interface GameResult {
  result: "playerWin" | "cpuWin" | "bust" | "push" | null;
  cpuTotal: number | null;
  playerTotal: number | null;
  setDealStart: Dispatch<SetStateAction<boolean>>;
  setYourBet: Dispatch<SetStateAction<number>>;
  setPlayerHand: (
    value: SetStateAction<
      {
        value: string;
        cardValue: number;
        suit: string;
        imageUrl: string;
      }[]
    >
  ) => void;
  setCPUHand: (
    value: SetStateAction<
      {
        value: string;
        cardValue: number;
        suit: string;
        imageUrl: string;
      }[]
    >
  ) => void;

  setIsOpen: Dispatch<SetStateAction<boolean | undefined>>;
  setGameResult: Dispatch<SetStateAction<GameResult | null | undefined>>;
}

function ResultModal({ gameResult }: { gameResult: GameResult }) {
  function result(gameResult: GameResult) {
    switch (gameResult.result) {
      case "playerWin":
        return "You won";
      case "cpuWin":
        return "CPU won";
      case "bust":
        return "Bust";
      case "push":
        return "Push";
      default:
        break;
    }
  }

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader className="rounded-md bg-zinc-800 p-8 w-max mx-auto">
          <DialogTitle className="text-white text-center uppercase font-bold">
            {result(gameResult)}!
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 flex items-center justify-center gap-8">
          <div className="flex flex-col gap-2 items-center justify-center px-4">
            <p className="text-lg font-medium">Player</p>
            <p className="text-2xl font-bold text-green-600">
              {gameResult.playerTotal}
            </p>
          </div>
          <p className="text-xl font-bold">VS</p>
          <div className="flex flex-col gap-2 items-center justify-center px-4">
            <p className="text-lg font-medium">CPU</p>
            <p className="text-2xl font-bold text-red-600">
              {gameResult.cpuTotal}
            </p>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <DialogClose className="w-full">
            <Button
              size={"lg"}
              className="w-full"
              onClick={() => {
                if (gameResult.result === "push") {
                  gameResult.setDealStart(false);
                  gameResult.setIsOpen(false);
                  gameResult.setGameResult(null);
                } else {
                  gameResult.setDealStart(false);
                  gameResult.setYourBet(0);
                  gameResult.setPlayerHand([]);
                  gameResult.setCPUHand([]);
                  gameResult.setIsOpen(false);
                  gameResult.setGameResult(null);
                }
              }}
            >
              {gameResult.result !== "playerWin" ? "Try again" : "Continue"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResultModal;
