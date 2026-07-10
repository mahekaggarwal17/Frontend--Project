# Creator Directory Admin Screen (Frontend Challenge)

A high-fidelity, modern, and visually stunning Creator Directory Admin Screen designed for talent/influencer agencies. Built with **Next.js 16.2 (App Router)**, **Tailwind CSS**, and **TanStack Query (v5)**. Talk to a custom **Express Mock API server** with realistic seed data.

---

## Key Features

* **Server-side pagination** — server-driven (the API returns a page of results plus total count)
* **Server-side sorting** — click header columns to trigger API re-sort
* **Server-side filtering** — niche category dropdown and follower-count range filter
* **Create, edit, and delete creators** — full client-side form validations and modals
* **Optimistic updates with TanStack Query** — UI updates immediately on mutations with cache rollbacks on error
* **Responsive design** — beautiful Forest & Mint layout optimized for all viewports
* **Mock Express API** — fully customizable mock API backend with realistic seed data
* **Deployed on Render** — live hosting configuration included

---

## Getting Started

### Prerequisites

Ensure you have **Node.js** (v18+ recommended) installed on your system.

### Running the Project

#### 1. Start the Mock API Server

Navigate to the `backend` folder, install dependencies, and launch the server:

```bash
cd backend
npm install
npm start
```

The mock server will start on **`http://localhost:4001`**.

#### 2. Start the Next.js Frontend App

Navigate to the `frontend` folder, install dependencies, and run the development server:

```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## Technical Specifications & Architecture Notes

### 1. Query Key Strategy
We implemented a dynamic, single-source-of-truth query key strategy. All query parameters, including page index, filters, and sorting, are serialized directly into the URL. We then read this search parameter state inside our components and pass it as the query key object to TanStack Query:

```typescript
['creators', { page, limit, sortBy, order, niche, minFollowers, maxFollowers }]
```

* **Benefits:** 
  1. Automatic server cache key synchronization: whenever filters or page bounds change, TanStack Query immediately fetches or retrieves cached results for that specific filter combination.
  2. Full browser shareability/bookmarkability out-of-the-box. Sharing the URL loads the exact filter state, page, and sorting index.

### 2. Cache Invalidation and Optimistic Updates
All CRUD mutations (`create`, `update`, `delete`) utilize **Optimistic Updates** to ensure a zero-latency responsive experience:
* On mutation trigger, we cancel outgoing fetches to prevent race conditions.
* We read previous query data, optimistically insert, modify, or remove the target creator, and write it directly to the query cache.
* If the API request succeeds, we invalidate the query cache `['creators']` in the background to fetch clean, server-validated data.
* If the API fails, we automatically roll back the local cache state to the snapshotted state in the `onError` handler.

### 3. Assumptions & Decisions
* **Seed Data:** Expanded the seed list to **35 creators** with varying follower counts (from 8K up to 5.0M) across all 6 niches to demonstrate server-driven pagination, filtering, and sorting accurately.
* **Email Validation:** Implemented client-side regex check for email format validation in the add/edit form.
* **Number Conversions:** Ensured engagement rate and follower counts are parsed into numeric formats before transmitting to the server to prevent data schema mismatches.

---

## What We'd Do Differently With More Time

1. **Integrated E2E Testing:** Add a Playwright / Cypress suite to automate testing for filtering, sorting, pagination, and forms under network latency conditions.
2. **Infinite Scrolling Option:** Support a grid-based infinite scroll/load-more pattern as an alternative presentation layout to the datatable.
3. **Interactive Graphs:** Implement a visual analysis component (using Recharts) to plot niche distribution and average engagement rate dynamically.
