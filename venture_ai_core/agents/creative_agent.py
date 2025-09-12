import os
import sys
import json
from graph.state import VentureAgentState
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser


def creative_director_node(state: VentureAgentState) -> dict:
    """
    A single, powerful agent that generates all text and marketing assets in one call.
    """
    print("[Creative Director] Generating full brand strategy...", file=sys.stderr)
    
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.8,
        api_key=os.getenv("GEMINI_API_KEY"),  # renamed param
        response_format="json",               # instead of model_kwargs
    )


    
    parser = JsonOutputParser()

    prompt = ChatPromptTemplate.from_template(
        """
        You are a complete AI creative agency. Based on the business idea, generate a full brand identity.

        **BUSINESS IDEA:** '{idea}'

        **YOUR TASK:**
        1.  **Brand Name:** Generate one creative, modern brand name (1-2 words).
        2.  **Target Persona:** Create a detailed profile of the ideal customer.
        3.  **Brand Story:** Write a compelling, short brand story (2-3 sentences).
        4.  **Market Positioning:** Write a one-sentence statement defining the brand's unique market position.
        5.  **Marketing Channels:** Identify the top 3 digital marketing channels as a list of strings.
        6.  **Content Pillars:** Define 3 core content themes as a list of strings.
        7.  **Post Ideas:** Provide one creative post idea for each content pillar as a list of strings.

        You MUST return a single, valid JSON object with keys: "brand_name", "target_persona", "brand_story", "market_positioning", "marketing_channels", "content_pillars", "post_ideas".
        """
    )
    
    chain = prompt | llm | parser

    try:
        response_json = chain.invoke({"idea": state['business_idea']})
        print("[Creative Director] Strategy developed successfully.", file=sys.stderr)
        # Return all the generated data to be merged into the state
        return {
            "brand_name": response_json.get("brand_name"),
            # "target_persona": response_json.get("target_persona"),
            "target_persona": json.dumps(response_json.get("target_persona")), 
            "brand_story": response_json.get("brand_story"),
            "market_positioning": response_json.get("market_positioning"),
            "marketing_channels": response_json.get("marketing_channels"),
            "content_pillars": response_json.get("content_pillars"),
            "post_ideas": response_json.get("post_ideas"),
        }
    except Exception as e:
        print(f"[Creative Director] Error: {e}", file=sys.stderr)
        return {} # Return empty on failure

