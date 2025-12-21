// Backend URL configuration for Vercel <-> Render connection
const BACKEND_URL = window.__BACKEND_URL || "https://readbridge-backend.onrender.com";

const btn = document.querySelector(".btn-primary");
const status = document.querySelector(".status-text");
const placeholder = document.querySelector(".output-placeholder");

// Function to set up pill selection for optional context
function setupPills() {
  document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", (e) => {
      e.preventDefault();
      pill.classList.toggle("active");
    });
  });
}

// Function to set up collapsible sections
function setupCollapsibles() {
  document.querySelectorAll(".output-header").forEach(header => {
    header.addEventListener("click", () => {
      const contentBox = header.nextElementSibling;
      const toggleIcon = header.querySelector(".toggle-icon");

      contentBox.classList.toggle("collapsed");
      toggleIcon.classList.toggle("collapsed");
    });
  });
}

// Initialize pills on page load
document.addEventListener("DOMContentLoaded", setupPills);

btn.addEventListener("click", async () => {
  const originalText = document.querySelector("textarea").value;
  const preserveNotes = document.querySelectorAll("input")[0].value;
  const instructionalGoal = document.querySelectorAll("input")[1].value;
  const accessibilityRange = document.querySelectorAll("input")[2].value;

  if (!originalText) {
    status.textContent = "Please paste an original text.";
    return;
  }

  status.textContent = "Drafting supports…";
  status.classList.add("loading");
  btn.disabled = true;

  try {
    console.log("Sending to:", `${BACKEND_URL}/api/adapt`);
    const res = await fetch(`${BACKEND_URL}/api/adapt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalText,
        preserveNotes,
        instructionalGoal,
        accessibilityRange,
        supports: []
      })
    });

    const data = await res.json();

    placeholder.innerHTML = `
      <div class="output-section">
        <div class="output-header">
          <h4>Adapted Text (Draft)</h4>
          <span class="toggle-icon">▼</span>
        </div>
        <div class="content-box adapted-text">
          ${data.adaptedText}
        </div>
      </div>

      <div class="output-section">
        <div class="output-header">
          <h4>Supports Added</h4>
          <span class="toggle-icon">▼</span>
        </div>
        <div class="content-box">
          <ul>${data.supportsAdded.map(s => `<li>${s}</li>`).join("")}</ul>
        </div>
      </div>

      <div class="output-section">
        <div class="output-header">
          <h4>Potential Meaning Drift</h4>
          <span class="toggle-icon">▼</span>
        </div>
        <div class="content-box">
          ${
            data.potentialDriftFlags.length === 0
              ? "<p>No significant risks detected. Review still recommended.</p>"
              : data.potentialDriftFlags.map(f => `
                <div class="drift-flag">
                  <p><strong>${f.severity.toUpperCase()}</strong>: ${f.issue}</p>
                  <p><em>${f.whyItMatters}</em></p>
                </div>
              `).join("")
          }
        </div>
      </div>

      <div class="output-section">
        <div class="output-header">
          <h4>Teacher Notes</h4>
          <span class="toggle-icon">▼</span>
        </div>
        <div class="content-box">
          ${data.teacherNotes}
        </div>
      </div>
    `;

    setupCollapsibles();
    status.textContent = "✓ Draft ready for review";
    status.classList.remove("loading");

  } catch (err) {
    console.error("Fetch error:", err);
    status.textContent = `Error: ${err.message || "Failed to connect to backend"}. Check console.`;
    status.classList.remove("loading");
  } finally {
    btn.disabled = false;
  }
});
 