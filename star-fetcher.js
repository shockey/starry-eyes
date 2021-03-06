const writeFile = require("writefile")
const Octokit = require("@octokit/rest")
const octokit = Octokit({
  headers: {
    Accept: "application/vnd.github.v3.star+json"
  }
})

if (!process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN === "[YOUR TOKEN HERE]") {
  console.error("Fatal error: you must provide a GitHub token. See the README for instructions.")
  process.exit(1)
}

octokit.authenticate({
  type: 'token',
  token: process.env.GITHUB_TOKEN
})

module.exports = async function saveData(owner, repo) {
  const res = await octokit.paginate('GET /repos/:owner/:repo/stargazers', { owner, repo })
  console.log("done fetching; writing to filesystem!")
  const path = `./star-data/${owner}-${repo}.json`
  await writeFile(path, JSON.stringify(res, null, 2))
  console.log(`data saved to ${path}`)
}