from langgraph.graph import StateGraph, END
from .state import VentureAgentState
from agents.text_agents import namer_node, persona_node, wordsmith_node, get_llm_chain
from agents.visualist_agent import visualist_node

def strategist_node(state: VentureAgentState) -> dict:
    """The final node that uses an LLM to synthesize all the data into a polished report."""
    final_report_prompt = """
    You are a Senior Brand Strategist. Your team of AI agents has provided you with the following assets for a new brand. Your job is to assemble these into a single, clean, and professional Brand Identity Kit in Markdown format.

    **Brand Name:** {name}
    **Target Persona Summary:** {persona}
    **Brand Story:** {story}
    **Logo Creative Direction:** {logo_prompt}

    **Your Task:**
    1.  Create a "Brand Name" section.
    2.  Create a "Target Persona" section and **summarize** the key points of the persona in 3-4 bullet points.
    3.  Create a "Brand Story" section.
    4.  Create a "Logo Creative Direction" section and **summarize** the key visual ideas in 3-4 bullet points.
    """
    
    chain = get_llm_chain(final_report_prompt)
    
    final_report = chain.invoke({
        "name": state['brand_name'],
        "persona": state['target_persona'],
        "story": state['brand_story'],
        "logo_prompt": state['logo_prompt']
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
