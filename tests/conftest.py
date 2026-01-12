import sys
import os
from unittest.mock import MagicMock, AsyncMock
import pytest


PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)


class FakeToolRegistry:
    def __init__(self):
        self._tools = {}

    def register_tool(self, name, description=None, inputSchema=None):
        def decorator(func):
            # Store the tool name
            self._tools[name] = func
            return func
        return decorator

    def list_tools(self):
        return self._tools

class FakeOmniCoreAgentInstance:
    def __init__(self, name=None, system_instruction=None, model_config=None, local_tools=None, agent_config=None, debug=False, mcp_tools=None):
        self.name = name
        self.local_tools = local_tools
        self.run = AsyncMock()
        self.run.return_value = {"response": "Mocked Response"}
        self.cleanup = AsyncMock()



mock_omni = MagicMock()
mock_omni.ToolRegistry = FakeToolRegistry
mock_omni.OmniCoreAgent = MagicMock(side_effect=FakeOmniCoreAgentInstance)

sys.modules["omnicoreagent"] = mock_omni

@pytest.fixture(scope="session")
def mock_omnicoreagent():
    return sys.modules["omnicoreagent"]
