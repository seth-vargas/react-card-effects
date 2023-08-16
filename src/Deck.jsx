import React, { useEffect, useState, useRef } from "react";
import Card from "./Card";

export default function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [autoDrawCards, setAutoDrawCards] = useState(false);
  const timerRef = useRef(null);

  async function getCard() {
    const { deck_id } = deck;

    try {
      const res = await fetch(
        `https://www.deckofcardsapi.com/api/deck/${deck_id}/draw/`
      );
      const data = await res.json();

      if (data.remaining === 0) {
        setAutoDrawCards(false);
        alert("No cards remaining!");
        return;
      }

      const card = data.cards[0];

      setDrawnCards((deck) => [
        ...deck,
        [
          {
            id: card.code,
            name: `${card.suit} ${card.value}`,
            image: card.image,
          },
        ],
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function getData() {
      const res = await fetch(
        "https://www.deckofcardsapi.com/api/deck/new/shuffle/"
      );
      const data = await res.json();
      setDeck(data);
    }
    getData();
  }, [setDeck]);

  useEffect(() => {
    if (autoDrawCards && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoDrawCards, setAutoDrawCards, deck]);

  function toggleAutoDraw() {
    setAutoDrawCards((isAuto) => !isAuto);
  }

  function handleClick() {
    getCard();
  }

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={handleClick}>Get a card</button>
      {deck ? (
        <button onClick={toggleAutoDraw}>
          {autoDrawCards ? "Stop" : "Start"}
        </button>
      ) : null}
      <div style={{ marginTop: "50px" }}>
        {drawnCards.map(([card]) => (
          <Card key={card.id} image={card.image} />
        ))}
      </div>
    </div>
  );
}
