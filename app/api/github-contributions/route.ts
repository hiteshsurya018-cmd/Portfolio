import { NextRequest, NextResponse } from "next/server"

const GITHUB_USERS_BASE_URL = "https://github.com/users"
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"
const CONTRIBUTION_FALLBACK_BASE_URL = "https://github-contributions.vercel.app"
const GRAPH_CELL_SIZE = 11
const GRAPH_GAP = 3
const GRAPH_STEP = GRAPH_CELL_SIZE + GRAPH_GAP
const GRAPH_LABEL_GUTTER = 28
const GRAPH_MONTHS_Y = 16
const GRAPH_GRID_Y = 28

const REQUEST_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  Accept: "image/svg+xml,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://github.com/",
}

type ContributionDay = {
  color: string
  contributionCount: number
  date: string
}

type ContributionMonth = {
  firstDay: string
  name: string
  year: number
}

type ContributionWeek = {
  contributionDays: ContributionDay[]
  firstDay: string
}

type ContributionCalendar = {
  months: ContributionMonth[]
  totalContributions: number
  weeks: ContributionWeek[]
}

type ContributionDetail = {
  count: number
  repoName: string
  repoUrl: string
  title?: string
  type: "commits" | "pull_requests" | "pull_request_reviews" | "issues" | "repositories"
  url?: string
}

type ContributionDetailsByDate = Record<string, ContributionDetail[]>

type ContributionResponse = {
  calendar: ContributionCalendar
  detailsByDate: ContributionDetailsByDate
  username: string
}

