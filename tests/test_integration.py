import sys
import unittest
from contextlib import redirect_stdout
from io import StringIO
import os

# Add root directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from explain_this_repo.agent import create_agent
from explain_this_repo.config import AgentConfig

class TestExplainThisRepoIntegration(unittest.TestCase):
    
    def test_agent_creation(self):
        """Test that agent can be created with default config."""
        config = AgentConfig()
        try:
            agent = create_agent(config)
            self.assertIsNotNone(agent)
            print("✓ Agent created successfully")
        except Exception as e:
            self.fail(f"Agent creation failed: {e}")

    def test_local_tools_registration(self):
        """Test that local Github tools are registered correctly."""
        config = AgentConfig()
        agent = create_agent(config)
        registered_tools = list(agent.local_tools.list_tools().keys())
        
        expected_tools = [
            "fetch_repo", 
            "fetch_readme", 
            "fetch_file_tree", 
            "fetch_file_content"
        ]
        
        for tool in expected_tools:
            self.assertIn(tool, registered_tools)
            print(f"✓ Tool '{tool}' registered")
            
    def test_cli_help(self):
        """Test that CLI help command runs without error."""
        from explain_this_repo.cli import main
        
        # Mock sys.argv
        sys.argv = ["explainthisrepo", "--help"]
        
        # Capture stdout
        f = StringIO()
        with redirect_stdout(f):
            try:
                with self.assertRaises(SystemExit):
                    main()
            except Exception as e:
                self.fail(f"CLI help failed: {e}")
                
        output = f.getvalue()
        self.assertIn("Explain GitHub repositories in plain English", output)
        print("✓ CLI help command validated")

if __name__ == "__main__":
    unittest.main()
