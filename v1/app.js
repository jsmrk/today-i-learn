// TO OPEN FORM AND CLOSE FORM
const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");

btn.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "Share a Fact";
  }
});
// **********************************************

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

// DISPLAY SIDEBARD BUTTONS OF CATEGORIES
const categories = document.querySelector(".categories");
categories.innerHTML = "";

function createCategoriesList(CATEGORIES) {
  const htmlArr = CATEGORIES.map(
    (CATEGORIES) => `<li class="category">
              <button
                class="btn btn-category"
                style="background-color: ${CATEGORIES.color}"
              >
                ${CATEGORIES.name}
              </button>
            </li>`
  );
  const html = htmlArr.join("");
  categories.insertAdjacentHTML("afterbegin", html);
}
createCategoriesList(CATEGORIES);
// **********************************************

// LOAD DATA FROM DB
async function loadFacts() {
  const res = await fetch(
    "https://gsuehtkylpyhieauymxg.supabase.co/rest/v1/facts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdWVodGt5bHB5aGllYXV5bXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTA2OTEsImV4cCI6MjAyNjg2NjY5MX0.-BDC2D5Db2P3NfcDu5nD0MbBS39NIo2yvvDqoBwPSb0",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdWVodGt5bHB5aGllYXV5bXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTA2OTEsImV4cCI6MjAyNjg2NjY5MX0.-BDC2D5Db2P3NfcDu5nD0MbBS39NIo2yvvDqoBwPSb0",
      },
    }
  );
  // to get the data
  const data = await res.json();
  console.log(data);
  //   to display the data using the createdFactsList function
  createdFactsList(data);
}
loadFacts();
// **********************************************

// DISPLAYING FACTS LIST FROM DB
const factsList = document.querySelector(".facts-list");
// to format date
// code to empty facts list
factsList.innerHTML = "";

function createdFactsList(dataArray) {
  // to sort array based on the date posted
  const sortedDataArray = dataArray.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const formattedHtmlArr = sortedDataArray.map((fact) => {
    const formattedDate = formatDate(fact.created_at);
    return `<li class="fact">
              <div class="fact-details">
                <p class="date-posted">${formattedDate}</p>
                <p>${fact.text}
                  <a class="source" href="${fact.source}">(Source)</a>
                </p>
              </div>
              <span class="tag" style="background-color: ${
                CATEGORIES.find((category) => category.name === fact.category)
                  .color
              }">${fact.category}</span>
              <div class="vote-buttons">
                <button> <strong>${fact.votesInteresting}</strong></button>
                <button> <strong>${fact.votesMindblowing}</strong></button>
                <button>⛔️ <strong>${fact.votesFalse}</strong></button>
              </div>
            </li>`;
  });

  const html = formattedHtmlArr.join("");
  factsList.insertAdjacentHTML("afterbegin", html);
}

// TO FORMAT DATE
// This function can handle either UTC (ISO 8601) or timestamp formats (replace with yours)
function formatDate(dateString) {
  if (typeof dateString === "string" && dateString.includes("T")) {
    // Assuming UTC format
    const dateObj = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit", // Use 'minute' for leading zeros, '2-digit' for optional leading zero
    };
    return dateObj.toLocaleDateString("en-US", options);
  } else {
    // Assuming timestamp format
    const dateObj = new Date(parseInt(dateString));
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return dateObj.toLocaleDateString("en-US", options);
  }
}
// **********************************************
