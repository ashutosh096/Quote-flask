const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const cardNumber = document.getElementById("card-number");
const drawBtn = document.getElementById("draw-btn");
const tagRow = document.getElementById("tag-row");

let activeTag = "";
let cardCount = 0;

async function loadTags() {
  const res = await fetch("/api/tags");
  const tags = await res.json();

  tags.forEach((tag) => {
    const pill = document.createElement("button");
    pill.className = "tag-pill";
    pill.dataset.tag = tag;
    pill.textContent = tag;
    tagRow.appendChild(pill);
  });

  tagRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag-pill");
    if (!btn) return;
    activeTag = btn.dataset.tag || "";
    [...tagRow.children].forEach((c) => c.classList.remove("active"));
    btn.classList.add("active");
    drawQuote();
  });
}

async function drawQuote() {
  drawBtn.disabled = true;
  drawBtn.textContent = "Drawing...";

  const url = activeTag ? `/api/quote?tag=${encodeURIComponent(activeTag)}` : "/api/quote";
  const res = await fetch(url);
  const data = await res.json();

  if (res.ok) {
    quoteText.textContent = `"${data.text}"`;
    quoteAuthor.textContent = data.author;
    cardCount += 1;
    cardNumber.textContent = String(cardCount).padStart(3, "0");
  } else {
    quoteText.textContent = "No quotes found for that tag.";
    quoteAuthor.textContent = "";
  }

  drawBtn.disabled = false;
  drawBtn.textContent = "Draw another card";
}

drawBtn.addEventListener("click", drawQuote);

loadTags();
drawQuote();
