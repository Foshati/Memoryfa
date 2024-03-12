import "./App.css";

const cardImages = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
];

export default function App() {
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages];
    console.log(shuffledCards);
  };
  return (
    <div>
      <h1 className="m-8 text-5xl font-bold text-yellow-200">Memoryfa</h1>
      <button
        className="px-2 py-4 m-4 rounded-2xl bg-slate-600"
        onClick={shuffleCards}
      >
        New game
      </button>
    </div>
  );
}
