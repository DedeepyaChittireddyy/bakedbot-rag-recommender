from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import os
import json

app = FastAPI(title="BakedBot RAG Recommender")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def load_data(fname):
    with open(os.path.join("data", fname)) as f:
        return json.load(f)

products = load_data("products.json")
ingredients = load_data("ingredients.json")

RESTRICTED_INGREDIENTS = {"Guarana"}  # Demo compliance flag

def rag_augment(product):
    facts = []
    restricted = False
    for ing in product["ingredients"]:
        match = next((i for i in ingredients if i["name"].lower() == ing.lower()), None)
        facts.append(f"{ing} ({match['properties']})" if match else f"{ing} (No info)")
        if ing in RESTRICTED_INGREDIENTS:
            restricted = True
    explanation = (
        f"We recommend {product['name']} because it contains "
        f"{', '.join(product['ingredients'])}. "
        f"{' '.join([i['properties'] for i in ingredients if i['name'] in product['ingredients']])}"
    )
    return {
        "augmented_description": product["description"] + " | Key ingredients: " + "; ".join(facts),
        "explanation": explanation,
        "compliance_warning": restricted
    }

@app.get("/")
def root():
    return {"message": "Welcome to the BakedBot RAG Recommendation API 👋"}

@app.get("/effects")
def get_effects():
    # All unique effects for frontend dropdown
    effect_set = set()
    for p in products:
        effect_set.update([e.lower() for e in p["effects"]])
    return {"effects": sorted(list(effect_set))}

@app.get("/recommendations")
def recommend(effect: str = Query(..., description="Comma-separated effects (e.g. relaxation,focus)")):
    # Support multiple effects (multi-select)
    effects = [e.strip().lower() for e in effect.split(",") if e.strip()]
    if not effects:
        return {"recommendations": [], "message": "Please select at least one effect."}
    if "surprise" in effects:
        return {
            "recommendations": [],
            "message": "Looking for surprises? Try 'relaxation' or 'focus' for tasty suggestions! 😄"
        }

    recs = []
    for prod in products:
        prod_effects = [e.lower() for e in prod["effects"]]
        if any(e in prod_effects for e in effects):
            rag = rag_augment(prod)
            recs.append({
                "id": prod["id"],
                "name": prod["name"],
                "augmented_description": rag["augmented_description"],
                "ingredients": prod["ingredients"],
                "explanation": rag["explanation"],
                "price": prod["price"],
                "compliance_warning": rag["compliance_warning"]
            })
    return {"recommendations": recs, "message": "" if recs else "No recommendations found for those effects."}

@app.get("/products/{pid}")
def get_product(pid: int):
    prod = next((p for p in products if p["id"] == pid), None)
    if not prod:
        return {"error": "Not found"}
    rag = rag_augment(prod)
    out = prod.copy()
    out["augmented_description"] = rag["augmented_description"]
    out["explanation"] = rag["explanation"]
    out["compliance_warning"] = rag["compliance_warning"]
    return out