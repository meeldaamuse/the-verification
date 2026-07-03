const demoResults = {
  approved: {
    score: 87,
    status: "APPROVED",
    statusClass: "status-approved",
    statusText: "Social access maintained. No immediate correction required.",
    truth: 87,
    social: 92,
    compliance: 89,
    emotional: 23,
    risk: "LOW",
    logs: [
      "Response hesitation within acceptable range.",
      "Emotional deviation minimal.",
      "Compliance pattern stable.",
      "Verification result archived."
    ]
  },
  limited: {
    score: 64,
    status: "LIMITED ACCESS",
    statusClass: "status-limited",
    statusText: "Social access reduced. Increased monitoring may apply.",
    truth: 64,
    social: 58,
    compliance: 61,
    emotional: 54,
    risk: "MONITORED",
    logs: [
      "Response hesitation detected.",
      "Truth consistency unstable.",
      "Compliance fluctuation observed.",
      "Subject marked for passive monitoring."
    ]
  },
  failed: {
    score: 23,
    status: "NON-CITIZEN",
    statusClass: "status-failed",
    statusText: "Social access removed. Correction protocol has been initiated.",
    truth: 23,
    social: 19,
    compliance: 31,
    emotional: 88,
    risk: "CRITICAL",
    logs: [
      "Severe behavioral irregularity registered.",
      "Truth consistency critically failed.",
      "System alignment rejected.",
      "Correction protocol initiated."
    ]
  }
};

function getParams() {
  return new URLSearchParams(window.location.search);
}

function chooseResult(id, statusParam) {
  if (statusParam === "approved") return demoResults.approved;
  if (statusParam === "limited") return demoResults.limited;
  if (statusParam === "failed" || statusParam === "noncitizen") return demoResults.failed;

  const lastNumber = parseInt(id.replace(/\D/g, "").slice(-1), 10);
  if ([0, 1, 2].includes(lastNumber)) return demoResults.failed;
  if ([3, 4, 5, 6].includes(lastNumber)) return demoResults.limited;
  return demoResults.approved;
}

function hideLoader(delay = 2200) {
  const loading = document.getElementById("loading");
  if (!loading) return;
  setTimeout(() => loading.classList.add("hidden"), delay);
}

function fillResultPage() {
  const params = getParams();
  const caseId = params.get("id") || "TV-2099-8473";
  const statusParam = params.get("status");
  const result = chooseResult(caseId, statusParam);

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("caseId", caseId);
  setText("date", new Date().toLocaleDateString("de-DE"));
  setText("score", result.score);
  setText("statusText", result.statusText);
  setText("truth", result.truth + "%");
  setText("social", result.social + "%");
  setText("compliance", result.compliance + "%");
  setText("emotional", result.emotional + "%");
  setText("risk", result.risk);

  const statusElement = document.getElementById("status");
  if (statusElement) {
    statusElement.textContent = result.status;
    statusElement.className = "status-value " + result.statusClass;
  }

  ["truth", "social", "compliance", "emotional"].forEach((key) => {
    const bar = document.getElementById(key + "Bar");
    if (bar) bar.style.setProperty("--value", result[key] + "%");
  });

  const logs = document.getElementById("logs");
  if (logs) {
    logs.innerHTML = "";
    result.logs.forEach((log, index) => {
      const item = document.createElement("div");
      item.className = "log";
      item.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span> ${log}`;
      logs.appendChild(item);
    });
  }
}

function setupCheckForm() {
  const form = document.getElementById("checkForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("caseInput");
    const statusSelect = document.getElementById("statusSelect");
    const id = (input.value || "TV-2099-8473").trim().toUpperCase();
    const status = statusSelect ? statusSelect.value : "";
    const statusQuery = status ? `&status=${encodeURIComponent(status)}` : "";
    window.location.href = `result.html?id=${encodeURIComponent(id)}${statusQuery}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  hideLoader();
  fillResultPage();
  setupCheckForm();
});
