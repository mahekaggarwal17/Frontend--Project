const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let creators = require("./seed.json");

app.get("/creators", (req, res) => {
  const { page = 1, limit = 10, sortBy, order = "asc", niche, minFollowers, maxFollowers } = req.query;
  let results = [...creators];
  
  if (niche) results = results.filter(c => c.niche === niche);
  if (minFollowers) results = results.filter(c => c.followerCount >= Number(minFollowers));
  if (maxFollowers) results = results.filter(c => c.followerCount <= Number(maxFollowers));
  
  if (sortBy) {
    results.sort((a, b) => {
      // Handle numeric sorting for Followers and Engagement Rate
      if (sortBy === 'followerCount' || sortBy === 'engagementRate') {
        return order === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
      }
      // Handle string sorting for others
      const valA = String(a[sortBy] || '');
      const valB = String(b[sortBy] || '');
      return order === "desc" ? valB.localeCompare(valA) : valA.localeCompare(valB);
    });
  }
  
  const total = results.length;
  const start = (page - 1) * limit;
  
  res.json({ 
    data: results.slice(start, start + Number(limit)), 
    total, 
    page: Number(page), 
    limit: Number(limit) 
  });
});

app.post("/creators", (req, res) => {
  const creator = { 
    id: String(Date.now()), 
    createdAt: new Date().toISOString(), 
    ...req.body 
  };
  creators.push(creator);
  res.status(201).json(creator);
});

app.patch("/creators/:id", (req, res) => {
  const idx = creators.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  
  creators[idx] = { ...creators[idx], ...req.body };
  res.json(creators[idx]);
});

app.delete("/creators/:id", (req, res) => {
  creators = creators.filter(c => c.id !== req.params.id);
  res.status(204).send();
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Mock API on port ${PORT}`));
