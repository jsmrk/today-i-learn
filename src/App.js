import { useEffect, useState } from "react";
import supabase from "./supabase";

import "./style.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order("created_at", { ascending: false })
          .limit(1000);

        // console.log(error);
        if (!error) setFacts(facts);
        else alert("There was a problem getting data");

        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="loading">Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Today I learned logo" />
        <h1>Today I Learned</h1>
      </div>

      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : " Share a fact"}
      </button>
    </header>
  );
}

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

function isValidHttpUrl(String) {
  let url;
  try {
    url = new URL(String);
  } catch (_) {
    return false;
  }
  return url.protocol === "https:" || url.protocol === "https";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    //1. This is to prevent the browser to reload
    e.preventDefault();

    //2. Check if data is valid, then create a new fact
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      //3. Create a new fact object
      // const newFact = {
      //   id: Math.round(Math.random() * 1000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 24,
      //   votesMindblowing: 9,
      //   votesFalse: 4,
      //   createdIn: new Date().getFullYear(),
      // };

      // 3. uploading fact to supabase ande receive the new fact
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      //4. Add the new fact to the UI, and to the state
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
    }
    //5. Reset input fields
    setText("");
    setSource("");
    setCategory("");

    //6. Close the form
    setShowForm(false);
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a Fact with the world..."
        value={text}
        disabled={isUploading}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Trustworthy Spurse..."
        value={source}
        disabled={isUploading}
        onChange={(e) => setSource(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose Category</option>
        {CATEGORIES.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name.toUpperCase()}
          </option>
        ))}
        <option value="technology">Technology</option>
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <button
          className="btn btn-all-categories"
          onClick={() => setCurrentCategory("all")}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <li key={category.name} className="category">
            <button
              className="btn btn-category"
              onClick={() => setCurrentCategory(category.name)}
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="loading">
        No facts for this category yet, Create the first one now!
      </p>
    );
  } else
    return (
      <section className="fact-section">
        <ul className="facts-list">
          {facts.map((fact) => (
            <Fact key={fact.id} fact={fact} setFacts={setFacts} />
          ))}
        </ul>
        <p>There are {facts.length} facts in the database. Add your own!</p>
      </section>
    );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();

    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  return (
    <li className="fact">
      <div className="fact-details">
        {/* <p className="date-posted">${formattedDate}</p> */}
        <p>
          {isDisputed ? <span className="disputed">[DISPUTED] </span> : null}
          {fact.text}
          <a className="source" href={fact.source}>
            (Source)
          </a>
        </p>
      </div>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find(
            (categories) => categories.name === fact.category
          ).color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍{fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯{fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️{fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
