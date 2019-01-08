#!/usr/bin/env node
require('dotenv').config()
const fs = require("fs")
const writeFile = require("writefile")
const starFetcher = require("./star-fetcher")
const starReporter = require("./star-reporter")

const args = process.argv.slice(2)

const verb = args[0]

async function main() {
  if (verb === "fetch") {
    const item = args[1]

    if(item === "stars") {
      const [owner, repo] = args[2].split("/")
      console.log(`downloading stargazer data for ${owner}'s ${repo} repository`)
      await starFetcher(owner, repo)
      process.exit(0)
    }
  }

  if(verb === "report") {
    const item = args[1]

    if(item === "stars") {
      const [owner, repo] = args[2].split("/")
      
      try {
        const data = fs.readFileSync(`./star-data/${owner}-${repo}.json`)
        const obj = JSON.parse(data)
        const path = `./star-reports/${owner}-${repo}.csv`
        const projection = await starReporter(obj)
        await writeFile(path, projection)
        console.log(`report saved to ${path}`)
      } catch(e) {
        console.error(e)
        console.error("Fatal error: Could not read star data.")
        process.exit(1)
      }
    }
  }
}

main()