from typing import TypedDict, List, Dict

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
    color_palette:Dict[str,str]
    font_pairing:Dict[str,str]
    
    market_positioning:str
    marketing_channels: List[str]
    content_pillars:List[str]
    post_ideas:List[str]
        
    final_report: str

