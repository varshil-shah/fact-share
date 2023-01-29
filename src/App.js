import { useState } from "react";
import "./style.css";

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function Header({ onShowForm, showForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Today I Learned Logo" />
        <h1>Today I Learned</h1>
      </div>
      <button className="btn btn-large" id="shareAFact" onClick={onShowForm}>
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

function CategoryFilter() {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories">All</button>
        </li>
        {CATEGORIES.map((category) => (
          <Category category={category} key={category.name} />
        ))}
      </ul>
    </aside>
  );
}

function Category({ category }) {
  return (
    <li className="category">
      <button
        className="btn btn-category"
        style={{ backgroundColor: category.color }}
      >
        {category.name}
      </button>
    </li>
  );
}

function FactsList({ facts }) {
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact fact={fact} key={fact.id} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

function Fact({ fact }) {
  return (
    <li className="fact">
      <p>
        {fact.text}
        <a
          className="source"
          href={fact.source}
          target="_blank"
          rel="noreferrer"
        >
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find(
            (category) => category.name === fact.category
          ).color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button>👍 {fact.votesInteresting}</button>
        <button>🤯 {fact.votesMindblowing}</button>
        <button>⛔️ {fact.votesFalse}</button>
      </div>
    </li>
  );
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function FactForm({ onAddNewFact, onShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLength = text.length;

  function onSubmitHandler(e) {
    e.preventDefault();
    if (!text || !isValidHttpUrl(source) || !category) return;

    const newFact = {
      id: Math.round(Math.random() * 10000000),
      text,
      source,
      category,
      votesInteresting: 0,
      votesMindblowing: 0,
      votesFalse: 0,
      createdIn: new Date().getFullYear(),
    };

    // reset all values
    setText("");
    setSource("");
    setCategory("");

    onAddNewFact(newFact);

    // Hide form
    onShowForm(false);
  }

  return (
    <form className="fact-form" onSubmit={onSubmitHandler}>
      <input
        required
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        maxLength={200}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        required
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <select
        required
        onChange={(e) => setCategory(e.target.value)}
        value={category}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large">Post</button>
    </form>
  );
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState(initialFacts);

  const onAddNewFact = (newFact) => setFacts((facts) => [newFact, ...facts]);
  const onShowForm = (value) => setShowForm(value);

  return (
    <>
      <Header
        onShowForm={() => setShowForm((value) => !value)}
        showForm={showForm}
      />
      {showForm && (
        <FactForm onAddNewFact={onAddNewFact} onShowForm={onShowForm} />
      )}
      <main className="main">
        <CategoryFilter />
        <FactsList facts={facts} />
      </main>
    </>
  );
}

export default App;
