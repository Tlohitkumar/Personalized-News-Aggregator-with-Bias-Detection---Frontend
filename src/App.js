import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getNews } from "./services/newsService";
import LoginPage from "./LoginPage";
import "./App.css";

/* ── Helpers ──────────────────────────────────────────────── */
function getSentimentClass(sentiment) {
  if (!sentiment) return "neutral";
  const s = sentiment.toLowerCase();
  if (s.includes("positive")) return "positive";
  if (s.includes("negative")) return "negative";
  return "neutral";
}

function getInitial(email) {
  return email ? email[0].toUpperCase() : "U";
}

/* ── Sub-components ───────────────────────────────────────── */

function DashCard({ label, value, icon, variant }) {
  return (
    <div className={`dash-card ${variant ? variant + "-card" : ""}`}>
      <div className="dash-card-label">{label}</div>
      <div className="dash-card-value">{value}</div>
      <span className="dash-card-icon">{icon}</span>
    </div>
  );
}

function TrustBar({ value }) {
  return (
    <div className="trust-bar-wrap">
      <div className="trust-bar-label">
        <span>Trust Score</span>
        <span>{value}%</span>
      </div>
      <div className="trust-bar-track">
        <div className="trust-bar-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function NewsCard({ item, onSave }) {
  const sentClass = getSentimentClass(item.sentiment);
  return (
    <div className="card">
      <div className="card-image-wrap">
        <img
          src={item.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80"}
          alt="news"
        />
        <div className="card-image-overlay" />
      </div>

      <div className="card-body">
        {item.sentiment && (
          <span className={`sentiment-badge ${sentClass}`}>{item.sentiment}</span>
        )}
        <h3>{item.title}</h3>
        {item.description && <p>{item.description}</p>}

        <div className="ai-box">
          <div className="ai-box-title">🧠 AI Report</div>

          {item.sentiment && (
            <div className="ai-row">
              <span className="ai-key">Sentiment</span>
              <span className={`ai-val ${sentClass}`}>{item.sentiment}</span>
            </div>
          )}
          {item.bias && (
            <div className="ai-row">
              <span className="ai-key">Bias</span>
              <span className="ai-val">{item.bias}</span>
            </div>
          )}
          {item.fakeStatus && (
            <div className="ai-row">
              <span className="ai-key">Credibility</span>
              <span className="ai-val">{item.fakeStatus}</span>
            </div>
          )}
          {item.trust !== undefined && <TrustBar value={item.trust} />}
          {item.summary && <p className="ai-summary">{item.summary}</p>}
        </div>
      </div>

      <div className="card-footer">
        <a className="card-link" href={item.url} target="_blank" rel="noreferrer">
          Read Article →
        </a>
        <button className="btn-save" onClick={() => onSave(item)}>
          ♡ Save
        </button>
      </div>
    </div>
  );
}

function FavCard({ item, onDelete }) {
  return (
    <div className="card">
      <div className="card-image-wrap">
        <img
          src={item.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80"}
          alt="saved"
        />
        <div className="card-image-overlay" />
      </div>

      <div className="card-body">
        <h3>{item.title}</h3>
      </div>

      <div className="card-footer">
        <a className="card-link" href={item.url} target="_blank" rel="noreferrer">
          Read Article →
        </a>
        <button className="btn-danger" onClick={() => onDelete(item.id)}>
          Remove
        </button>
      </div>
    </div>
  );
}

const CHART_COLORS = ["#4EAF82", "#E05C5C", "#8A96B0"];

const CUSTOM_TOOLTIP = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        padding: "10px 14px",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "var(--cream)",
        letterSpacing: "0.05em"
      }}>
        <span style={{ color: payload[0].fill }}>{payload[0].name}</span>
        <span style={{ marginLeft: 10, color: "var(--cream-dim)" }}>{payload[0].value}</span>
      </div>
    );
  }
  return null;
};

