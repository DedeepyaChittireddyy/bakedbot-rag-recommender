# BakedBot.ai Product Selector & RAG Recommender

Hi BakedBot team 👋,

This is my take-home challenge for BakedBot.ai, featuring a modern, production-inspired React + FastAPI application with both:
- **Product Picker:** Select any product from a sleek dropdown and instantly view its details in a clean, SaaS-style card.
- **RAG Recommendations:** (Optionally, you can still filter products by effect and get RAG-augmented, compliance-aware recommendations.)

---

## ✨ Features

- **Modern UI:** Built with React, Inter font, gradients, and card-based layout for a real startup feel.
- **Product Dropdown:** Instantly see product details by selecting from a dropdown—great for demos and user onboarding.
- **RAG Augmentation:** Each product’s card can show auto-augmented explanations and compliance warnings.
- **Favorites:** Mark products as favorites for easy access.
- **Fully Responsive:** Works on mobile and desktop.
- **FastAPI Backend:** Clean endpoints for all products, single product (with RAG), effects, and recommendations.
- **Extensible:** Easy to add new products, fields, or effects.

---

## 🚀 Quick Start

### Backend (FastAPI)

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start the server:**
   ```bash
   uvicorn main:app --reload
   ```
   The API will be live at `http://localhost:8000`.

3. **Endpoints you’ll use:**
   - `GET /products` &nbsp;→ All products (for dropdown)
   - `GET /products/{id}` &nbsp;→ Full product details with RAG
   - `GET /effects` &nbsp;→ All unique effects
   - `GET /recommendations?effect=relaxation,focus` &nbsp;→ RAG-powered recs

### Frontend (React)

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the app:**
   ```bash
   npm start
   ```
   Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ How It Works

- **Product Dropdown:**  
  - Dropdown lists all available products from `/products`.
  - When you pick one, frontend fetches `/products/{id}` for full details and shows them in a styled card.

- **RAG Recommendations (optional):**
  - Pick effects (e.g., "relaxation") and get a RAG-powered recommendation with compliance flag and explanation.

- **Favorites:**  
  - Any product card can be favorited, stored in browser memory for demo.

---

## 🧑‍💻 Code Organization

```
backend/
  main.py              # FastAPI app and endpoints
  data/
    products.json      # Product database
    ingredients.json   # Ingredient info
frontend/
  src/
    App.js             # Main React app
    App.css            # Styles (modern SaaS look)
  public/
    index.html         # App root
README.md              # This file
```

---

## 📦 Example API Response

```json
// GET /products
{
  "products": [
    {
      "id": 1,
      "name": "Relaxation Tea",
      "description": "A soothing herbal tea blend...",
      "ingredients": ["Chamomile", "Lavender"],
      "price": 12.99
    },
    ...
  ]
}

// GET /products/1
{
  "id": 1,
  "name": "Relaxation Tea",
  "description": "...",
  "ingredients": ["Chamomile", "Lavender"],
  "price": 12.99,
  "augmented_description": "...",
  "explanation": "...",
  "compliance_warning": false
}
```

---

## 🤔 Assumptions & Decisions

- Simple product/ingredient DB for clarity.
- RAG is implemented with Python string logic; could be swapped for vector DB or LLM.
- No login; favorites are local only (could add auth easily).
- Styling is easy to customize for your brand!

---

## 💡 Ideas for the Future

- Add product images and category filters.
- Searchable/select2 dropdown for products.
- Persistent favorites with login.
- Swap RAG logic for real LLM/vector search.
- Enhanced analytics dashboard for product selection and usage.

---

## 🙋‍♂️ Questions?

Message me on LinkedIn, GitHub, or email.  
Thanks for reviewing—excited to show this off in your workflow!

---

**— Dedeepya (2025)**
