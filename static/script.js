// DOM Elements
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const cardNumber = document.getElementById("card-number");
const drawBtn = document.getElementById("draw-btn");
const tagRow = document.getElementById("tag-row");
const likeBtn = document.getElementById("like-btn");
const copyBtn = document.getElementById("copy-btn");
const shareBtn = document.getElementById("share-btn");
const favCountSpan = document.getElementById("fav-count");

// Modal Elements
const addModal = document.getElementById("add-modal");
const openAddBtn = document.getElementById("open-add-btn");
const closeAddModal = document.getElementById("close-add-modal");
const addForm = document.getElementById("add-quote-form");

const favsModal = document.getElementById("favs-modal");
const openFavsBtn = document.getElementById("open-favs-btn");
const closeFavsModal = document.getElementById("close-favs-modal");
const favsList = document.getElementById("favs-list");

const toastContainer = document.getElementById("toast-container");

// Application State
let activeTag = "";
let cardCount = 0;
let currentQuote = null;
let favorites = [];

// Load Favorites from LocalStorage
function loadFavorites() {
  try {
    const saved = localStorage.getItem("quoteforge_favorites");
    favorites = saved ? JSON.parse(saved) : [];
  } catch (e) {
    favorites = [];
  }
  updateFavCount();
}

// Save Favorites to LocalStorage
function saveFavorites() {
  localStorage.setItem("quoteforge_favorites", JSON.stringify(favorites));
  updateFavCount();
  updateLikeButtonState();
  renderFavoritesList();
}

// Update Favorites Counter UI
function updateFavCount() {
  favCountSpan.textContent = favorites.length;
}

// Check if quote is already favorited
function isCurrentQuoteFavorited() {
  if (!currentQuote) return false;
  return favorites.some(
    (q) => q.text.trim() === currentQuote.text.trim() && q.author.trim() === currentQuote.author.trim()
  );
}

// Update Heart button visual state
function updateLikeButtonState() {
  if (isCurrentQuoteFavorited()) {
    likeBtn.classList.add("active");
    likeBtn.querySelector("i").className = "fa-solid fa-heart";
  } else {
    likeBtn.classList.remove("active");
    likeBtn.querySelector("i").className = "fa-regular fa-heart";
  }
}

