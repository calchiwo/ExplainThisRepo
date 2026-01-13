import CopyCommand from "./CopyCommand";

export default function Page() {
  return (
    <>
      <div className="top">
        <a
          className="github-link"
          href="https://github.com/calchiwo/ExplainThisRepo"
          target="_blank"
          rel="noopener"
        >
          ⭐star this project on github
        </a>
      </div>

      <main>
        <div className="container">
          <div className="badges">
            <a
              href="https://pepy.tech/projects/explainthisrepo"
              target="_blank"
              rel="noopener"
            >
              <img
                alt="PyPI Downloads"
                src="https://static.pepy.tech/personalized-badge/explainthisrepo?period=total&units=INTERNATIONAL_SYSTEM&left_color=BLACK&right_color=GREEN&left_text=downloads"
              />
            </a>
          </div>

          <h1>ExplainThisRepo</h1>
          <h2>a cli tool that explains github repos in plain english</h2>

          <CopyCommand />

          <div className="inline-footer">
            built by{" "}
            <a href="https://x.com/calchiwo" target="_blank" rel="noopener">
              Caleb Wodi
            </a>{" "}
            with ❤️ for the open source community
          </div>
        </div>
      </main>

      <div className="seo">
        ExplainThisRepo is an open source CLI tool that explains GitHub
        repositories in plain English by generating an EXPLAIN.md file.
      </div>
    </>
  );
}