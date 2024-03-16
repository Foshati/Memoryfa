import { useEffect, useState } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";
import Modal from "./components/Modal";

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [matchedPairsCount, setMatchedPairsCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    setPlayers(storedPlayers);
  }, []);

  useEffect(() => {
    const storedLevel = localStorage.getItem(`${username}-level`);
    if (storedLevel) {
      setLevel(parseInt(storedLevel));
    }
  }, [username]);

  const generateCardImages = (level) => {
    const items = [
      { src: "/img/helmet-1.png", matched: false },
      { src: "/img/potion-1.png", matched: false },
      { src: "/img/ring-1.png", matched: false },
      { src: "/img/scroll-1.png", matched: false },
      { src: "/img/shield-1.png", matched: false },
      { src: "/img/sword-1.png", matched: false },
    ];

    const cardImages = [];
    const uniqueCards = new Set();

    let pairsCount = 0;

    while (pairsCount < level) {
      const randomIndex = Math.floor(Math.random() * items.length);
      const randomItem = items[randomIndex];
      if (!uniqueCards.has(randomItem.src)) {
        cardImages.push(randomItem, { ...randomItem });
        uniqueCards.add(randomItem.src);
        pairsCount++;
      }
    }

    for (let i = 0; i < 2; i++) {
      cardImages.push({ src: "/img/bomb.jpg", matched: false });
    }

    return cardImages;
  };

  const shuffleCards = () => {
    const shuffledCards = generateCardImages(level)
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setMatchedPairsCount(0);
  };

  const handleChoice = (card) => {
    if (!disabled && !card.matched) {
      choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurn) => prevTurn + 1);
    setDisabled(false);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);

      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });

        setMatchedPairsCount((prevCount) => prevCount + 1);

        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    const nonBombCards = cards.filter((card) => card.src !== "/img/bomb.jpg");
    const allNonBombMatched = nonBombCards.every((card) => card.matched);
    const totalNonBombPairs = nonBombCards.length / 2;

    if (allNonBombMatched) {
      if (matchedPairsCount === totalNonBombPairs) {
        // All non-bomb pairs are matched
        setTimeout(() => setLevel((prevLevel) => prevLevel + 1), 1000);
      } else {
        // Not all non-bomb pairs are matched
        setTimeout(() => setLevel(1), 1000);
      }
      resetTurn();
    }
  }, [cards, matchedPairsCount]);

  useEffect(() => {
    shuffleCards();
  }, [level]);

  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem(`${username}-level`, level.toString());
    }
  }, [level, loggedIn, username]);

  const handleStartGame = (username) => {
    setUsername(username);
    setShowModal(false);
    setLoggedIn(true);
    const newPlayers = [...players, username];
    setPlayers(newPlayers);
    shuffleCards();
  };

  const handleLogout = () => {
    setUsername("");
    setLoggedIn(false);
    localStorage.removeItem(`${username}-level`);
  };

  return (
    <div className="App">
      <h1 className="m-4 text-4xl text-yellow-500">Memoryfa</h1>

      <header className="header">
        {!loggedIn && (
          <button
            className="p-4 m-4 text-black login-btn rounded-3xl bg-slate-400"
            onClick={() => setShowModal(true)}
          >
            Start Game
          </button>
        )}
      </header>
      {showModal && <Modal onStartGame={handleStartGame} />}
      {loggedIn && (
        <>
          <p className="m-4 text-cyan-50">Player: {username}</p>
          <button
            className="p-4 m-4 text-black rounded-3xl bg-slate-400"
            onClick={() => setLevel(1)}
          >
            New Game
          </button>
          {loggedIn && (
            <button
              className="p-4 m-4 text-black logout-btn rounded-3xl bg-slate-400"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
          <div className="card-grid">
            {cards.map((card) => (
              <SingleCard
                key={card.id}
                card={card}
                handleChoice={handleChoice}
                flipped={
                  card === choiceOne || card === choiceTwo || card.matched
                }
                disabled={disabled}
              />
            ))}
          </div>
          <p className="text-cyan-50">Turns: {turns}</p>
          <p className="text-cyan-50">Level: {level}</p>
        </>
      )}

      <div className="players-list">
        <h2>Players List</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
