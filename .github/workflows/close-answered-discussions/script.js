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

  owner = 'renovatebot'
  repo = 'renovate'

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

  const resp = await github.graphql(query)
  console.log({ resp })
  const { repository } = resp
  console.log({ a: repository })
  console.log({ a: repository.discussions })
  console.log({ a: repository.discussions.edges })
  console.log({ a: repository.discussions.edges.node })

  console.log(`Found ${repository.discussions.edges.length} discussions!`);

  return ''
}
