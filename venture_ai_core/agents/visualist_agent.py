import os
import sys
import base64
import time 
from graph.state import VentureAgentState
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser,JsonOutputParser
from openai import OpenAI

def generate_image_with_a4f(prompt: str, api_key: str, base_url: str) -> str:
    """Uses the OpenAI-compatible A4F API to generate an image, with timeout and retry logic."""
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            print(f"[A4F API] Sending prompt (Attempt {attempt + 1}/{max_retries})...", file=sys.stderr)
            
            client = OpenAI(
                api_key=api_key, 
                base_url=base_url,
                timeout=120.0 
            )
            
            response = client.images.generate(
                model="provider-4/imagen-4",
                prompt=prompt,
                n=1,
                size="1024x1024",
                response_format="b64_json"
            )

            print("[A4F API] Image successfully generated.", file=sys.stderr)
            return response.data[0].b64_json

        except Exception as e:
            print(f"[A4F API] Error on attempt {attempt + 1}: {e}", file=sys.stderr)
            if attempt == max_retries - 1:
                # --- THE FIX: Return a clean failure signal ---
                # Instead of the ugly HTML error, we return a simple, machine-readable string.
                print("[A4F API] All retries failed. Proceeding without logo.", file=sys.stderr)
                return "generation_failed"
            print("[A4F API] Waiting for 10 seconds before retrying...", file=sys.stderr)
            time.sleep(10)
            
    return "generation_failed" # Fallback return

def visual_designer_node(state: VentureAgentState) -> dict:
    """
    Generates the complete visual identity: logo prompt, colors, and fonts, then the logo image.
    """
    print("[Visual Designer] Creating visual assets...", file=sys.stderr)
    
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.7,
        google_api_key=os.getenv("GEMINI_API_KEY"),
        model_kwargs={"response_mime_type": "application/json"}
    )
    
    parser = JsonOutputParser()
    prompt = ChatPromptTemplate.from_template(
       """
You are a Senior Brand Designer. Based on the provided identity, create a visual branding package.

**Brand Name:** {name}
**Business Idea:** {idea}
**Target Persona:** {persona}

**Your Task:**
1. **Logo Prompt:** Write one detailed, professional prompt for an AI image generator.
2. **Color Palette:** Define a palette with exactly 4 colors.
   - MUST return as an object with keys: "primary", "secondary", "accent1", "accent2".
   - Values MUST be valid HEX color codes (e.g., "#FF5733").
3. **Font Pairing:** Suggest one Google Font for headings and one for body text.
   - MUST return as an object with keys: "heading" and "body".

Return only a single valid JSON object with keys: "logo_prompt", "color_palette", and "font_pairing". 
Do not include explanations, markdown, text outside JSON, or arrays for color_palette or font_pairing.
"""

    )
    
    chain = prompt | llm | parser

    try:
        visual_assets = chain.invoke({
            "name": state['brand_name'],
            "idea": state['business_idea'],
            "persona": state['target_persona'],
        })

        logo_prompt = visual_assets.get("logo_prompt", "A beautiful logo.")

        api_key = os.getenv("A4F_API_KEY")
        base_url = os.getenv("A4F_API_URL")
        logo_image_base64 = generate_image_with_a4f(logo_prompt, api_key, base_url)
        
        print("[Visual Designer] Visual identity created.", file=sys.stderr)
        return {
            "logo_prompt": logo_prompt,
            "color_palette": visual_assets.get("color_palette"),
            "font_pairing": visual_assets.get("font_pairing"),
            "logo_concept": logo_image_base64
        }
    except Exception as e:
        print(f"[Visual Designer] Error: {e}", file=sys.stderr)
        return {}
