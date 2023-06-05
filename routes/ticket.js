const router = require("express").Router();
const Ticket = require("../models/Ticket");

router.post("/tickets", async (req, res) => {
  try {
    const { numTickets } = req.body;

    // Generate 'numTickets' number of tickets using the provided rules
    const tickets = generateTickets(numTickets);

    // Save the generated tickets to the database using batch insertion
    await Ticket.insertMany(tickets);

    const ticketIds = tickets.map((ticket) => ticket.associatedId);
    res.json({ message: "Tickets created successfully", ticketIds });
  } catch (err) {
    console.error("Error creating tickets:", err);
    res.status(500).json({ error: "Failed to create tickets" });
  }
});

router.get("/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skipCount = (page - 1) * limit;

    // Fetch tickets associated with the provided ID using pagination
    const tickets = await Ticket.find({ associatedId: id })
      .skip(skipCount)
      .limit(limit);

    res.json({ tickets });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

function generateTickets(numTickets) {
  const tickets = [];

  for (let i = 0; i < numTickets; i++) {
    const ticket = generateTicket();
    tickets.push(ticket);
  }

  return tickets;
}

function generateTicket() {
  const ticket = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  ];

  // Putting 4 zeroes randomly
  for (let i = 0; i < 3; i++) {
    const row = ticket[i];
    const indices = getRandomIndices(9, 4);

    for (let j = 0; j < indices.length; j++) {
      row[indices[j]] = 0;
    }
  }

  // Put random numbers
  for (let i = 0; i < 3; i++) {
    const row = ticket[i];
    for (let j = 1; j <= 9; j++) {
      if (row[j - 1] != 0) {
        row[j - 1] = getRandomNumber(j * 10 - 9, j * 10);
      }
    }
  }

  // Sorting the column
  for (let i = 0; i < 9; i++) {
    let col = [];
    for (let j = 0; j < 3; j++) {
      if (ticket[j][i] != 0) {
        col.push(ticket[j][i]);
      }
    }
    col.sort((a, b) => b - a);
    for (let j = 0; j < 3; j++) {
      if (ticket[j][i] != 0) {
        ticket[j][i] = col.pop();
      }
    }
  }

  return {
    numbers: ticket,
    associatedId: generateUniqueId(),
  };
}

function getRandomIndices(maxIndex, numIndices) {
  const indices = [];

  while (indices.length < numIndices) {
    const randomIndex = Math.floor(Math.random() * maxIndex);

    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }

  return indices;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateUniqueId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = router;