/* ── Main App ─────────────────────────────────────────────── */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [news, setNews] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [interest, setInterest] = useState("technology");
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  const userEmail = "lohit@gmail.com";

  useEffect(() => {
    if (isLoggedIn) { loadNews(); loadFavorites(); }
  }, [isLoggedIn]);

  const loadNews = () => {
    getNews(keyword)
      .then((res) => setNews(res.data.articles))
      .catch((err) => console.log(err));
  };

  const loadPersonalizedFeed = () => {
    getNews(null, interest)
      .then((res) => setNews(res.data.articles))
      .catch((err) => console.log(err));
  };

  const loadFavorites = () => {
    axios
      .get(`http://localhost:8080/api/favorites/${userEmail}`)
      .then((res) => setFavorites(res.data))
      .catch((err) => console.log(err));
  };

  const addFavorite = (item) => {
    const fav = { title: item.title, url: item.url, imageUrl: item.urlToImage, userEmail };
    axios.post("http://localhost:8080/api/favorites", fav)
      .then(() => loadFavorites())
      .catch((err) => console.log(err));
  };

  const deleteFavorite = (id) => {
    axios.delete(`http://localhost:8080/api/favorites/${id}`)
      .then(() => loadFavorites())
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  /* Stats */
  const totalNews      = news.length;
  const positiveCount  = news.filter(i => i.sentiment?.includes("Positive")).length;
  const negativeCount  = news.filter(i => i.sentiment?.includes("Negative")).length;
  const neutralCount   = news.filter(i => i.sentiment?.includes("Neutral")).length;
  const avgTrust       = news.length
    ? Math.round(news.reduce((s, i) => s + (i.trust || 0), 0) / news.length)
    : 0;

  const chartData = [
    { name: "Positive", value: positiveCount },
    { name: "Negative", value: negativeCount },
    { name: "Neutral",  value: neutralCount  },
  ];

  const navItems = [
    { id: "feed",      icon: "📰", label: "News Feed"    },
    { id: "analytics", icon: "📊", label: "Analytics"    },
    { id: "favorites", icon: "♡",  label: "Saved"        },
  ];

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className={darkMode ? "app-shell container dark" : "app-shell"}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">The Intelligence Bureau</div>
          <div className="logo-sub">News Analysis Platform</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Navigation</div>
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="user-avatar">{getInitial(userEmail)}</div>
            <div className="user-info">
              <div className="user-name">{userEmail.split("@")[0]}</div>
              <div className="user-role">Analyst</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <div className="main-content">

        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-edition">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
            <div className="topbar-divider" />
            <span className="topbar-title">
              {activeTab === "feed"      && "News Feed"}
              {activeTab === "analytics" && "Analytics"}
              {activeTab === "favorites" && "Saved Articles"}
            </span>
          </div>

          <div className="topbar-actions">
            {activeTab === "feed" && (
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadNews()}
                />
                <button className="search-btn" onClick={loadNews}>Search</button>
              </div>
            )}

            <button
              className="btn-icon"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button className="btn-ghost" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </header>

        {/* ── Page Body ─────────────────────────────────────── */}
        <main className="page-body">

          {/* ── FEED TAB ──────────────────────────────────────── */}
          {activeTab === "feed" && (
            <>
              {/* Stats Row */}
              <div className="dashboard">
                <DashCard label="Total Articles"  value={totalNews}     icon="📰" />
                <DashCard label="Positive"        value={positiveCount} icon="😊" variant="positive" />
                <DashCard label="Negative"        value={negativeCount} icon="😡" variant="negative" />
                <DashCard label="Neutral"         value={neutralCount}  icon="😐" variant="neutral"  />
                <DashCard label="Avg. Trust"      value={`${avgTrust}%`} icon="🛡️" variant="trust"   />
              </div>

              {/* Feed Controls */}
              <div className="feed-controls">
                <div className="feed-select-wrap">
                  <span className="feed-select-label">Topic</span>
                  <select
                    className="feed-select"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  >
                    <option value="technology">Technology</option>
                    <option value="sports">Sports</option>
                    <option value="business">Business</option>
                    <option value="health">Health</option>
                  </select>
                </div>
                <button className="btn-primary" onClick={loadPersonalizedFeed}>
                  Load Feed
                </button>
                <button className="btn-ghost" onClick={loadNews}>
                  Refresh
                </button>
              </div>

              {/* Section Header */}
              <div className="section-header">
                <h2 className="section-title">
                  {interest.charAt(0).toUpperCase() + interest.slice(1)} · Latest
                </h2>
                <span className="section-count">{totalNews} articles</span>
                <div className="section-rule" />
              </div>

              {/* News Grid */}
              {news.length > 0 ? (
                <div className="news-grid">
                  {news.map((item, i) => (
                    <NewsCard key={i} item={item} onSave={addFavorite} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📡</div>
                  <div className="empty-state-text">Select a topic and load your feed</div>
                </div>
              )}
            </>
          )}

          {/* ── ANALYTICS TAB ─────────────────────────────────── */}
          {activeTab === "analytics" && (
            <>
              <div className="dashboard">
                <DashCard label="Total Articles"  value={totalNews}     icon="📰" />
                <DashCard label="Positive"        value={positiveCount} icon="😊" variant="positive" />
                <DashCard label="Negative"        value={negativeCount} icon="😡" variant="negative" />
                <DashCard label="Neutral"         value={neutralCount}  icon="😐" variant="neutral"  />
                <DashCard label="Avg. Trust"      value={`${avgTrust}%`} icon="🛡️" variant="trust"   />
              </div>

              <div className="chart-section">
                <div className="chart-box">
                  <div className="chart-box-title">Sentiment Distribution</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CUSTOM_TOOLTIP />} />
                      <Legend
                        wrapperStyle={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          color: "var(--cream-dim)"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-box">
                  <div className="chart-box-title">Sentiment Breakdown</div>
                  {chartData.map((entry, i) => (
                    <div key={i} style={{ marginBottom: 20 }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        fontFamily: "var(--font-mono)", fontSize: "11px",
                        color: "var(--cream-dim)", marginBottom: 6
                      }}>
                        <span>{entry.name}</span>
                        <span style={{ color: CHART_COLORS[i] }}>{entry.value}</span>
                      </div>
                      <div style={{
                        height: 6, background: "var(--bg-base)",
                        borderRadius: 4, overflow: "hidden"
                      }}>
                        <div style={{
                          height: "100%",
                          width: totalNews ? `${(entry.value / totalNews) * 100}%` : "0%",
                          background: CHART_COLORS[i],
                          borderRadius: 4,
                          transition: "width 0.6s ease"
                        }} />
                      </div>
                    </div>
                  ))}

                  <div style={{
                    marginTop: 28, padding: "16px",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-dim)",
                    borderLeft: "3px solid var(--gold)",
                    borderRadius: "var(--radius)"
                  }}>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: "9px",
                      color: "var(--gold)", letterSpacing: "0.2em",
                      textTransform: "uppercase", marginBottom: 8
                    }}>
                      Trust Index
                    </div>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: "32px",
                      color: "var(--gold)", fontWeight: 500
                    }}>
                      {avgTrust}<span style={{ fontSize: 14, color: "var(--muted)" }}>%</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── FAVORITES TAB ─────────────────────────────────── */}
          {activeTab === "favorites" && (
            <>
              <div className="section-header">
                <h2 className="section-title">Saved Articles</h2>
                <span className="section-count">{favorites.length} saved</span>
                <div className="section-rule" />
              </div>

              {favorites.length > 0 ? (
                <div className="news-grid favorites-grid">
                  {favorites.map((item) => (
                    <FavCard key={item.id} item={item} onDelete={deleteFavorite} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">♡</div>
                  <div className="empty-state-text">No saved articles yet</div>
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;