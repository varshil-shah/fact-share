import { useState } from "react";
import { isValidHttpUrl } from "../utils/utils";
import supabase from "../supabase";
import CATEGORIES from "../data/categories";

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

    if (!error) onAddNewFact(newFact);

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

export default FactForm;
