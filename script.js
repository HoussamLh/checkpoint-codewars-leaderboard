import {
  getCodewarsUser,
  sortUsersByScore,
  getLanguages,
  sortUsersByLanguage,
} from "./index.mjs";

const form = document.getElementById("users-form");
const usernamesInput = document.getElementById("usernames");
const message = document.getElementById("message");
const leaderboardBody = document.getElementById("leaderboard-body");
const rankingSelect = document.getElementById("ranking");
const submitButton = form.querySelector('button[type="submit"]');

let currentUsers = [];

// Listen for ranking changes only once
rankingSelect.addEventListener("change", () => {
  const selectedRanking = rankingSelect.value;
  displayLeaderboard(currentUsers, selectedRanking);
});

// Handle username searches
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  currentUsers = [];
  leaderboardBody.replaceChildren();
  message.textContent = "";
  resetRankingSelect();

  // 1. Get and clean the usernames
  const usernames = usernamesInput.value;
  const validUsers = usernames
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name !== "");

  // 2. Validate the input
  if (validUsers.length === 0) {
    message.textContent = "Please enter at least one valid username.";
    return;
  }

  // 3. Fetch the users
  submitButton.disabled = true;
  const users = [];
  message.textContent = "Loading Codewars users...";

  try {
    for (const username of validUsers) {
      const user = await getCodewarsUser(username);
      users.push(user);
    }
    // Save the successfully fetched users
    currentUsers = users;

    displayLanguages(users);
    displayLeaderboard(users);

    message.textContent = 
    `${users.length} ${users.length === 1 ? "user" : "users"} loaded successfully.`;
    
  } catch (error) {
    message.textContent = error.message;

  } finally {
    submitButton.disabled = false;
  }
});

function displayLeaderboard(users, selectedRanking = "overall") {
  leaderboardBody.replaceChildren();

  const sortedUsers =
    selectedRanking === "overall"
      ? sortUsersByScore(users)
      : sortUsersByLanguage(users, selectedRanking);

  for (const user of sortedUsers) {
    const row = document.createElement("tr");

    if (user === sortedUsers[0]) {
      row.classList.add("top-user");
    }

    const usernameCell = document.createElement("th");
    usernameCell.scope = "row";
    usernameCell.textContent = user.username;

    const clanCell = document.createElement("td");
    clanCell.textContent = user.clan || "—";

    const scoreCell = document.createElement("td");

    let score;

    if (selectedRanking === "overall") {
      score = user.ranks.overall.score;
    } else {
      score = user.ranks.languages[selectedRanking].score;
    }

    scoreCell.textContent = score;

    row.appendChild(usernameCell);
    row.appendChild(clanCell);
    row.appendChild(scoreCell);

    leaderboardBody.appendChild(row);
  }
}

function displayLanguages(users) {
  const languages = getLanguages(users);

  resetRankingSelect();

  // Add the programming languages
  for (const language of languages) {
    const option = document.createElement("option");
    option.value = language;
    option.textContent = language;

    rankingSelect.appendChild(option);
  }
}

function resetRankingSelect() {
  rankingSelect.replaceChildren();

  const option = document.createElement("option");
  option.value = "overall";
  option.textContent = "Overall";

  rankingSelect.appendChild(option);
}