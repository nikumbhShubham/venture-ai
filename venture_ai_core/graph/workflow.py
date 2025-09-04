import sys
from langgraph.graph import StateGraph, END
from .state import VentureAgentState
from agents.text_agents import namer_node, persona_node, wordsmith_node, get_llm_chain
from agents.visualist_agent import visualist_node

def strategist_node(state: VentureAgentState) -> dict:
    """The final node that uses an LLM to synthesize all the data into a polished report."""
    print("[Strategist] Assembling final brand kit...", file=sys.stderr)

    final_report_prompt = """You are a Senior Brand Strategist. Assemble a polished Brand Identity Kit in Markdown
    from the following assets:

    - Business Idea: {idea}
    - Brand Name: {name}
    - Target Persona: {persona}
    - Brand Story: {story}
    - Logo Prompt: {logo_prompt}

    Structure the report exactly as follows, summarizing where noted:

    ## 1. The Core Idea
    {idea}
    ---
    ## 2. Brand Name
    **{name}**
    ---
    ## 3. Ideal Customer Persona
    (Summarize the key points of the persona in 3-4 bullet points)
    ---
    ## 4. Brand Story
    {story}
    ---
    ## 5. Logo Creative Direction
    (Summarize the key visual ideas from the logo prompt in 3-4 bullet points)
    """
    chain = get_llm_chain(final_report_prompt)
    
    # --- THE FIX IS HERE ---
    # We now pass the 'business_idea' from the state to the final chain.
    final_report = chain.invoke({
        "name": state['brand_name'],
        "persona": state['target_persona'],
        "story": state['brand_story'],
        "logo_prompt": state['logo_prompt'],
        "idea": state['business_idea'] # <-- Added the missing variable
    })
    
    return {"final_report": final_report}

workflow = StateGraph(VentureAgentState)

# Add all the nodes
workflow.add_node("namer", namer_node)
workflow.add_node("persona_architect", persona_node)
workflow.add_node("wordsmith", wordsmith_node)
workflow.add_node("visualist", visualist_node)
workflow.add_node("strategist", strategist_node)

# Define the sequence of the creative process
workflow.set_entry_point("namer")
workflow.add_edge("namer", "persona_architect")
workflow.add_edge("persona_architect", "wordsmith")
workflow.add_edge("wordsmith", "visualist")
workflow.add_edge("visualist", "strategist")
workflow.add_edge("strategist", END)

# Compile the final app
venture_app = workflow.compile()

