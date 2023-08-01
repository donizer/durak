import { useState } from "react";
import "./index.css";
import { DurakGame } from "./game/durak";
import CardVisual from "./components/CardVisual";

const game = new DurakGame();

function App() {
  const [counter, setCounter] = useState(0);
  const addPlayersOnClick = () => {
    enum names {
      "donizer",
      "snap",
      "mugnum dong",
      "Kitty Destroyer",
    }
    const playersNum = game.getPlayers().length;
    switch (true) {
      case playersNum < 4:
        game.addPlayer(names[playersNum]);
        break;
      default:
        console.log("Already 4 players");
    }
  };
  const setUpGameOnClick = () => {
    game.setupGame();
    game.startRound();
    if (counter == 0) setCounter(-1);
    else setCounter(0);
  };

  return (
    <div className="flex flex-col justify-center">
      {/*options*/}
      <div className="flex">
        <button className="bg-slate-300 w-1/5" onClick={addPlayersOnClick}>
          Add Player
        </button>
        <button className="bg-slate-300 w-1/5" onClick={setUpGameOnClick}>
          Setup Game
        </button>
        <div className="bg-green-500 w-1/5 text-center">
          {game.getLeadAttacker()?.getName()}⚔️
        </div>
        <div className="bg-blue-500 w-1/5 text-center ">
          {game.getDefender()?.getName()}🛡️
        </div>
        <div className={`bg-slate-300 w-1/5 text-center `}>
          <span
            className={`${
              game.getTrumpCard()?.getColor()
                ? game.getTrumpCard()?.getColor() == "red"
                  ? "text-red-600"
                  : "text-black"
                : ""
            }`}
          >
            {game.getTrumpCard()?.getName()}
          </span>
          : {game.getDeck().getArray().length}
          /36
        </div>
      </div>
      <div className="flex ">
        <div className="w-4/5 flex flex-wrap">
          {game.getPlayers().length > 0
            ? game.getPlayers().map((player, playerIndex) => {
                const handlePass = () => {
                  if (game.getCurRound()?.getAllCards().length == 0) return;
                  const isPass = player.getIsPass();
                  player.setIsPass(!isPass);
                };
                return (
                  <div
                    key={playerIndex}
                    className="bg-slate-400 w-2/4 border-4 select-none flex flex-col grow-0"
                  >
                    <div
                      className={`${
                        player.getId() == game.getLeadAttacker()?.getId()
                          ? "bg-green-500"
                          : player.getId() == game.getDefender()?.getId()
                          ? "bg-blue-500"
                          : "bg-slate-600"
                      } text-center`}
                    >
                      {player?.getName()}
                      {player.getId() == game.getLeadAttacker()?.getId()
                        ? "⚔️"
                        : player.getId() == game.getDefender()?.getId()
                        ? "🛡️"
                        : ""}
                    </div>
                    <div className="flex flex-wrap justify-start  ">
                      {player
                        .getHand()
                        .getArray()
                        .map((card, cardIndex) => {
                          const handleCard = () => {
                            const truePlayer = game.getPlayers()[playerIndex];
                            const trueCard = truePlayer.getHand().getArray()[
                              cardIndex
                            ];
                            const isNoSelectedCards = truePlayer
                              .getHand()
                              .getArray()
                              .map((card) => {
                                return card.getIsSelected();
                              })
                              .every((element) => element === false);
                            const lastSelectedCard = truePlayer
                              .getHand()
                              .getArray()
                              .findLast(
                                (element) => element.getIsSelected() === true
                              );
                            if (card.getIsSelected())
                              trueCard.setIsSelected(false);
                            else if (isNoSelectedCards)
                              trueCard.setIsSelected(true);
                            else if (!trueCard.compareValue(lastSelectedCard)) {
                              truePlayer
                                .getHand()
                                .getArray()
                                .map((card) => {
                                  card.setIsSelected(false);
                                });
                              trueCard.setIsSelected(true);
                            } else trueCard.setIsSelected(true);
                            setCounter(counter + 1);
                            console.log(
                              game.getPlayers().map((player) =>
                                player
                                  .getHand()
                                  .getArray()
                                  .map((card) => card.getIsSelected())
                              )
                            );
                          };
                          return (
                            <CardVisual
                              key={cardIndex}
                              handleCard={handleCard}
                              card={card}
                              isSelected={card.getIsSelected()}
                            ></CardVisual>
                          );
                        })}

                      <button
                        className={`border-4 ${
                          player.getIsPass() ? "bg-green-500" : "bg-red-500"
                        } w-16 h-24 m-2`}
                        onClick={handlePass}
                      >
                        {player.getIsPass() ? "pass" : "not pass"}
                      </button>
                      <button
                        className={`border-4 ${
                          player.getIsPass() ? "bg-green-500" : "bg-red-500"
                        } w-16 h-24 m-2`}
                        onClick={handlePass}
                      >
                        Move card(s)
                      </button>
                    </div>
                  </div>
                );
              })
            : ""}
          <div className="grow bg-yellow-700 border-4">field</div>
        </div>
        <div className="w-1/5">
          <div className="flex flex-wrap justify-evenly bg-slate-600 min-w-full min-h-full border-4">
            {game
              .getDeck()
              .getArray()
              .map((card, key) => {
                return (
                  <button
                    className={`${
                      card.getColor() == "red" ? "text-red-600" : "text-black"
                    } border-4 bg-slate-50 w-16 h-24 m-2`}
                    key={key}
                  >
                    {card.getName()}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
