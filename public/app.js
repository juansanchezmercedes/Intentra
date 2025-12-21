// Backend URL: use env variable or fall back to localhost for dev
const BACKEND_URL = window.__BACKEND_URL || "http://localhost:3000";

// Grabs DOM elements once for reuse
const generateBtn = document.getElementById("generateBtn");
const status = document.getElementById("status");
const placeholder = document.getElementById("placeholder");
const output = document.getElementById("output");

const passage = document.getElementById("passage");
const vocab = document.getElementById("vocab");
const questions = document.getElementById("questions");
const notes = document.getElementById("notes");

function setStatus(text) {
  status.innerText = text;
}

function validateInputs() {
  const focus = document.getElementById("readingFocus").value.trim();
  const level = document.getElementById("readingLevel").value.trim();
  const topic = document.getElementById("topic").value.trim();

  if (!focus || !level || !topic) {
    setStatus("Please add focus, level, and student interest.");
    return null;
  }

  return {
    readingFocus: focus,
    readingLevel: level,
    topic,
    gradeBand: document.getElementById("gradeBand").value,
    assignmentGoal: document.getElementById("assignmentGoal").value.trim()
  };
}

async function generateAssignment() {
  const payload = validateInputs();
  if (!payload) return;

  setStatus("Generating…");
  generateBtn.disabled = true;

  try {
    const response = await fetch(`${BACKEND_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server error (${response.status})`);
    }

    const result = await response.json();

    placeholder.style.display = "none";
    output.style.display = "block";
    setStatus("Done");

    passage.innerHTML = result.passage || "—";
    vocab.innerHTML = result.vocab || "—";
    questions.innerHTML = result.questions || "—";
    notes.innerText = result.notes || "—";
  } catch (err) {
    console.error(err);
    setStatus("Error generating assignment. Please try again.");
  } finally {
    generateBtn.disabled = false;
  }
}

generateBtn?.addEventListener("click", generateAssignment);