import { useEffect, useState } from "react";
import supabase from "./supabase";

import "./style.css";

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

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((category) => (
          <Category
            category={category}
            key={category.name}
            setCurrentCategory={setCurrentCategory}
          />
        ))}
      </ul>
    </aside>
  );
}

function Category({ category, setCurrentCategory }) {
  return (
    <li className="category">
      <button
        className="btn btn-category"
        style={{ backgroundColor: category.color }}
        onClick={() => setCurrentCategory(category.name)}
      >
        {category.name}
      </button>
    </li>
  );
}

function FactsList({ facts }) {
  if (facts.length === 0) {
    return (
      <Message
        message={
          "No facts found for this category yet! Create the first one 🤘"
        }
      />
    );
  }

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
  const color = CATEGORIES.find(
    (category) => category.name === fact.category
  ).color;

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
          backgroundColor: color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button>👍 {fact.votestInteresting}</button>
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
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function onSubmitHandler(e) {
    e.preventDefault();
    if (!text || !isValidHttpUrl(source) || !category) return;

    setIsUploading(true);
    const {
      data: [newFact],
      error,
    } = await supabase
      .from("facts")
      .insert([{ text, source, category }])
      .select();
    setIsUploading(false);

    if (error) {
      console.log({ error: error.message });
      alert("An error occured while inserting new fact!");
    }

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
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        required
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        required
        onChange={(e) => setCategory(e.target.value)}
        value={category}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        {isUploading ? "Uploading..." : "Post"}
      </button>
    </form>
  );
}

function Message({ message }) {
  return <p className="message">{message ? message : "Loading..."}</p>;
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [facts, setFacts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(() => {
    async function getFacts() {
      setIsLoading(true);

      let query = supabase.from("facts").select("*");

      if (currentCategory !== "all")
        query = query.eq("category", currentCategory);

      let { data: facts, error } = await query
        .order("votestInteresting", { ascending: false })
        .limit(20);
      if (!error) setFacts(facts);
      else alert("There was an error while fetching data!");
      setIsLoading(false);
    }
    getFacts();
  }, [currentCategory]);

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
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Message /> : <FactsList facts={facts} />}
      </main>
    </>
  );
}

export default App;
