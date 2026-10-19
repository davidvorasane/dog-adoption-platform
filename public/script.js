let token = localStorage.getItem("token");

const message = document.getElementById("message");

function showMessage(text) {
  message.textContent = text;
  message.hidden = false;
}

async function apiRequest(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, {
    ...options,
    headers: headers,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

document.getElementById("register-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: form.get("username"),
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      event.target.reset();
      message.textContent = "Registration successful!";
      message.hidden = false;
      message.style.cursor = "pointer";
      message.onclick = () => {
        message.hidden = true;
      };
    } catch (error) {
      showMessage(error.message);
    }
  });

document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      token = data.token;
      localStorage.setItem("token", token);
      document.getElementById("auth-status").textContent = "Logged in";
      event.target.reset();
    } catch (error) {
      showMessage(error.message);
    }
  });

document.getElementById("dog-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!token) {
      alert("Must be logged in");
      return;
    }
    const form = new FormData(event.target);
    try {
      await apiRequest("/api/dogs", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          breed: form.get("breed"),
          age: Number(form.get("age")),
        }),
      });
      alert("Dog added successfully!");
      event.target.reset();
      await loadDogs();
    } catch (error) {
      showMessage(error.message);
    }
  });

async function loadDogs() {
  try {
    const data = await apiRequest("/api/dogs");
    const list = document.getElementById("dogs-list");
    list.replaceChildren();
    const dogs = data.dogs || [];
    const availableDogs = dogs.filter((dog) => !dog.adoptedBy);
    if (availableDogs.length === 0) {
      list.textContent = "No available dogs found.";
      return;
    }

    availableDogs.forEach((dog) => {
      const item = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = `${dog.name} - ${dog.breed}`;
      item.appendChild(title);

      const details = document.createElement("p");
      details.textContent = `Age: ${dog.age}. ${dog.description || ""}`;
      item.appendChild(details);

      const adoptButton = document.createElement("button");
      adoptButton.textContent = "Adopt";
      adoptButton.addEventListener("click", async () => {
        if (!token) {
          alert("Must be logged in");
          return;
        }
        try {
          const result = await apiRequest(
            `/api/dogs/${dog._id}/adopt`,
            { method: "POST" }
          );
        alert(result.message || `${dog.name} adopted successfully!`);
        await loadDogs();
        await loadAdoptedDogs();
        } catch (error) {
          alert(error.message);
        }
      });
      item.appendChild(adoptButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Remove";
      deleteButton.addEventListener("click", async () => {
        if (!confirm(`Are you sure you want to remove ${dog.name}?`)) {
          return;
        }
        try {
          await apiRequest(`/api/dogs/${dog._id}`, {
            method: "DELETE",
          });
          alert(`${dog.name} removed successfully!`);
          await loadDogs();
        } catch (error) {
          alert(error.message);
        }
      });

      item.appendChild(deleteButton);
      list.appendChild(item);
    });
  } catch (error) {
    showMessage(error.message);
  }
}

async function loadAdoptedDogs() {
  const list = document.getElementById("adopted-list");

  try {
    const data = await apiRequest("/api/dogs/adopted");
    const dogs = data.dogs || [];
    list.replaceChildren();
    if (dogs.length === 0) {
      list.textContent = "No adopted dogs found.";
      return;
    }
    dogs.forEach((dog) => {
      const item = document.createElement("p");
      item.textContent = `${dog.name} - ${dog.breed} (Adopted)`;
      list.appendChild(item);
    });
  } catch (error) {
    console.error("Failed to load adopted dogs:", error);
    alert(`Could not load adopted dogs: ${error.message}`);
  }
}

document.getElementById("load-dogs").addEventListener("click", loadDogs);
document.getElementById("load-adopted").addEventListener("click", loadAdoptedDogs);
document.getElementById("auth-status").textContent = token
  ? "Logged in (saved token)"
  : "Not logged in";

document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("token");
  token = null;

document.getElementById("auth-status").textContent = "Not logged in";
alert("You have logged out successfully.");
});

loadDogs();