from dataclasses import dataclass
from typing import Optional, Dict, Any

@dataclass
class AgentConfig:
    provider: str = "gemini"
    model: str = "gemini-2.0-flash"
    depth: str = "standard"  # quick, standard, deep
    verbose: bool = False
    use_mcp: bool = True
    debug: bool = False
    
DEPTH_CONFIGS: Dict[str, Dict[str, Any]] = {
    "quick": {
        "max_steps": 10, 
        "analyze_files": False,
        "context_management": {
            "enabled": True,
            "mode": "token_budget",
            "value": 10000,
            "strategy": "summarize_and_truncate"
        },
        "tool_offload": {
            "enabled": False
        },
        "memory_tool_backend": None
    },
    "standard": {
        "max_steps": 20, 
        "analyze_files": True, 
        "max_files": 10,
        "context_management": {
            "enabled": True,
            "mode": "token_budget",
            "value": 50000,
            "strategy": "summarize_and_truncate"
        },
        "tool_offload": {
            "enabled": True,
            "threshold_tokens": 1000,
            "max_preview_tokens": 200,
            "storage_dir": ".explain_cache"
        },
        "memory_tool_backend": None
    },
    "deep": {
        "max_steps": 50, 
        "analyze_files": True, 
        "max_files": 50,
        "context_management": {
            "enabled": True,
            "mode": "token_budget",
            "value": 100000, # Higher budget for deep analysis
            "strategy": "summarize_and_truncate"
        },
        "tool_offload": {
            "enabled": True,
            "threshold_tokens": 500, # More aggressive offloading for deep analysis
            "max_preview_tokens": 100,
            "storage_dir": ".explain_cache"
        },
        "memory_tool_backend": "local",
    }
}
