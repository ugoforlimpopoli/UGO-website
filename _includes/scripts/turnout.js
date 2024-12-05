document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://d1s96qvov1.execute-api.eu-north-1.amazonaws.com/dev/people";
  const registerForm = document.getElementById("registerForm");
  const nameInput = document.getElementById("nameInput");
  const occupantsList = document.getElementById("occupantsList");

  // Fetch and display the current occupants
  function fetchOccupants() {
    fetch(`${apiUrl}/status`)
      .then(response => response.json())
      .then(data => {
        occupantsList.innerHTML = ""; // Clear the list
        if (data.occupants && data.occupants.length > 0) {
          data.occupants.forEach(person => {
            const listItem = document.createElement("li");
            listItem.textContent = person;
            const unregisterButton = document.createElement("button");
            unregisterButton.textContent = "Rimuovi";
            unregisterButton.className = "unregister-button";
            unregisterButton.addEventListener("click", () => unregisterPerson(person));
            listItem.appendChild(unregisterButton);
            occupantsList.appendChild(listItem);
          });
        } else {
          occupantsList.innerHTML = "<li>Nessuno è in aula in questo momento.</li>";
        }
      })
      .catch(error => console.error("Error fetching occupants:", error));
  }

  // Register a new person
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (name) {
      fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      })
        .then(() => {
          nameInput.value = "";
          fetchOccupants();
        })
        .catch(error => console.error("Error registering person:", error));
    }
  });

  // Unregister a person
  function unregisterPerson(name) {
    fetch(`${apiUrl}/unregister`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
      .then(() => fetchOccupants())
      .catch(error => console.error("Error unregistering person:", error));
  }

  // Fetch occupants initially and at intervals
  fetchOccupants();
  setInterval(fetchOccupants, 30000); // Refresh every 30 seconds
});
