"use client";

import { useState } from "react";

const T = {
  bg: "#0E1420",
  panel: "#161F2E",
  panelEdge: "#243248",
  chrome: "#E8EDF5",
  dim: "#8FA0B8",
  spark: "#FF6B2C",
  volt: "#4DD8FF",
};

const SUBJECTS = [
  { id: "car", label: "Car", emoji: "🚗", hint: "e.g. jeepney, Lamborghini, tricycle" },
  { id: "animal", label: "Animal", emoji: "🦅", hint: "e.g. eagle, tiger, carabao" },
  { id: "fruit", label: "Fruit", emoji: "🥭", hint: "e.g. mango, durian, pineapple" },
  { id: "human", label: "Person", emoji: "🧍", hint: "e.g. basketball player, chef" },
  { id: "custom", label: "Anything", emoji: "✨", hint: "e.g. volcano, guitar, balut" },
];

const STYLES = [
  { id: "cinematic", label: "Cinematic Realistic" },
  { id: "anime", label: "Anime Mecha" },
  { id: "pixar", label: "3D Cartoon" },
  { id: "cyberpunk", label: "Cyberpunk Neon" },
];

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid " + (active ? T.spark : T.panelEdge),
        background: active ? "rgba(255,107,44,0.12)" : T.panel,
        color: active ? T.spark : T.dim,
        fontFamily: "Chakra Petch, sans-serif",
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function CopyCard({ title, text, accent }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div
      style={{
        background: T.panel,
        border: "1px solid " + T.panelEdge,
        borderLeft: "3px solid " + accent,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "Chakra Petch, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {title}
        </span>
        <button
          onClick={copy}
          style={{
            background: copied ? accent : "transparent",
            color: copied ? T.bg : accent,
            border: "1px solid " + accent,
            borderRadius: 8,
            padding: "4px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p style={{ color: T.chrome, fontSize: 14, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{text}</p>
    </div>
  );
}

export default function Home() {
  const [category, setCategory] = useState(SUBJECTS[0]);
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canGenerate = subject.trim().length > 0;

  const handleGenerate = async () => {
    if (!canGenerate || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), style: style.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const stepLabel = {
    fontFamily: "Chakra Petch, sans-serif",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: T.volt,
    marginBottom: 10,
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, paddingBottom: 60, fontFamily: "Inter, sans-serif" }}>
      <header
        style={{
          padding: "36px 20px 28px",
          textAlign: "center",
          borderBottom: "1px solid " + T.panelEdge,
        }}
      >
        <div
          style={{
            fontFamily: "Chakra Petch, sans-serif",
            fontSize: 11,
            letterSpacing: "0.3em",
            color: T.volt,
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          Anything to Robot
        </div>
        <h1
          style={{
            fontFamily: "Chakra Petch, sans-serif",
            fontSize: "clamp(28px, 7vw, 44px)",
            fontWeight: 700,
            color: T.chrome,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          ROBOT TRANSFORM
          <br />
          <span style={{ color: T.spark }}>STUDIO</span>
        </h1>
        <p style={{ color: T.dim, fontSize: 14, maxWidth: 420, margin: "14px auto 0", lineHeight: 1.5 }}>
          Type anything. Get a real AI robot image plus a ready-to-post caption.
        </p>
      </header>

      <main style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={stepLabel}>Step 1 - What transforms?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {SUBJECTS.map((s) => (
              <Chip key={s.id} active={category.id === s.id} onClick={() => setCategory(s)}>
                {s.emoji} {s.label}
              </Chip>
            ))}
          </div>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={category.hint}
            maxLength={80}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px solid " + T.panelEdge,
              background: T.panel,
              color: T.chrome,
              fontSize: 15,
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={stepLabel}>Step 2 - Visual style</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {STYLES.map((s) => (
              <Chip key={s.id} active={style.id === s.id} onClick={() => setStyle(s)}>
                {s.label}
              </Chip>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!canGenerate || loading}
          style={{
            width: "100%",
            padding: 18,
            borderRadius: 14,
            border: "none",
            background: canGenerate ? "linear-gradient(90deg, #FF6B2C, #FF8F4D)" : T.panel,
            color: canGenerate ? "#1A0E05" : T.dim,
            fontFamily: "Chakra Petch, sans-serif",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "0.12em",
            cursor: canGenerate && !loading ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "TRANSFORMING... (10-20 sec)" : "⚡ TRANSFORM"}
        </button>

        {error && <p style={{ color: T.spark, fontSize: 13, textAlign: "center", marginTop: 16 }}>{error}</p>}

        {result && (
          <div style={{ marginTop: 28 }}>
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid " + T.panelEdge,
                marginBottom: 12,
              }}
            >
              <img src={result.imageUrl} alt="robot" style={{ width: "100%", display: "block" }} />
            </div>

            <a
              href={result.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                padding: 14,
                borderRadius: 12,
                background: T.volt,
                color: T.bg,
                fontFamily: "Chakra Petch, sans-serif",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                marginBottom: 20,
              }}
            >
              ⬇ Open Full Size / Save Image
            </a>

            <CopyCard title="Caption - ready to post" text={result.caption} accent={T.volt} />
            <CopyCard title="Hashtags" text={result.hashtags} accent={T.dim} />
            <CopyCard title="Prompt used" text={result.prompt} accent={T.spark} />

            <button
              onClick={handleGenerate}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid " + T.panelEdge,
                background: "transparent",
                color: T.volt,
                fontFamily: "Chakra Petch, sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              ↻ Transform again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
