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
  result:
    | "playerWin"
    | "cpuWin"
    | "playerBust"
    | "cpuBust"
    | "bust"
    | "push"
    | null;
  cpuTotal: number | null;
  playerTotal: number | null;
  setYourBet: Dispatch<SetStateAction<number>>;
  setYourBank?: Dispatch<SetStateAction<number>>;
  setGameResult: Dispatch<SetStateAction<GameResult | null>>;
  setDealStart: Dispatch<SetStateAction<boolean>>;
  setCPUHand: Dispatch<
    SetStateAction<
      {
        value: string;
        cardValue: number;
        suit: string;
        imageUrl: string;
      }[]
    >
  >;
  setPlayerHand: Dispatch<
    SetStateAction<
      {
        value: string;
        cardValue: number;
        suit: string;
        imageUrl: string;
      }[]
    >
  >;
}

function ResultModal({ gameResult }: { gameResult: GameResult }) {
  function result(result: GameResult["result"]) {
    switch (result) {
      case "playerWin":
        return "You won";
      case "cpuWin":
        return "Dealer won";
      case "bust":
        return "Bust";
      case "playerBust":
        return "Bust";
      case "cpuBust":
        return "Dealer bust";
      case "push":
        return "Push";
      default:
        break;
    }
  }

  function handleResults(result: GameResult["result"]) {
    switch (result) {
      case "playerWin":
        gameResult.setGameResult(null);
        gameResult.setYourBet(0);
        gameResult.setDealStart(false);
        return;
      case "cpuWin":
        if (gameResult.setYourBank) {
          gameResult.setYourBank(2000);
        }
        gameResult.setYourBet(0);
        gameResult.setGameResult(null);
        gameResult.setDealStart(false);
        return;
      case "bust":
        if (gameResult.setYourBank) {
          gameResult.setYourBank(2000);
        }
        gameResult.setGameResult(null);
        gameResult.setYourBet(0);
        gameResult.setDealStart(false);
        return;
      case "playerBust":
        if (gameResult.setYourBank) {
          gameResult.setYourBank(2000);
        }
        gameResult.setPlayerHand([]);
        gameResult.setCPUHand([]);
        gameResult.setGameResult(null);
        gameResult.setDealStart(false);
        gameResult.setYourBet(0);
        return;
      case "cpuBust":
        gameResult.setPlayerHand([]);
        gameResult.setCPUHand([]);
        gameResult.setGameResult(null);
        gameResult.setDealStart(false);
        gameResult.setYourBet(0);
        return;
      case "push":
        if (gameResult.setYourBank) {
          gameResult.setYourBank(0);
        }
        gameResult.setGameResult(null);
        gameResult.setYourBet((prev) => prev);
        gameResult.setDealStart(false);
        return;
      default:
        break;
    }
  }

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader className="rounded-md bg-zinc-800 p-8 w-max mx-auto">
          <DialogTitle className="text-white text-center uppercase font-bold">
            {result(gameResult.result)}!
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
          <DialogClose className="w-full" asChild>
            <Button
              size={"lg"}
              onClick={() => {
                handleResults(gameResult.result);
              }}
              className="w-full"
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
