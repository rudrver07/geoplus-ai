from typing import TypedDict, List
from langgraph.graph import StateGraph, END

# Define state structure
class AgentState(TypedDict):
    raw_signal: str
    severity: str
    impacted_regions: List[str]
    threat_assessment: str
    action_plan: List[str]

# Node 1: Parse and classify signal
def parse_signal_node(state: AgentState) -> AgentState:
    signal = state["raw_signal"].lower()
    severity = "medium"
    if "drone" in signal or "explosion" in signal or "closed" in signal:
        severity = "critical"
    elif "meeting" in signal or "quota" in signal:
        severity = "high"
        
    state["severity"] = severity
    return state

# Node 2: Assess threat impact
def assess_threat_node(state: AgentState) -> AgentState:
    severity = state["severity"]
    if severity == "critical":
        assessment = "Immediate shipping lanes disruption. High probability of vessel re-routings."
    else:
        assessment = "Market signals alert. Volatility index rising. Recommend monitoring reserves."
        
    state["threat_assessment"] = assessment
    return state

# Node 3: Generate action plan recommendations
def generate_recommendations_node(state: AgentState) -> AgentState:
    severity = state["severity"]
    if severity == "critical":
        actions = [
            "Deploy naval security details",
            "Leverage Middle East bypass pipelines",
            "Release 5M barrels from reserves"
        ]
    else:
        actions = [
            "Consult bilateral suppliers",
            "Monitor daily corridor throughput rates"
        ]
        
    state["action_plan"] = actions
    return state

# Create the graph workflow
workflow = StateGraph(AgentState)

# Add nodes to graph
workflow.add_node("parse_signal", parse_signal_node)
workflow.add_node("assess_threat", assess_threat_node)
workflow.add_node("generate_recommendations", generate_recommendations_node)

# Set entry point and links
workflow.set_entry_point("parse_signal")
workflow.add_edge("parse_signal", "assess_threat")
workflow.add_edge("assess_threat", "generate_recommendations")
workflow.add_edge("generate_recommendations", END)

# Compile LangGraph
app_graph = workflow.compile()
