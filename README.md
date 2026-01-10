# 🏋️‍♂️ Progressive Overload Tracker

A data-driven workout logger designed for serious lifters.

I built this because most fitness apps are bloated with social features or don't handle "micro-loading" (fractional weights) correctly. This app focuses on one thing: **Accurate, distraction-free tracking.**

**https://biomech-tracker.vercel.app/** | **[📺 Video Walkthrough](LINK_TO_LOOM_OR_YOUTUBE)**

<img width="576" height="922" alt="image" src="https://github.com/user-attachments/assets/919c7ca7-8ee6-40a2-91c3-3305b510e790" />


## 🚀 Key Features
* **Visual Progression:** Visualizes **weight lifted** over time to track consistency and progressive overload trends.
* **Auto-Calculated Analytics:** A dynamic dashboard instantly calculates your **Estimated 1-Rep Max** (using the Epley formula) based on your log history.
* **Micro-Loading Support:** Supports fractional weights (e.g., `12.5` lbs), essential for linear progression programs.
* **Instant Feedback:** "Optimistic" UI updates mean the app feels instant, even on slow networks.

## 🛠 Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, Recharts
* **Backend:** Supabase (PostgreSQL, Row Level Security)
* **State:** React Hooks (Custom logic for toasts & data fetching)

## 🧠 Engineering Highlights

**1. Solving the "Micro-loading" Data Problem**
Standard SQL integer columns round `12.5 lbs` down to `12`, making accurate tracking impossible for cable exercises or small increments.
* **Solution:** Engineered the PostgreSQL schema to use `float4` for weight precision, while strictly enforcing `integer` types for reps via a custom client-side validation layer.

**2. Zero-Latency Graph Updates**
Waiting for a database re-fetch caused a 3-5 second delay before new points appeared on the graph.
* **Solution:** Implemented an optimistic update pattern. The app manually formats and hydrates the local state with the new data point immediately after the write succeeds, forcing the Recharts graph to render the new node instantly without a network round-trip.

**3. Non-Blocking Error Handling**
* **Solution:** Instead of using disruptive `window.alert()` calls, I built a custom, lightweight Toast notification system. This handles edge cases (e.g., negative numbers) and provides user feedback without freezing the browser or increasing bundle size with external UI libraries.

## 💻 Run Locally

1. **Clone the repo**
   ```bash
   git clone [https://github.com/davidkimdev/biomech-tracker.git](https://github.com/davidkimdev/biomech-tracker.git)
   cd biomech-tracker
