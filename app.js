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
// code to empty facts list
factsList.innerHTML = "";

function createdFactsList(dataArray) {
  const htmlArr = dataArray.map(
    (fact) => `<li class="fact">${fact.text}<p>
                <a
                  class="source"
                  href="${fact.source}"
                  >(Source)
                </a>
              </p>
              <span class="tag" style="background-color: #3b82f6"
                >${fact.category}
              </span>
              <div class="vote-buttons">
                <button>👍 <strong>${fact.votesInteresting}</strong></button>
                <button>🤯 <strong>${fact.votesMindblowing}</strong></button>
                <button>⛔️ <strong>${fact.votesFalse}</strong></button>
              </div>
              </li>`
  );
  const html = htmlArr.join("");
  factsList.insertAdjacentHTML("afterbegin", html);
}

// **********************************************
