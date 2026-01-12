import unittest
from unittest.mock import MagicMock, patch, AsyncMock
from explain_this_repo.agent import run_council
from explain_this_repo.config import AgentConfig

class TestCouncil(unittest.IsolatedAsyncioTestCase):
    @patch("explain_this_repo.agent.OmniCoreAgent")
    @patch("explain_this_repo.agent.create_tools")
    async def test_run_council_orchestration(self, mock_create_tools, MockAgent):
        # Setup mocks
        mock_tools = MagicMock()
        mock_create_tools.return_value = mock_tools
        
        # Mock the agents
        mock_security = AsyncMock()
        mock_perf = AsyncMock()
        mock_style = AsyncMock()
        
        # Setup their return values
        mock_security.run.return_value = {"response": "## Security Analysis\nGrade: A"}
        mock_perf.run.return_value = {"response": "## Performance Analysis\nGrade: B"}
        mock_style.run.return_value = {"response": "## Style Analysis\nGrade: C"}
        
        # MockAgent constructor returns these mocks in order of instantiation
        # Order in council.py: security, perf, style
        MockAgent.side_effect = [mock_security, mock_perf, mock_style]
        
        config = AgentConfig(provider="test", model="test-model")
        
        # Run functionality
        report = await run_council("owner/repo", config)
        
        # Verify Instantiation
        self.assertEqual(MockAgent.call_count, 3)
        
        # Verify Execution
        mock_security.run.assert_called_once()
        mock_perf.run.assert_called_once()
        mock_style.run.assert_called_once()
        
        # Verify Report Aggregation
        self.assertIn("## Security Analysis", report)
        self.assertIn("## Performance Analysis", report)
        self.assertIn("## Style Analysis", report)
        self.assertIn("The Code Has Been Judged", report)

if __name__ == "__main__":
    unittest.main()
