import { useState } from "react";
import CATEGORIES from "../data/categories";
import supabase from "../supabase";

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleVotes(columnName) {
    setIsUpdating(true);
    const {
      data: [updatedFact],
      error,
    } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    if (!error) {
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact : f))
      );
    }
  }

  const color = CATEGORIES.find(
    (category) => category.name === fact.category
  ).color;

  const isDisputed =
    fact.votesFalse > fact.votesMindblowing + fact.votestInteresting;

  return (
    <li className="fact">
      <p>
        {isDisputed && <span className="disputed">[⛔DISPUTED]</span>}
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
        <button
          onClick={() => handleVotes("votestInteresting")}
          disabled={isUpdating}
        >
          👍 {fact.votestInteresting}
        </button>
        <button
          onClick={() => handleVotes("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVotes("votesFalse")} disabled={isUpdating}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default Fact;
