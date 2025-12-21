const btn = document.querySelector(".btn-primary");
const status = document.querySelector(".status-text");
const placeholder = document.querySelector(".output-placeholder");

btn.addEventListener("click", async () => {
  const originalText = document.querySelector("textarea").value;
  const preserveNotes = document.querySelectorAll("input")[0].value;
  const instructionalGoal = document.querySelectorAll("input")[1].value;
  const accessibilityRange = document.querySelectorAll("input")[2].value;

  if (!originalText) {
    alert("Please paste an original text.");
    return;
  }

  status.textContent = "Drafting supports…";
  btn.disabled = true;

  try {
    const res = await fetch("/api/adapt", {
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
      <div class="warning-banner">
        ⚠️ Review all adaptations before sharing with students.
      </div>

      <h4>Adapted Text (Draft)</h4>
      <div class="content-box">${data.adaptedText}</div>

      <h4>Supports Added</h4>
      <div class="content-box">
        <ul>${data.supportsAdded.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>

      <h4>Potential Meaning Drift</h4>
      <div class="content-box">
        ${
          data.potentialDriftFlags.length === 0
            ? "No significant risks detected. Review still recommended."
            : data.potentialDriftFlags.map(f => `
              <p><strong>${f.severity.toUpperCase()}</strong>: ${f.issue}<br/>
              <em>${f.whyItMatters}</em></p>
            `).join("")
        }
      </div>

      <h4>Teacher Notes</h4>
      <div class="content-box">${data.teacherNotes}</div>
    `;

    status.textContent = "Draft ready for review";

  } catch (err) {
    console.error(err);
    status.textContent = "Error drafting adaptation";
  } finally {
    btn.disabled = false;
  }
});
 