import requests
from omnicoreagent import ToolRegistry

# --- 1. Implementation Functions ---

def fetch_repo(owner: str, repo: str) -> dict:
    """Fetch GitHub repository metadata."""
    url = f"https://api.github.com/repos/{owner}/{repo}"
    response = requests.get(url)

    if response.status_code != 200:
        raise RuntimeError(f"Failed to fetch metadata: {response.status_code} - {response.text}")

    return response.json()


def fetch_readme(owner: str, repo: str) -> str | None:
    """Fetch raw README content from repository."""
    url = f"https://api.github.com/repos/{owner}/{repo}/readme"
    headers = {"Accept": "application/vnd.github.v3.raw"}
    response = requests.get(url, headers=headers)

    if response.status_code == 404:
        return None

    if response.status_code != 200:
        raise RuntimeError(f"Failed to fetch README: {response.status_code} - {response.text}")

    return response.text


def fetch_file_tree(owner: str, repo: str, path: str = "", max_depth: int = 2) -> list:
    """Fetch repository file tree."""
    url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
    response = requests.get(url)
    
    if response.status_code != 200:
        raise RuntimeError(f"Failed to fetch file tree at '{path}': {response.status_code} - {response.text}")
        
    tree = []
    items = response.json()
    
    # Handle case where path points to a file instead of directory
    if isinstance(items, dict):
        return [{"name": items["name"], "type": items["type"], "path": items["path"]}]
        
    for item in items:
        entry = {
            "name": item["name"],
            "type": item["type"],
            "path": item["path"]
        }
        tree.append(entry)
        
    return tree


def fetch_file_content(owner: str, repo: str, path: str) -> str:
    """Fetch raw file content."""
    # Use raw.githubusercontent.com for raw file content to avoid API rate limits for content
    url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{path}"
    response = requests.get(url)
    
    # Fallback to master if main doesn't exist
    if response.status_code == 404:
        url = f"https://raw.githubusercontent.com/{owner}/{repo}/master/{path}"
        response = requests.get(url)
        
    if response.status_code != 200:
        raise RuntimeError(f"Failed to fetch file content at '{path}': {response.status_code}")
        
    return response.text


def generate_mermaid_diagram(nodes: list, edges: list) -> str:
    """Generates a Mermaid.js graph definition from nodes and edges."""
    graph_def = ["graph TD"]
    
    # Add nodes
    for node in nodes:
        node_id = "".join(c for c in node if c.isalnum())
        if not node_id:
            node_id = "node" # fallback
        graph_def.append(f'    {node_id}["{node}"]')
        
    # Add edges
    # Add edges
    for edge in edges:
        if len(edge) == 3:
            source, target, label = edge
        elif len(edge) == 2:
            source, target = edge
            label = None
        else:
            continue
            
        s_id = "".join(c for c in source if c.isalnum())
        t_id = "".join(c for c in target if c.isalnum())
        
        if label:
            graph_def.append(f'    {s_id} -->|{label}| {t_id}')
        else:
            graph_def.append(f'    {s_id} --> {t_id}')
            
    return "\n".join(graph_def)


# --- 2. Registration Factory ---

def create_tools() -> ToolRegistry:
    """Create a unified registry containing all available tools."""
    tools = ToolRegistry()
    
    @tools.register_tool(
        name="fetch_repo",
        description="""
        Fetch metadata for a GitHub repository.
        
        **What it produces:**
        A JSON object containing repository details like description, stars, forks, language, and default branch.
        """,
        inputSchema={
            "type": "object",
            "properties": {
                "owner": {"type": "string", "description": "Repository owner (e.g. 'facebook')"},
                "repo": {"type": "string", "description": "Repository name (e.g. 'react')"}
            },
            "required": ["owner", "repo"]
        }
    )
    def fetch_repo_wrapper(owner: str, repo: str) -> dict:
        try:
            return {"status": "success", "data": fetch_repo(owner, repo)}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @tools.register_tool(
        name="fetch_readme",
        description="""
        Fetch the raw text content of the repository's README file.
        """,
        inputSchema={
            "type": "object",
            "properties": {
                "owner": {"type": "string", "description": "Repository owner"},
                "repo": {"type": "string", "description": "Repository name"}
            },
            "required": ["owner", "repo"]
        }
    )
    def fetch_readme_wrapper(owner: str, repo: str) -> dict:
        try:
            return {"status": "success", "data": fetch_readme(owner, repo)}
        except Exception as e:
            return {"status": "error", "message": str(e)}
            
    @tools.register_tool(
        name="fetch_file_tree",
        description="""
        Fetch the file structure of the repository.
        
        **When to use:**
        Use this to explore the codebase structure, find source files, and understand the project layout.
        """,
        inputSchema={
            "type": "object",
            "properties": {
                "owner": {"type": "string", "description": "Repository owner"},
                "repo": {"type": "string", "description": "Repository name"},
                "path": {"type": "string", "description": "Subdirectory path (optional)"},
                "max_depth": {"type": "integer", "description": "Recursion depth (default: 2)"}
            },
            "required": ["owner", "repo"]
        }
    )
    def fetch_file_tree_wrapper(owner: str, repo: str, path: str = "", max_depth: int = 2) -> dict:
        try:
            return {"status": "success", "data": fetch_file_tree(owner, repo, path, max_depth)}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @tools.register_tool(
        name="fetch_file_content",
        description="""
        Read the content of a specific file.
        """,
        inputSchema={
            "type": "object",
            "properties": {
                "owner": {"type": "string", "description": "Repository owner"},
                "repo": {"type": "string", "description": "Repository name"},
                "path": {"type": "string", "description": "Path to the file"}
            },
            "required": ["owner", "repo", "path"]
        }
    )
    def fetch_file_content_wrapper(owner: str, repo: str, path: str) -> dict:
        try:
            return {"status": "success", "data": fetch_file_content(owner, repo, path)}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @tools.register_tool(
        name="generate_mermaid_diagram",
        description="""
        Generates a Mermaid.js graph definition from nodes and edges.
        
        **Input Format:**
        - nodes: List of strings (e.g. ["ModuleA", "ModuleB"])
        - edges: List of tuples (e.g. [("ModuleA", "ModuleB", "imports")])
        """,
        inputSchema={
            "type": "object",
            "properties": {
                "nodes": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of node names"
                },
                "edges": {
                    "type": "array",
                    "items": {
                        "type": "array",
                        "minItems": 2,
                        "maxItems": 3,
                        "items": [
                            {"type": "string", "description": "Source node"},
                            {"type": "string", "description": "Target node"},
                            {"type": "string", "description": "Label (optional)"}
                        ]
                    },
                    "description": "List of edges, where each edge is [source, target] or [source, target, label]"
                }
            },
            "required": ["nodes", "edges"]
        }
    )
    def generate_mermaid_diagram_wrapper(nodes: list, edges: list) -> dict:
        try:
            return {"status": "success", "data": generate_mermaid_diagram(nodes, edges)}
        except Exception as e:
            return {"status": "error", "message": str(e)}
            
    return tools