type GraphqlContributionPayload = {
  data?: {
    user?: {
      contributionsCollection?: {
        commitContributionsByRepository: Array<{
          contributions: {
            nodes: Array<{
              commitCount: number
              occurredAt: string
            }>
          }
          repository: {
            nameWithOwner: string
            url: string
          }
        }>
        contributionCalendar: ContributionCalendar
        issueContributions: {
          nodes: Array<{
            issue: {
              repository: {
                nameWithOwner: string
                url: string
              }
              title: string
              url: string
            }
            occurredAt: string
          }>
        }
        pullRequestContributions: {
          nodes: Array<{
            occurredAt: string
            pullRequest: {
              repository: {
                nameWithOwner: string
                url: string
              }
              title: string
              url: string
            }
          }>
        }
        pullRequestReviewContributions: {
          nodes: Array<{
            occurredAt: string
            pullRequest: {
              repository: {
                nameWithOwner: string
                url: string
              }
              title: string
              url: string
            }
          }>
        }
        repositoryContributions: {
          nodes: Array<{
            occurredAt: string
            repository: {
              nameWithOwner: string
              url: string
            }
          }>
        }
      }
    }
  }
  errors?: Array<{
    message: string
  }>
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function normalizeWeeks(weeks: ContributionWeek[]) {
  return weeks
}

function addContributionDetail(detailsByDate: ContributionDetailsByDate, date: string, detail: ContributionDetail) {
  if (!date) return

  if (!detailsByDate[date]) {
    detailsByDate[date] = []
  }

  detailsByDate[date].push(detail)
}

function buildContributionResponse(username: string, payload: GraphqlContributionPayload): ContributionResponse | null {
  const collection = payload.data?.user?.contributionsCollection
  const calendar = collection?.contributionCalendar

  if (!calendar?.weeks?.length) return null

  const detailsByDate: ContributionDetailsByDate = {}

  for (const repoContributions of collection.commitContributionsByRepository) {
    for (const contribution of repoContributions.contributions.nodes) {
      addContributionDetail(detailsByDate, contribution.occurredAt.slice(0, 10), {
        type: "commits",
        count: contribution.commitCount,
        repoName: repoContributions.repository.nameWithOwner,
        repoUrl: repoContributions.repository.url,
      })
    }
  }

  for (const contribution of collection.issueContributions.nodes) {
    addContributionDetail(detailsByDate, contribution.occurredAt.slice(0, 10), {
      type: "issues",
      count: 1,
      repoName: contribution.issue.repository.nameWithOwner,
      repoUrl: contribution.issue.repository.url,
      title: contribution.issue.title,
      url: contribution.issue.url,
    })
  }

  for (const contribution of collection.pullRequestContributions.nodes) {
    addContributionDetail(detailsByDate, contribution.occurredAt.slice(0, 10), {
      type: "pull_requests",
      count: 1,
      repoName: contribution.pullRequest.repository.nameWithOwner,
      repoUrl: contribution.pullRequest.repository.url,
      title: contribution.pullRequest.title,
      url: contribution.pullRequest.url,
    })
  }

  for (const contribution of collection.pullRequestReviewContributions.nodes) {
    addContributionDetail(detailsByDate, contribution.occurredAt.slice(0, 10), {
      type: "pull_request_reviews",
      count: 1,
      repoName: contribution.pullRequest.repository.nameWithOwner,
      repoUrl: contribution.pullRequest.repository.url,
      title: contribution.pullRequest.title,
      url: contribution.pullRequest.url,
    })
  }

  for (const contribution of collection.repositoryContributions.nodes) {
    addContributionDetail(detailsByDate, contribution.occurredAt.slice(0, 10), {
      type: "repositories",
      count: 1,
      repoName: contribution.repository.nameWithOwner,
      repoUrl: contribution.repository.url,
    })
  }

  return {
    username,
    calendar,
    detailsByDate,
  }
}

function renderContributionSvg(username: string, calendar: ContributionCalendar) {
  const weeks = normalizeWeeks(calendar.weeks)
  const totalWeeks = Math.max(weeks.length, 1)
  const width = GRAPH_LABEL_GUTTER + totalWeeks * GRAPH_STEP + 12
  const height = GRAPH_GRID_Y + 7 * GRAPH_STEP + 18
  const baseWeekDate = new Date(weeks[0]?.firstDay || calendar.months[0]?.firstDay || new Date().toISOString().slice(0, 10))

  const monthLabels = calendar.months
    .map((month) => {
      const firstDay = new Date(month.firstDay)
      if (Number.isNaN(firstDay.valueOf())) return ""

      const weekIndex = Math.max(
        0,
        Math.min(
          totalWeeks - 1,
          Math.floor((firstDay.valueOf() - baseWeekDate.valueOf()) / (7 * 24 * 60 * 60 * 1000))
        )
      )

      return `<text x="${GRAPH_LABEL_GUTTER + weekIndex * GRAPH_STEP}" y="${GRAPH_MONTHS_Y}" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="10">${escapeXml(month.name)}</text>`
    })
    .join("")

  const weekdayLabels = [
    { label: "Mon", row: 1 },
    { label: "Wed", row: 3 },
    { label: "Fri", row: 5 },
  ]
    .map(
      ({ label, row }) =>
        `<text x="0" y="${GRAPH_GRID_Y + row * GRAPH_STEP + 8}" fill="#8b949e" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="10">${label}</text>`
    )
    .join("")

  const cells = weeks
    .map((week, weekIndex) =>
      week.contributionDays
        .map((day, dayIndex) => {
          const x = GRAPH_LABEL_GUTTER + weekIndex * GRAPH_STEP
          const y = GRAPH_GRID_Y + dayIndex * GRAPH_STEP
          const dateLabel = day.date
            ? new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : ""
          const title = `${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${dateLabel || "this day"}`

          return `<rect x="${x}" y="${y}" width="${GRAPH_CELL_SIZE}" height="${GRAPH_CELL_SIZE}" rx="2" ry="2" fill="${escapeXml(day.color || "#161b22")}"><title>${escapeXml(title)}</title></rect>`
        })
        .join("")
    )
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(username)} contribution chart</title>
  <desc id="desc">GitHub contribution graph for the last 12 months with ${calendar.totalContributions} total contributions.</desc>
  <rect width="${width}" height="${height}" rx="12" ry="12" fill="#0d1117"/>
  ${monthLabels}
  ${weekdayLabels}
  ${cells}
</svg>`
}

async function fetchContributionDataFromGraphql(username: string, from: string, to: string) {
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT
  if (!token) return null

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
      "User-Agent": REQUEST_HEADERS["User-Agent"],
    },
    body: JSON.stringify({
      query: `
        query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                months {
                  firstDay
                  name
                  year
                }
                weeks {
                  firstDay
                  contributionDays {
                    color
                    contributionCount
                    date
                  }
                }
              }
              commitContributionsByRepository(maxRepositories: 100) {
                repository {
                  nameWithOwner
                  url
                }
                contributions(first: 100) {
                  nodes {
                    occurredAt
                    commitCount
                  }
                }
              }
              issueContributions(first: 100) {
                nodes {
                  occurredAt
                  issue {
                    title
                    url
                    repository {
                      nameWithOwner
                      url
                    }
                  }
                }
              }
              pullRequestContributions(first: 100) {
                nodes {
                  occurredAt
                  pullRequest {
                    title
                    url
                    repository {
                      nameWithOwner
                      url
                    }
                  }
                }
              }
              pullRequestReviewContributions(first: 100) {
                nodes {
                  occurredAt
                  pullRequest {
                    title
                    url
                    repository {
                      nameWithOwner
                      url
                    }
                  }
                }
              }
              repositoryContributions(first: 100) {
                nodes {
                  occurredAt
                  repository {
                    nameWithOwner
                    url
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        login: username,
        from: `${from}T00:00:00Z`,
        to: `${to}T23:59:59Z`,
      },
    }),
    next: {
      revalidate: 3600,
    },
  })

  if (!response.ok) return null

  const payload = (await response.json()) as GraphqlContributionPayload
  if (payload.errors?.length) return null

  return buildContributionResponse(username, payload)
}

