import sys
import asyncio
import argparse
from explain_this_repo.agent import run_explanation, run_council
from explain_this_repo.config import AgentConfig
from explain_this_repo.writer import write_output

async def async_main():
    parser = argparse.ArgumentParser(
        prog="explainthisrepo",
        description="Explain GitHub repositories in plain English using OmniCoreAgent"
    )
    parser.add_argument("repo", help="Repository in owner/repo format")
    parser.add_argument("--provider", default="gemini", help="LLM provider (openai, anthropic, gemini, etc.)")
    parser.add_argument("--model", default="gemini-2.5-flash-lite", help="Model name")
    parser.add_argument("--depth", choices=["quick", "standard", "deep"], default="standard", help="Analysis depth")
    parser.add_argument("--verbose", "-v", action="store_true", help="Show detailed progress")
    parser.add_argument("--no-mcp", action="store_true", help="Disable MCP GitHub server")
    parser.add_argument("--audit", action="store_true", help="Run 'The Council' to audit the code (Security, Performance, Style)")
    parser.add_argument("--debug", default=False, help="Enable debug mode")
    
    args = parser.parse_args()
    
    config = AgentConfig(
        provider=args.provider,
        model=args.model,
        depth=args.depth,
        verbose=args.verbose,
        debug=args.debug,
        use_mcp=not args.no_mcp
    )
    
    agent = None
    try:
        if args.audit:
            # COUNCIL MODE
            audit_report = await run_council(args.repo, config)
            
            print("\nWriting AUDIT.md…")
            with open("AUDIT.md", "w") as f:
                f.write(audit_report)
                
            print("AUDIT.md generated successfully 🏛️")
            print("The Council has spoken.")
            return

        # STANDARD EXPLANATION MODE
        explanation, agent, session_id = await run_explanation(args.repo, config)
        
        print("\nWriting EXPLAIN.md…")
        write_output(explanation)

        word_count = len(explanation.split())
        print("EXPLAIN.md generated successfully 🎉")
        print(f"Words: {word_count}")
        
        # Interactive Mode
        print("\n💬 Entering Interactive Mode")
        print("Ask questions about the repository (or type 'exit' to quit)")
        print("-" * 50)
        
        while True:
            try:
                # Use a thread executor for blocking input to not freeze the loop completely
                user_input = await asyncio.get_event_loop().run_in_executor(None, input, "\n> ")
                
                if user_input.lower() in ("exit", "quit"):
                    break
                    
                if not user_input.strip():
                    continue
                    
                print("Thinking...")
                # Pass session_id to reuse memory/context
                response = await agent.run(user_input, session_id=session_id)
                print(response["response"])
                
            except KeyboardInterrupt:
                await agent.cleanup()
                break
            except Exception as e:
                print(f"Error: {e}")

        print("\nGoodbye! 👋")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)
    finally:
        if agent:
            await agent.cleanup()

def main():
    try:
        asyncio.run(async_main())
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    main()
