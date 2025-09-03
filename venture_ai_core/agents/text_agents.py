import os
import sys
from graph.state import VentureAgentState
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

def get_llm_chain(template: str):
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.8,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    prompt = ChatPromptTemplate.from_template(template)
    return prompt | llm | StrOutputParser()

def namer_node(state: VentureAgentState) -> dict:
    chain = get_llm_chain(
        "You are an expert brand strategist. Brainstorm a creative, modern, and memorable brand name for this business idea: '{idea}'. Provide just one single, compelling name."
    )
    name = chain.invoke({"idea": state['business_idea']})
    print(f"[Namer] Generated brand name: {name}", file=sys.stderr)
    return {"brand_name": name.strip()}

def persona_node(state: VentureAgentState) -> dict:
    chain = get_llm_chain(
        "You are a market research analyst. Create a detailed profile of the ideal target customer for a brand named '{name}'."
    )
    persona = chain.invoke({"name": state['brand_name']})
    print("[Persona] Generated persona", file=sys.stderr)
    return {"target_persona": persona}

def wordsmith_node(state: VentureAgentState) -> dict:
    chain = get_llm_chain(
        "Write a compelling, short brand story (2-3 sentences) for '{name}', a brand with this core idea: '{idea}'."
    )
    story = chain.invoke({
        "name": state['brand_name'],
        "idea": state['business_idea'],
        "persona": state['target_persona']
    })
    print("[Wordsmith] Generated story", file=sys.stderr)
    return {"brand_story": story}
import os
import sys
from graph.state import VentureAgentState
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

def get_llm_chain(template: str):
    """A helper function to create a standard text-generation chain using Gemini."""
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.8,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )
    prompt = ChatPromptTemplate.from_template(template)
    return prompt | llm | StrOutputParser()

def namer_node(state: VentureAgentState) -> dict:
    """The Namer Agent: Brainstorms the brand name with better constraints."""
    print("[Namer] Generating brand name...", file=sys.stderr)
    chain = get_llm_chain(
        "You are an expert brand strategist. Brainstorm a creative, modern, and memorable brand name for this business idea: '{idea}'. "
        "Provide just one single, compelling name. The name should be 1-2 words, easy to pronounce, and suitable for a web domain."
    )
    name = chain.invoke({"idea": state['business_idea']})
    print(f"[Namer] Generated brand name: {name}", file=sys.stderr)
    return {"brand_name": name.strip().replace('"', '')}

def persona_node(state: VentureAgentState) -> dict:
    """The Persona Architect Agent: Creates a detailed, grounded customer profile."""
    print("[Persona] Generating persona...", file=sys.stderr)
    # CRITICAL FIX: Pass the original business idea to prevent hallucination.
    chain = get_llm_chain(
        "You are a market research analyst. Create a detailed profile of the ideal target customer for a brand named '{name}', "
        "which is based on this core business idea: '{idea}'. "
        "Be specific about their age, profession, motivations, lifestyle, and the core problem this brand solves for them."
    )
    persona = chain.invoke({
        "name": state['brand_name'],
        "idea": state['business_idea'] # Grounding the agent in reality
    })
    print("[Persona] Generated persona", file=sys.stderr)
    return {"target_persona": persona}

def wordsmith_node(state: VentureAgentState) -> dict:
    """The Wordsmith Agent: Creates a more evocative brand story."""
    print("[Wordsmith] Generating story...", file=sys.stderr)
    chain = get_llm_chain(
        "You are a creative copywriter. Write a compelling, short brand story (2-3 sentences) for '{name}', a brand with this core idea: '{idea}'. "
        "The story should capture the essence of the brand and speak directly to the motivations of this target customer: {persona}."
    )
    story = chain.invoke({
        "name": state['brand_name'],
        "idea": state['business_idea'],
        "persona": state['target_persona']
    })
    print("[Wordsmith] Generated story", file=sys.stderr)
    return {"brand_story": story}

