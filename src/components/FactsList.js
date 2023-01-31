import Message from "./Message";
import Fact from "./Fact";

function FactsList({ facts, setFacts }) {
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
          <Fact fact={fact} key={fact.id} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

export default FactsList;
