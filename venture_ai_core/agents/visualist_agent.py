import os
import sys
import base64
from graph.state import VentureAgentState
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from openai import OpenAI

def generate_image_with_a4f(prompt: str, api_key: str, base_url: str) -> str:
    """Uses the OpenAI-compatible A4F API to generate an image."""
    print(f"[A4F API] Sending prompt: '{prompt[:60]}...'", file=sys.stderr)
    try:
        client = OpenAI(api_key=api_key, base_url=base_url)
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
        print(f"[A4F API] Error: {e}", file=sys.stderr)
        return f"Image generation failed: {e}"

def visualist_node(state: VentureAgentState) -> dict:
    """The node for the Visualist agent with the corrected input."""
    print("[Visualist] Designing logo...", file=sys.stderr)

    print("[Visualist] Generating creative prompt with Gemini...", file=sys.stderr)
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7, google_api_key=os.getenv("GEMINI_API_KEY"))
    
    prompt_generation_template = ChatPromptTemplate.from_template(
         """You are a professional logo designer. Create one single, detailed AI image prompt for a logo.

         Brand Name: {name}
         Business Idea: {idea}
         Story: {story}
         Persona: {persona}

         Rules:
         - Style: minimalist, modern, luxury
         - Colors: teal, deep green, metallic grey accents
         - Include subtle eco/water elements (leaf or droplet) without clichés
         - Must be scalable vector, work on light and dark backgrounds
         - Mood: premium, eco-conscious, serene

         Output the design brief as one clean paragraph.
         """
    )
    
    chain = prompt_generation_template | llm | StrOutputParser()
    
    # --- THE FIX IS HERE ---
    # We now pass the 'business_idea' from the state to the chain.
    logo_prompt = chain.invoke({
        "name": state['brand_name'],
        "story": state['brand_story'],
        "persona": state['target_persona'],
        "idea": state['business_idea'] # <-- Added the missing variable
    })
    print(f"[Visualist] Generated logo prompt: {logo_prompt}", file=sys.stderr)

    api_key = os.getenv("A4F_API_KEY")
    base_url = os.getenv("A4F_API_URL")
    if not api_key or not base_url:
        raise ValueError("A4F_API_KEY and A4F_API_URL must be set in your .env file.")

    logo_image_base64 = generate_image_with_a4f(prompt=logo_prompt, api_key=api_key, base_url=base_url)
    
    return {
        "logo_prompt": logo_prompt,
        "logo_concept": logo_image_base64
    }

