import { createContext, useState } from "react";
import { DurakGame, Player } from "../game/durak";

const iGlobalContext: GlobalContextType = {
  game: {} as DurakGame,
  setGame: () => null,
  players: [],
  setPlayers: () => null,
};
export const DurakContext = createContext<GlobalContextType>(iGlobalContext);

const Context = ({ children }: { children: React.ReactNode }) => {
  const [game, setGame] = useState<DurakGame>(new DurakGame());
  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <DurakContext.Provider value={{ game, setGame, players, setPlayers }}>
      {children}
    </DurakContext.Provider>
  );
};

export default Context;

type GlobalContextType = {
  game: DurakGame;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setGame: React.Dispatch<React.SetStateAction<DurakGame>>;
};
