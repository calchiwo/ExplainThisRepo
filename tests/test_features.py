import sys
import unittest
import asyncio
from contextlib import redirect_stdout
from io import StringIO
import os

# Add root directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from explain_this_repo.agent import create_agent
from explain_this_repo.tools import generate_mermaid_diagram
from explain_this_repo.config import AgentConfig

class TestExplainThisRepoFeatures(unittest.TestCase):
    
    def test_diagram_generation(self):
        """Test mermaid diagram generation syntax."""
        nodes = ["Client", "Server"]
        edges = [("Client", "Server", "request")]
        
        result = generate_mermaid_diagram(nodes, edges)
        
        self.assertIn("graph TD", result)
        self.assertIn('Client["Client"]', result)
        self.assertIn('Client -->|request| Server', result)
        print("✓ Diagram generation verified")

    def test_agent_creation(self):
        """Test that the unified agent is created correctly."""
        config = AgentConfig()
        create_agent(config)
        
        # Verify call args
        from explain_this_repo.agent import OmniCoreAgent as MockAgentClass
        
        self.assertTrue(MockAgentClass.called)
        args, kwargs = MockAgentClass.call_args
        self.assertEqual(kwargs['name'], "explain_repo_agent")
        
        # Check tools are attached
        self.assertIn("local_tools", kwargs)
        print("✓ Unified Agent creation verified")

if __name__ == "__main__":
    unittest.main()
