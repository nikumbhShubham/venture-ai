from langgraph.graph import StateGraph, END
from .state import VentureAgentState
from agents.creative_agent import creative_director_node
from agents.visualist_agent import visual_designer_node

# Our new workflow has only two main steps, making it much more reliable.
workflow = StateGraph(VentureAgentState)

# # --- define merge strategy (important!) ---
# def merge_state(old: VentureAgentState, new: dict) -> VentureAgentState:
#     """Merge outputs from nodes into existing state."""
#     merged = old.copy()
#     merged.update({k: v for k, v in new.items() if v is not None})
#     return merged

# workflow.set_state_merger(merge_state)
# --- define merge strategy ---
def merge_state(old: VentureAgentState, new: dict) -> VentureAgentState:
    merged = old.copy()
    merged.update({k: v for k, v in new.items() if v is not None})
    return merged

# Pass merger function directly into StateGraph
workflow = StateGraph(VentureAgentState, merger=merge_state)


# Add nodes
workflow.add_node("creative_director", creative_director_node)
workflow.add_node("visual_designer", visual_designer_node)

# Sequential chain:
workflow.set_entry_point("creative_director")
workflow.add_edge("creative_director", "visual_designer")
workflow.add_edge("visual_designer", END)

# Compile the final, robust app
venture_app = workflow.compile()
