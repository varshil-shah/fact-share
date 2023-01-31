import { useEffect, useState } from "react";
import Header from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import FactForm from "./components/FactForm";
import FactsList from "./components/FactsList";
import Message from "./components/Message";
import supabase from "./supabase";

import "./style.css";

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
        {isLoading ? (
          <Message />
        ) : (
          <FactsList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

export default App;
