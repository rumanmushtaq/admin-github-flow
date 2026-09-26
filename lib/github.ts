const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "rumanmushtaq";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers: HeadersInit = {
  Accept: "application/vnd.github.v3+json",
  ...(GITHUB_TOKEN && { Authorization: `Bearer ${GITHUB_TOKEN}` }),
};

export async function fetchGitHubRepos() {
  const repos: any[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated`,
      { headers, next: { revalidate: 60 } },
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const data = await res.json();
    if (data.length === 0) break;

    repos.push(...data);
    page++;
  }

  return repos.map((repo: any) => ({
    githubId: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    githubUrl: repo.html_url,
    homepage: repo.homepage || null,
    description: repo.description || "",
    language: repo.language || "Unknown",
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at,
    topics: repo.topics || [],
    fork: repo.fork,
  }));
}

export async function fetchReadme(fullName: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${fullName}/readme`,
      { headers },
    );

    if (!res.ok) return "";

    const data = await res.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return content.slice(0, 2000);
  } catch {
    return "";
  }
}
