// Get DOM elements
const posterElement = document.querySelector(".poster");
const titleElement = document.querySelector(".title");
const runtimeElement = document.querySelector(".runtime");
const showtimeElement = document.querySelector(".showtime");
const availableTicketsElement = document.querySelector(".available-tickets");
const buyTicketButton = document.querySelector(".buy-ticket");
const filmListElement = document.querySelector(".film-list");

// Fetch data from server
fetch("http://localhost:3000/films/1")
  .then((response) => response.json())
  .then((data) => {
    // Update movie details
    posterElement.src = data.poster;
    titleElement.textContent = data.title;
    runtimeElement.textContent = `Runtime: ${data.runtime} min`;
    showtimeElement.textContent = `Showtime: ${data.showtime}`;
    const availableTickets = data.capacity - data.tickets_sold;
    availableTicketsElement.textContent = `Available Tickets: ${availableTickets}`;
    if (availableTickets === 0) {
      buyTicketButton.disabled = true;
      buyTicketButton.textContent = "Sold Out";
      filmListElement.firstChild.classList.add("sold-out");
    }

    // Update film list
    fetch("http://localhost:3000/films")
      .then((response) => response.json())
      .then((films) => {
        filmListElement.innerHTML = films
          .map((film) => `<li data-id="${film.id}">${film.title}</li>`)
          .join("");
      });
  });

// Update movie details when a film is clicked
filmListElement.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const id = event.target.dataset.id;
    fetch(`http://localhost:3000/films/${id}`)
      .then((response) => response.json())
      .then((data) => {
        posterElement.src = data.poster;
        titleElement.textContent = data.title;
        runtimeElement.textContent = `Runtime: ${data.runtime} min`;
        showtimeElement.textContent = `Showtime: ${data.showtime}`;
        const availableTickets = data.capacity - data.tickets_sold;
        availableTicketsElement.textContent = `Available Tickets: ${availableTickets}`;
        if (availableTickets === 0) {
          buyTicketButton.disabled = true;
          buyTicketButton.textContent = "Sold Out";
          event.target.classList.add("sold-out");
        } else {
          buyTicketButton.disabled = false;
          buyTicketButton.textContent = "Buy Ticket";
          event.target.classList.remove("sold-out");
        }
      });
  }
});

// Buy Ticket button functionality
buyTicketButton.addEventListener("click", () => {
  const id = filmListElement.querySelector(".active").dataset.id; 
  fetch(`http://localhost:3000/films/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tickets_sold: parseInt(data.tickets_sold) + 1,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const availableTickets = data.capacity - data.tickets_sold;
      availableTicketsElement.textContent = `Available Tickets: ${availableTickets}`; 
      if (availableTickets === 0) {
        buyTicketButton.disabled = true;
        buyTicketButton.textContent = "Sold Out";
        document.querySelector(`li[data-id="${id}"]`).classList.add("sold-out"); 
      }
    });
});