async function fetchContributionSvgFromGitHub(username: string, from: string, to: string) {
  const response = await fetch(
    `${GITHUB_USERS_BASE_URL}/${encodeURIComponent(username)}/contributions?from=${from}&to=${to}`,
    {
      headers: REQUEST_HEADERS,
      next: {
        revalidate: 3600,
      },
    }
  )

  if (!response.ok) return null

  const svg = await response.text()
  return svg.includes("<svg") ? svg : null
}

async function fetchContributionSvgFromFallback(username: string) {
  const response = await fetch(`${CONTRIBUTION_FALLBACK_BASE_URL}/${encodeURIComponent(username)}.svg`, {
    headers: {
      "User-Agent": REQUEST_HEADERS["User-Agent"],
      Accept: "image/svg+xml,*/*;q=0.8",
    },
    next: {
      revalidate: 3600,
    },
  })

  if (!response.ok) return null

  const svg = await response.text()
  return svg.includes("<svg") ? svg : null
}

async function fetchContributionSvg(username: string, from: string, to: string) {
  try {
    const graphqlData = await fetchContributionDataFromGraphql(username, from, to)
    if (graphqlData) {
      return renderContributionSvg(username, graphqlData.calendar)
    }
  } catch {}

  try {
    const githubSvg = await fetchContributionSvgFromGitHub(username, from, to)
    if (githubSvg) return githubSvg
  } catch {}

  try {
    const fallbackSvg = await fetchContributionSvgFromFallback(username)
    if (fallbackSvg) return fallbackSvg
  } catch {}

  return null
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.trim()
  const format = request.nextUrl.searchParams.get("format")?.trim().toLowerCase()
  const monthsParam = Number.parseInt(request.nextUrl.searchParams.get("months")?.trim() || "6", 10)
  const months = Number.isFinite(monthsParam) ? Math.min(Math.max(monthsParam, 1), 12) : 6

  if (!username) {
    return new NextResponse("Missing GitHub username", { status: 400 })
  }

  const today = new Date()
  const to = today.toISOString().slice(0, 10)
  const fromDate = new Date(today)
  fromDate.setMonth(fromDate.getMonth() - months)
  const from = fromDate.toISOString().slice(0, 10)

  if (format === "json") {
    const data = await fetchContributionDataFromGraphql(username, from, to)

    if (!data) {
      return NextResponse.json({ error: "Detailed contribution activity is unavailable." }, { status: 503 })
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  }

  const svg = await fetchContributionSvg(username, from, to)

  if (!svg) {
    return new NextResponse("Unable to load GitHub contributions", { status: 502 })
  }

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
