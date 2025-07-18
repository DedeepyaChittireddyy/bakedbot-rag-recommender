import React, { useEffect, useState } from "react";
import './App.css';

const BACKEND = "http://localhost:8000";

export default function App() {
  const [effects, setEffects] = useState([]);
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND}/effects`)
      .then(res => res.json())
      .then(data => setEffects(data.effects));
  }, []);

  async function getRecs() {
    if (!selected.length) return;
    setLoading(true);
    setResults([]); setMessage("");
    const params = selected.join(",");
    const res = await fetch(`${BACKEND}/recommendations?effect=${params}`);
    const data = await res.json();
    setResults(data.recommendations);
    setMessage(data.message || "");
    setLoading(false);
  }

  function toggleFavorite(prod) {
    setFavorites(favs => favs.some(f => f.id === prod.id)
      ? favs.filter(f => f.id !== prod.id)
      : [...favs, prod]
    );
  }

  return (
    <div className="main-bg">
      <header className="topbar">
        <span className="logo">BakedBot<span className="logo-dot">.</span>ai</span>
        <span className="header-sub">AI Product Recommender</span>
      </header>
      <div className="content">
        <section className="search-panel">
          <h2>Find Your Product</h2>
          <p className="subtitle">Select one or more <b>effects</b> for personalized recommendations.</p>
          <div className="search-row">
            <select
              className="effect-select"
              multiple
              value={selected}
              onChange={e => setSelected([...e.target.selectedOptions].map(o => o.value))}
            >
              {effects.map(eff => (
                <option key={eff} value={eff}>{eff.charAt(0).toUpperCase() + eff.slice(1)}</option>
              ))}
              <option value="surprise">Surprise me!</option>
            </select>
            <button className="rec-btn" onClick={getRecs} disabled={loading}>
              {loading ? "Thinking..." : "Get Recommendations"}
            </button>
          </div>
        </section>
        {message && <div className="info-message">{message}</div>}
        <section>
          {results.length === 0 && !message && !loading && <div className="faded">No results yet.</div>}
          <div className="cards-grid">
            {results.map(prod => (
              <div key={prod.id} className="card-pro">
                <div className="card-top">
                  <h3 className="card-title">{prod.name}</h3>
                  <span className="card-price">${prod.price}</span>
                </div>
                <div className="card-ingredients">
                  {prod.ingredients.map(i => (
                    <span className="ingredient-chip" key={i}>{i}</span>
                  ))}
                </div>
                <div className="card-desc">{prod.augmented_description}</div>
                {prod.compliance_warning &&
                  <div className="compliance-warning">⚠️ Compliance Notice: Contains restricted ingredient!</div>
                }
                <div className="card-actions">
                  <button className="why-btn" onClick={() => setModal(prod)}>
                    Why?
                  </button>
                  <button
                    className={favorites.some(f => f.id === prod.id) ? "fav-btn favorited" : "fav-btn"}
                    onClick={() => toggleFavorite(prod)}
                  >
                    {favorites.some(f => f.id === prod.id) ? "★ Favorite" : "☆ Favorite"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="favorites-section">
          <h4>⭐ Favorites</h4>
          {favorites.length === 0 ? <div className="faded">No favorites yet.</div> :
            <div className="fav-chips">
              {favorites.map(f => <span className="ingredient-chip fav-chip" key={f.id}>{f.name}</span>)}
            </div>
          }
        </section>
      </div>
      {modal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Why we recommend {modal.name}</h3>
            <div>{modal.explanation}</div>
            <button className="close-btn" onClick={() => setModal(null)}>Close</button>
          </div>
        </div>
      )}
      <footer className="footer">
        <span>BakedBot.ai &copy; {new Date().getFullYear()} &nbsp;|&nbsp; Built by Dedeepya</span>
      </footer>
    </div>
  );
}
