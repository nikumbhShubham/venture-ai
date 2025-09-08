import os
import sys
import json
from dotenv import load_dotenv
from graph.workflow import venture_app

load_dotenv()

def run_venture_ai(business_idea: str):
    """
    Runs the full Venture AI workflow and returns the final state.
    """
    inputs = {"business_idea": business_idea}
    final_state = venture_app.invoke(inputs)
    return final_state

if __name__ == "__main__":
    if not all(os.getenv(key) for key in ["GEMINI_API_KEY", "A4F_API_KEY", "A4F_API_URL"]):
        raise ValueError("All required API keys must be set in the .env file.")

    if len(sys.argv) > 1:
        business_idea_from_node = sys.argv[1]
        
        # Run the AI workflow
        result = run_venture_ai(business_idea_from_node)
        
        # --- The 'result' is now the complete brand kit ---
        # We will add a 'final_report' key here for consistency with the backend model.
        # In a real app, you might generate this summary on the backend or frontend.
        result['final_report'] = f"Completed brand kit for {result.get('brandName', 'your brand')}."
        
        # Print the final result as a single, clean JSON string.
        print(json.dumps(result, indent=2)) # Using indent for easier manual testing
    else:
        print(json.dumps({"error": "No business idea provided."}))




# import os
# import sys
# import json
# from dotenv import load_dotenv
# from graph.workflow import venture_app

# load_dotenv()

# def run_venture_ai(business_idea: str):
#     inputs = {"business_idea": business_idea}
#     final_state = venture_app.invoke(inputs)
#     return final_state

# if __name__ == "__main__":
#     if not all(os.getenv(key) for key in ["GEMINI_API_KEY", "A4F_API_KEY", "A4F_API_URL"]):
#         raise ValueError("Missing API keys in .env")

#     if len(sys.argv) > 1:
#         business_idea_from_node = sys.argv[1]
#         result = run_venture_ai(business_idea_from_node)

#         # ✅ Only JSON goes to stdout
#         print(json.dumps(result))
#     else:
#         print(json.dumps({"error": "No business idea provided."}))
