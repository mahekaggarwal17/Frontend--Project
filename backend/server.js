const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let creators = require("./seed.json");

app.get("/creators", (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy,
    order = "asc",
    niche,
    minFollowers,
    maxFollowers,
  } = req.query;

  let results = [...creators];

  // Filtering
  if (niche) {
    results = results.filter((c) => c.niche === niche);
  }
  if (minFollowers) {
    results = results.filter((c) => c.followerCount >= Number(minFollowers));
  }
  if (maxFollowers) {
    results = results.filter((c) => c.followerCount <= Number(maxFollowers));
  }

  // Sorting
  if (sortBy) {
    results.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle strings or numbers
      if (typeof valA === "string") {
        return order === "desc"
          ? valB.localeCompare(valA)
          : valA.localeCompare(valB);
      } else {
        return order === "desc" ? valB - valA : valA - valB;
      }
    });
  }

  const total = results.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginatedData = results.slice(start, start + Number(limit));

  res.json({
    data: paginatedData,
    total,
    page: Number(page),
    limit: Number(limit),
  });
});

app.post("/creators", (req, res) => {
  const { name, niche, followerCount, engagementRate, email, status } = req.body;

  // Server-side validation
  if (!name || !niche || !email) {
    return res.status(400).json({ error: "Missing required fields: name, niche, email" });
  }

  const newCreator = {
    id: String(Date.now()),
    name,
    niche,
    followerCount: Number(followerCount) || 0,
    engagementRate: Number(engagementRate) || 0,
    email,
    status: status || "active",
    createdAt: new Date().toISOString(),
  };

  creators.push(newCreator);
  res.status(201).json(newCreator);
});

app.patch("/creators/:id", (req, res) => {
  const { id } = req.params;
  const idx = creators.findIndex((c) => c.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: "Creator not found" });
  }

  // Merge changes and parse numbers appropriately
  const updates = { ...req.body };
  if (updates.followerCount !== undefined) updates.followerCount = Number(updates.followerCount);
  if (updates.engagementRate !== undefined) updates.engagementRate = Number(updates.engagementRate);

  creators[idx] = {
    ...creators[idx],
    ...updates,
  };

  res.json(creators[idx]);
});

app.delete("/creators/:id", (req, res) => {
  const { id } = req.params;
  const exists = creators.some((c) => c.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Creator not found" });
  }

  creators = creators.filter((c) => c.id !== id);
  res.status(204).send();
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}`);
});
