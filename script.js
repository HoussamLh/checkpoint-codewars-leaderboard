const form = document.getElementById("users-form");
const usernamesInput = document.getElementById("usernames");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const usernames = usernamesInput.value;

  const splitUsers = usernames.split(",");

  const trimmedUsers = splitUsers.map((name) => {
    return name.trim();
  });

  const validUsers = trimmedUsers.filter((name) => {
    return name !== "";
  });

  if (validUsers.length === 0) {
    const message = document.getElementById("message");
    message.textContent = "Please enter at least one valid username.";
    return;
  }

  console.log(validUsers);
});
