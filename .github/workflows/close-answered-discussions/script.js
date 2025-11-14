// Parses the ISO date string and checks it's past the age window
// Co-authored-by: GPT-4.1 (GitHub Copilot)
function isOlderThanDaysAgo(dateString, daysAgo) {
  const parsedDate = new Date(dateString);
  const now = new Date();
  const thresholdDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  console.log(thresholdDate)
  console.log(thresholdDate, parsedDate)
  return parsedDate < thresholdDate;
}

module.exports = async ({ github, context }) => {
  // const { owner, repo } = context.repo()
  owner = 'JamieTanna-Mend-testing'
  repo = 'discussion-closing'

  // HACK
  // owner = 'renovatebot'
  // repo = 'renovate'

  let cursor = null

  const query = `query ($cursor: String) {
  repository(owner: "${owner}", name: "${repo}") {
    discussions(after: $cursor, states: OPEN, answered: true, first: 1, orderBy: {field: CREATED_AT, direction: ASC}) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          answerChosenAt
        }
      }
    }
  }
}`

  let discussions = []

  while (true) {
    const resp = await github.graphql(query, { cursor })
    console.log({ resp })
    const { repository } = resp
    console.log({ a: repository })
    console.log({ a: repository.discussions })
    console.log({ a: repository.discussions.edges })
    console.log({ a: repository.discussions.edges.node })

    discussions.push(...repository.discussions.edges)

    if (!query.repository.discussions.pageInfo.hasNextPage) {
      break
    }

    cursor = query.repository.discussions.pageInfo.endCursor
  }

  // TODO not paginating https://github.com/actions/github-script/issues/309

  console.log(`Found ${discussions.length} discussions!`);

  return ''
}
