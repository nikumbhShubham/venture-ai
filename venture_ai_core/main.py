import os
import sys
import json
from dotenv import load_dotenv
from graph.workflow import venture_app

load_dotenv()

def run_venture_ai(business_idea: str):
    inputs = {"business_idea": business_idea}
    final_state = venture_app.invoke(inputs)
    return final_state

if __name__ == "__main__":
    if not all(os.getenv(key) for key in ["GEMINI_API_KEY", "A4F_API_KEY", "A4F_API_URL"]):
        raise ValueError("Missing API keys in .env")

    if len(sys.argv) > 1:
        business_idea_from_node = sys.argv[1]
        result = run_venture_ai(business_idea_from_node)

        # ✅ Only JSON goes to stdout
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No business idea provided."}))
