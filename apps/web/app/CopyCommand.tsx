"use client";

import { useState } from "react";

export default function CopyCommand() {
  const [copied, setCopied] = useState(false);

  function copyCommand() {
    const text = `pip install explainthisrepo
explainthisrepo owner/repo`;

    navigator.clipboard.writeText(text);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="command-box">
      <button
        className="copy-btn"
        id="copyBtn"
        onClick={copyCommand}
        disabled={copied}
      >
        {copied ? "copied" : "copy"}
      </button>

      <code>pip install explainthisrepo</code>
      <code>explainthisrepo owner/repo</code>
    </div>
  );
}