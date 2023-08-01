type CardLegendType = {
  value: defaultValuesType[];
  sign: defaultSignType[];
};

type defaultSignType = "♣" | "♦" | "♥" | "♠";
type defaultValuesType = "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export const cardLegend36: CardLegendType = {
  value: ["6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  sign: ["♣", "♦", "♥", "♠"],
};

export class Card {
  private value: number;
  private sign: number;
  private name: string;
  private color: "red" | "black";
  private holder: Player | null;
  private isSelected: boolean;

  constructor(value: number, sign: number) {
    this.value = value;
    this.sign = sign;
    this.name = `${cardLegend36.sign[this.sign]}${
      cardLegend36.value[this.value]
    }`;
    this.color =
      this.getSign() == "♠" || this.getSign() == "♣" ? "black" : "red";
    this.holder = null;
    this.isSelected = false;
  }

  compareValue(this: Card, card: Card | undefined) {
    if (card) if (this.getValue() == card.getValue()) return true;
    return false;
  }

  getIsSelected(): boolean {
    return this.isSelected;
  }

  setIsSelected(value: boolean): boolean {
    return (this.isSelected = value);
  }

  setHolder(player: Player): Player {
    return (this.holder = player);
  }

  getHolder(): Player | null {
    return this.holder;
  }

  getName(): string {
    return this.name;
  }

  getSign(): defaultSignType {
    return cardLegend36.sign[this.sign];
  }

  getValue(): number {
    return this.value;
  }

  getColor() {
    return this.color;
  }
}

export class Deck {
  private cards: Card[];

  constructor() {
    this.cards = [];
  }

  shuffle(): Card[] {
    let curIndex = this.cards.length,
      rndIndex;

    while (curIndex !== 0) {
      rndIndex = Math.floor(Math.random() * curIndex);
      curIndex--;

      [this.cards[curIndex], this.cards[rndIndex]] = [
        this.cards[rndIndex],
        this.cards[curIndex],
      ];
    }
    return this.cards;
  }

  getByIndex(index: number): Card | undefined {
    return this.cards[index];
  }

  getSize(): number {
    return this.cards.length;
  }

  getTrumpCard(): Card {
    return this.cards[0];
  }

  popTopDeck(): Card | undefined {
    return this.cards.pop();
  }

  push(card: Card) {
    this.cards.push(card);
  }

  shiftTopDeck(): Card | undefined {
    return this.cards.shift();
  }

  getBotDeck(): Card | undefined {
    return this.cards[0];
  }

  getArray(): Card[] {
    return this.cards;
  }

  throwByIndex(index: number): Card {
    const card = this.cards[index];
    this.cards.splice(index, 1);
    return card;
  }
}

export class Player {
  private name: string;
  private hand: Deck;
  private id: number;
  private game: DurakGame;
  private isPass: boolean;

  constructor(game: DurakGame, name: string, id: number) {
    this.name = name;
    this.hand = new Deck();
    this.id = id;
    this.game = game;
    this.isPass = false;
  }

  getIsPass(): boolean {
    return this.isPass;
  }

  setIsPass(bool: boolean): boolean {
    return (this.isPass = bool);
  }

  makeNewHand(): Deck {
    return (this.hand = new Deck());
  }

  getInstanceOfGame(): DurakGame {
    return this.game;
  }

  getName(): string {
    return this.name;
  }

  getHand(): Deck {
    return this.hand;
  }

  getId(): number {
    return this.id;
  }

  sortHand(): Card[] {
    return this.hand.getArray().sort((a: Card, b: Card): number => {
      if (a.getValue() < b.getValue()) return -1;
      else if (a.getValue() > b.getValue()) return 1;
      else {
        // If values are equal, compare by sign
        if (a.getSign() < b.getSign()) return -1;
        else if (a.getSign() > b.getSign()) return 1;
        // If both value and sign are equal, consider cards as the same
        else return 0;
      }
    });
  }
}

export class DurakRound {
  private game: DurakGame;
  // private trumpSign: defaultSignType; //todo trump
  private attackCards: Card[];
  private defenseCards: Card[];
  private roundValues: number[];

  constructor(game: DurakGame) {
    //,sign: defaultSignType
    this.game = game;
    // this.trumpSign = sign;
    this.attackCards = [];
    this.defenseCards = [];
    this.roundValues = [];
  }

  addAttackCard(card: Card) {
    this.attackCards.push(card);
    this.roundValues.map((value) => {
      value === card.getValue();
    });
  }

  addDefendCard(card: Card) {
    this.defenseCards.push(card);
  }

  getAttackCards(): Card[] {
    return this.attackCards;
  }

  getDefenseCards(): Card[] {
    return this.defenseCards;
  }

  checkAttackCard(card: Card) {
    if (this.attackCards.length === 0) return true;
    for (const attackCard of this.attackCards) {
      if (card.getValue() === attackCard.getValue()) return true;
    }
    return false;
  }

  //todo possible need rewrite
  checkDefenceCard(card: Card) {
    if (this.defenseCards.length === 0) return false;

    const attackValues = this.attackCards.map((card) => card.getValue());
    const defenseValue = card.getValue();

    // If the defender has a card with a higher value than any of the attack cards,
    // then the defense is valid.
    return attackValues.every((value) => defenseValue > value);
  }

  getAllCards(): Card[] {
    return [...this.defenseCards, ...this.attackCards];
  }

  finish(): Card[] {
    this.game.setTurn(this.game.getTurn() + 1);
    return this.getAllCards();
  }
}

