export async function getCodewarsUser(username) {
  const url = `https://www.codewars.com/api/v1/users/${encodeURIComponent(username)}`;

  const response = await fetch(url);

  if (response.status === 404) {
    throw new Error(
      `User "${username}" was not found. Check the spelling and try again.`,
    );
  }

  if (!response.ok) {
    throw new Error("Unable to retrieve Codewars user data.");
  }

  return await response.json();
}

export function sortUsersByScore(users) {
  const sortedUsers = [...users];

  sortedUsers.sort((a, b) => {
    return b.ranks.overall.score - a.ranks.overall.score;
  });

  return sortedUsers;
}

export function getLanguages(users) {
  const allLanguages = [];

  for (const user of users) {
    const languages = Object.keys(user.ranks.languages);
    allLanguages.push(...languages);
  }

  return [...new Set(allLanguages)];
}

export function sortUsersByLanguage(users, selectedRanking) {
  // Keep only users with a ranking for the selected language
  const filteredUsers = users.filter((user) => {
    return user.ranks.languages[selectedRanking] !== undefined;
  });

  // Sort from highest score to lowest score
  const sortedUsers = filteredUsers.sort((a, b) => {
    return (
      b.ranks.languages[selectedRanking].score -
      a.ranks.languages[selectedRanking].score
    );
  });

  return sortedUsers;
}