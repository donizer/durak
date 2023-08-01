import { Card } from "../game/durak";

const CardVisual = (prop: {
  card: Card;
  handleCard: () => void;
  isSelected: boolean;
}) => {
  return (
    <button
      className={`${
        prop.card.getColor() == "red" ? "text-red-600" : "text-black"
      } border-4 ${
        prop.isSelected ? "border-green-600" : ""
      } bg-slate-50 w-16 h-24 m-2`}
      onClick={prop.handleCard}
    >
      {prop.card.getName()}
    </button>
  );
};

export default CardVisual;