export class DurakGame {
  private players: Player[];
  private deck: Deck;
  private cardDump: Deck;
  private curRound: DurakRound | null;
  private leadAttacker: Player | null;
  private defender: Player | null;
  private trumpSign: defaultSignType | null;
  private trumpCard: Card | null;
  private isGameOver: boolean;
  private turn: number;

  constructor() {
    this.players = [];
    this.deck = new Deck();
    this.cardDump = new Deck();
    this.curRound = null;
    this.leadAttacker = null;
    this.defender = null;
    this.trumpSign = null;
    this.turn = 0;
    this.isGameOver = false;
    this.trumpCard = null;
  }

  addPlayer(name: string, id = this.players.length + 1): Player {
    if (this.players.length >= 4) throw new Error("Too much players");
    return this.players[
      this.players.push(new Player(this, `${name} ${id}`, id))
    ];
  }

  getCardDump() {
    return this.cardDump;
  }

  setCardDump(dump: Deck) {
    return (this.cardDump = dump);
  }

  setupGame() {
    if (this.players.length < 2) throw new Error("Need at Least 2 players");
    for (const player of this.players) {
      player.makeNewHand();
    }
    this.unsetStates();
    this.fillDeck();
    this.getDeck().shuffle();
    this.defineTrump();
    this.dealCards();
    this.defineLeadAttacker();
    this.defineDefender();
  }

  unsetStates() {
    this.deck = new Deck();
    this.curRound = null;
    this.leadAttacker = null;
    this.defender = null;
    this.trumpSign = null;
    this.turn = 0;
    this.isGameOver = false;
  }

  getIsGameOver(): boolean {
    return this.isGameOver;
  }

  setIsGameOver(value: boolean): void {
    this.isGameOver = value;
  }

  fillDeck(): void {
    for (let i = 0; i < cardLegend36.value.length; i++) {
      for (let j = 0; j < cardLegend36.sign.length; j++) {
        this.deck.push(new Card(i, j));
      }
    }
  }

  defineTrump(): void {
    this.trumpSign = this.deck.getArray()[0].getSign();
    this.trumpCard = this.deck.getArray()[0];
  }

  dealCards(): void {
    const cardsLeftInDeck = this.deck.getArray().length;
    const maxHandSize = 6;

    // Calculate the total cards needed to fill all hands equally
    const cardsNeeded = this.players.reduce((total, player) => {
      const cardsInHand = player.getHand().getArray().length;
      return total + Math.max(0, maxHandSize - cardsInHand);
    }, 0);

    if (cardsLeftInDeck >= cardsNeeded) {
      // Deal cards equally to all players' hands
      for (const player of this.players) {
        const cardsInHand = player.getHand().getArray().length;
        const cardsToAdd = Math.max(0, maxHandSize - cardsInHand);

        for (let j = 0; j < cardsToAdd; j++) {
          const card = this.deck.popTopDeck() as Card;
          card.setHolder(player);
          player.getHand().push(card);
        }

        player.sortHand();
      }
    } else {
      // Not enough cards in the deck to fill hands equally, distribute the remaining cards evenly
      const cardsToDealPerPlayer = Math.floor(
        cardsLeftInDeck / this.players.length
      );

      for (const player of this.players) {
        const cardsInHand = player.getHand().getArray().length;
        const cardsToAdd = Math.min(
          maxHandSize - cardsInHand,
          cardsToDealPerPlayer
        );

        for (let j = 0; j < cardsToAdd; j++) {
          const card = this.deck.popTopDeck() as Card;
          card.setHolder(player);
          player.getHand().push(card);
        }

        player.sortHand();
      }
    }
  }

  defineLeadAttacker() {
    // Get the first player who has the lowest trump card in their hand.
    let lowestTrumpCardValue = Infinity;
    let leadAttacker: Player | null = null;

    for (const player of this.players) {
      const hand = player.getHand().getArray();
      for (const card of hand) {
        if (
          card.getSign() === this.trumpSign &&
          card.getValue() < lowestTrumpCardValue
        ) {
          lowestTrumpCardValue = card.getValue();
          leadAttacker = player;
        }
      }
    }

    if (leadAttacker === null) {
      console.log(this);
      console.log("restart");
      return this.setupGame(); //todo not sure if it works as expected
    }

    return (this.leadAttacker = leadAttacker);
  }

  defineDefender(): Player | null {
    if (this.leadAttacker == null) return null;

    const attackerIndex = this.players.indexOf(this.leadAttacker);
    const defenderIndex = (attackerIndex + 1) % this.players.length;

    this.defender = this.players[defenderIndex];
    return this.defender;
  }

  makeNewDeck(): Deck {
    return (this.deck = new Deck());
  }

  startRound() {
    if (this.trumpSign == null) throw new Error("Fill deck first");
    this.curRound = new DurakRound(this); // ,this.trumpSign //todo
  }

  getTrumpSign(): defaultSignType | null {
    return this.trumpSign;
  }

  getTrumpCard(): Card | null {
    return this.trumpCard;
  }

  getDeck(): Deck {
    return this.deck;
  }

  getLeadAttacker(): Player | null {
    return this.leadAttacker;
  }

  getDefender(): Player | null {
    return this.defender;
  }

  getCurRound(): DurakRound | null {
    return this.curRound;
  }

  getTurn(): number {
    return this.turn;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getPlayersNum(): number {
    return this.players.length;
  }

  setTurn(number: number) {
    this.turn = number;
  }
}