// Toast notification trigger
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : ""}`;
  
  const icon = document.createElement("i");
  icon.className = type === "success" ? "fa-solid fa-circle-check" : "fa-solid fa-circle-info";
  
  const text = document.createElement("span");
  text.textContent = message;
  
  toast.appendChild(icon);
  toast.appendChild(text);
  toastContainer.appendChild(toast);
  
  // Clean up toast element after animation ends
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Fetch all available tags
async function loadTags() {
  try {
    const res = await fetch("/api/tags");
    const tags = await res.json();
    
    // Clear dynamic pills, preserve first ('all')
    const allPill = tagRow.querySelector('[data-tag=""]');
    tagRow.innerHTML = "";
    tagRow.appendChild(allPill);

    tags.forEach((tag) => {
      const pill = document.createElement("button");
      pill.className = `tag-pill ${activeTag === tag ? "active" : ""}`;
      pill.dataset.tag = tag;
      
      const icon = document.createElement("i");
      icon.className = "fa-solid fa-hashtag";
      
      pill.appendChild(icon);
      pill.appendChild(document.createTextNode(` ${tag}`));
      tagRow.appendChild(pill);
    });
  } catch (err) {
    console.error("Failed to load tags", err);
  }
}

// Draw a random quote from API
async function drawQuote() {
  drawBtn.disabled = true;
  const drawIcon = drawBtn.querySelector("i");
  if (drawIcon) drawIcon.classList.add("fa-spin");

  // Visual fade transition
  quoteText.classList.add("fade-out");
  quoteAuthor.classList.add("fade-out");

  setTimeout(async () => {
    const url = activeTag ? `/api/quote?tag=${encodeURIComponent(activeTag)}` : "/api/quote";
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        currentQuote = data;
        quoteText.textContent = data.text;
        quoteAuthor.textContent = data.author || "Unknown";
        cardCount += 1;
        cardNumber.textContent = String(cardCount).padStart(3, "0");
        updateLikeButtonState();
      } else {
        quoteText.textContent = "Every cloud has a silver lining, but we couldn't find a quote here.";
        quoteAuthor.textContent = "System";
        currentQuote = null;
        updateLikeButtonState();
      }
    } catch (err) {
      quoteText.textContent = "Unable to connect to the Quote server. Make sure it is running!";
      quoteAuthor.textContent = "System Connection Error";
      currentQuote = null;
      updateLikeButtonState();
    } finally {
      quoteText.classList.remove("fade-out");
      quoteAuthor.classList.remove("fade-out");
      quoteText.classList.add("fade-in");
      quoteAuthor.classList.add("fade-in");

      setTimeout(() => {
        quoteText.classList.remove("fade-in");
        quoteAuthor.classList.remove("fade-in");
      }, 300);

      drawBtn.disabled = false;
      if (drawIcon) drawIcon.classList.remove("fa-spin");
    }
  }, 250);
}

// Toggle Favorite state
function toggleFavorite() {
  if (!currentQuote) return;
  
  const index = favorites.findIndex(
    (q) => q.text.trim() === currentQuote.text.trim() && q.author.trim() === currentQuote.author.trim()
  );

  if (index >= 0) {
    favorites.splice(index, 1);
    showToast("Removed from your collection");
  } else {
    favorites.push({ ...currentQuote });
    showToast("Saved to your collection!", "success");
  }
  saveFavorites();
}

// Render Collection items in modal
function renderFavoritesList() {
  if (favorites.length === 0) {
    favsList.innerHTML = `<p class="empty-state">No quotes saved yet. Tap the heart icon on any card!</p>`;
    return;
  }

  favsList.innerHTML = "";
  favorites.forEach((q, idx) => {
    const item = document.createElement("div");
    item.className = "fav-item";
    
    const textEl = document.createElement("p");
    textEl.className = "fav-text";
    textEl.textContent = `“${q.text}”`;
    
    const footer = document.createElement("div");
    footer.className = "fav-footer";
    
    const authorEl = document.createElement("span");
    authorEl.className = "fav-author";
    authorEl.textContent = `— ${q.author}`;
    
    const tagEl = document.createElement("span");
    tagEl.className = "fav-tag";
    tagEl.textContent = q.tag || "general";
    
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-fav-btn";
    removeBtn.title = "Delete favorite";
    removeBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
    removeBtn.addEventListener("click", () => {
      favorites.splice(idx, 1);
      showToast("Removed from collection");
      saveFavorites();
    });

    footer.appendChild(authorEl);
    footer.appendChild(tagEl);
    
    item.appendChild(removeBtn);
    item.appendChild(textEl);
    item.appendChild(footer);
    
    favsList.appendChild(item);
  });
}

// Copy to clipboard with visual notice
function copyQuote() {
  if (!currentQuote) return;
  const fullText = `"${currentQuote.text}" — ${currentQuote.author}`;
  
  navigator.clipboard.writeText(fullText).then(
    () => {
      showToast("Copied quote to clipboard!", "success");
    },
    () => {
      showToast("Failed to copy quote to clipboard");
    }
  );
}

// Share on Twitter/X
function shareQuote() {
  if (!currentQuote) return;
  const tweetText = encodeURIComponent(`"${currentQuote.text}" — ${currentQuote.author}\n\nVia QuoteForge`);
  const url = `https://twitter.com/intent/tweet?text=${tweetText}`;
  window.open(url, "_blank");
}

// Setup Event Listeners
function setupEventListeners() {
  // Draw card trigger
  drawBtn.addEventListener("click", drawQuote);

  // Filter tag click
  tagRow.addEventListener("click", (e) => {
    const pill = e.target.closest(".tag-pill");
    if (!pill) return;
    activeTag = pill.dataset.tag || "";
    [...tagRow.children].forEach((c) => c.classList.remove("active"));
    pill.classList.add("active");
    drawQuote();
  });

  // Action Bar Buttons
  likeBtn.addEventListener("click", toggleFavorite);
  copyBtn.addEventListener("click", copyQuote);
  shareBtn.addEventListener("click", shareQuote);

  // Add Custom Quote Modals triggers
  openAddBtn.addEventListener("click", () => addModal.classList.add("open"));
  closeAddModal.addEventListener("click", () => addModal.classList.remove("open"));
  addModal.addEventListener("click", (e) => {
    if (e.target === addModal) addModal.classList.remove("open");
  });

  // Favorites collection modal triggers
  openFavsBtn.addEventListener("click", () => {
    renderFavoritesList();
    favsModal.classList.add("open");
  });
  closeFavsModal.addEventListener("click", () => favsModal.classList.remove("open"));
  favsModal.addEventListener("click", (e) => {
    if (e.target === favsModal) favsModal.classList.remove("open");
  });

  // Submit custom quote
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const textVal = document.getElementById("new-quote-text").value;
    const authorVal = document.getElementById("new-quote-author").value;
    const tagVal = document.getElementById("new-quote-tag").value;
    
    const payload = {
      text: textVal,
      author: authorVal,
      tag: tagVal
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        showToast("Quote successfully forged!", "success");
        addForm.reset();
        addModal.classList.remove("open");
        // Reload tags in case a new tag was created, and redraw
        await loadTags();
        drawQuote();
      } else {
        const errorData = await res.json();
        showToast(errorData.error || "Failed to save quote");
      }
    } catch (err) {
      showToast("Error connecting to server to save quote.");
    }
  });
}

// Initializer
loadFavorites();
setupEventListeners();
loadTags();
drawQuote();


// Space key shortcut to trigger new random quote
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
    e.preventDefault();
    drawBtn.click();
  }
});
