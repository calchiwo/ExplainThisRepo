"use client";

import { useState, use} from "react";

export default function RepoPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = use(params);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!email) return;

    setLoading(true);

    try {
      await
fetch(process.env.NEXT_PUBLIC_WAITLIST_URL!, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          email,
          owner,
          repo,
        }),
      });

    setSubmitted(true);

    } catch (err) {
      alert("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {owner}/{repo}
        </h1>

        <p className="text-gray-500">
          Get a plain English breakdown of this repo when it's ready.
        </p>

        {!submitted ? (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
             className="space-y-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-4 py-2 rounded w-64 bg-white text-black placeholder-gray-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded"
            >
              {loading ? "Submitting..." : "Notify me"}
            </button>
            </form>
          </>
        ) : (
          <p className="text-green-600">
            You’re on the list for {owner}/{repo}
          </p>
        )}
      </div>
    </div>
  );
}
