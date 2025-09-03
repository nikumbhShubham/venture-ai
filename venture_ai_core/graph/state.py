from typing import TypedDict

class VentureAgentState(TypedDict):
    """
    Represents the state of our creative workflow.
    This is the shared memory that each agent can read from and write to.
    """
    business_idea: str
    brand_name: str
    target_persona: str
    brand_story: str
    logo_prompt: str # The creative prompt for the logo
    logo_concept: str # Will store the base64 encoded image string
    final_report: str

