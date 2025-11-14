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

module.exports = async ({ github, context, discussionAnsweredDays }) => {
  // const { owner, repo } = context.repo()
  owner = 'JamieTanna-Mend-testing'
  repo = 'discussion-closing'

  // HACK
  owner = 'renovatebot'
  repo = 'renovate'

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

  // let discussions = []

  // NOTE not paginating https://github.com/actions/github-script/issues/309
  while (true) {
    console.debug({ cursor }, "Starting query")
    const resp = await github.graphql(query, { cursor })
    console.log({ resp })
    const { repository } = resp
    console.debug({ a: repository })
    console.debug({ a: repository.discussions })
    console.debug({ a: repository.discussions.edges })

    console.log(`Found ${repository.discussions.edges.length} discussions`);

    // discussions.push(...repository.discussions.edges)

    if (!resp.repository.discussions.pageInfo.hasNextPage) {
      break
    }

    let mutation = 'mutation {'
    for (let i in resp.repository.discussions.edges) {
      let edge = resp.repository.discussions.edges[i]
      if (isOlderThanDaysAgo(edge.node.answerChosenAt, discussionAnsweredDays)) {
        mutation += `m${i}: closeDiscussion(input: {discussionId: "${edge.node.id}"}) {
    clientMutationId
    }\n`
      }
    }

    mutation += '}'

    console.log({ mutation })

    // HACK
    break


    // cursor = resp.repository.discussions.pageInfo.endCursor
  }

  //
  // console.log(`Found ${discussions.length} discussions!`);

  return ''
}
