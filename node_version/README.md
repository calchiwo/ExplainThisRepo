# ExplainThisRepo

This folder contains a high-performance, lightweight port of the ExplainThisRepo CLI tool.
While the original Python implementation is the primary version of this tool, this Node.js port was created to provide a "zero-compilation" experience for users where Python C-extensions (like Pillow) can be difficult to build.

## Features
- **Automated Repository Analysis**: Seamlessly fetches repository data and documentation via the GitHub REST API.
- **AI-Driven Contextualization**: Uses Google Gemini 2.5 Flash Lite to extract technical value and purpose from codebases.
- **Senior Engineer Perspective**: Generates explanations tailored for developers, focusing on architecture, target audience, and execution.
- **Markdown Generation**: Automatically outputs a clean, structured `EXPLAIN.md` file for immediate reading.
- **TypeScript Core**: Built with type safety and modern asynchronous patterns for reliable performance.

## Installation

Follow these steps to set up the project locally on your machine:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/calchiwo/ExplainThisRepo.git
   cd ExplainThisRepo/node_version
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory or export the variable directly in your terminal:
   ```bash
   export GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Build the Project**
   Compile the TypeScript source code into executable JavaScript:
   ```bash
   npm run build
   ```
5  **Link the command globally:**
```bash
   npm link
   ```


## Usage

Once the project is built, you can use the CLI tool to analyze any public GitHub repository.

### Running the CLI
Execute the tool by passing the `owner/repo` string as an argument:

```bash
node dist/cli.js facebook/react
```

### Expected Workflow
1. The tool fetches the repository description and README from GitHub.
2. It processes the information and sends a structured prompt to the Gemini AI.
3. An `EXPLAIN.md` file is generated in your current working directory containing:
   - Project Overview
   - Functional Breakdown
   - Target User Identification
   - Setup/Execution Instructions

### Scripts
- `npm run build`: Compiles TypeScript to the `dist` folder.
- `npm run format`: Formats the codebase using Prettier.
- `npm start`: Runs the tool (requires the repository argument).

## Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

-️ **Report Bugs**: Open an issue if you find any unexpected behavior.
- **Feature Requests**: Proposals for new features are always welcome.
- **Pull Requests**: Ensure your code follows the existing style and all linting passes.

> Note: Please run npm run format before submitting a Pull Request to ensure code consistency.

## License
This project is licensed under the MIT License as specified in the package configuration.

## Author Info

**Caleb Wodi**
- [GitHub](https://github.com/calchiwo)
- [Twitter/X](https://x.com/calchiwo)

Node version contibuted by [@Spectra010s](https://github.com/spectra010s)
