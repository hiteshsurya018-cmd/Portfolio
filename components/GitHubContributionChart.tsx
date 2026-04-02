"use client"

import { useEffect, useMemo, useState } from "react"
import styles from "./GitHubContributionChart.module.css"

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

type ContributionDetail = {
  count: number
  repoName: string
  repoUrl: string
  title?: string
  type: "commits" | "pull_requests" | "pull_request_reviews" | "issues" | "repositories"
  url?: string
}

type ContributionResponse = {
  calendar: {
    months: ContributionMonth[]
    totalContributions: number
    weeks: ContributionWeek[]
  }
  detailsByDate: Record<string, ContributionDetail[]>
  username: string
}

type Props = {
  months?: number
  username: string
}

const weekdayLabels = [
  { label: "Mon", row: 1 },
  { label: "Wed", row: 3 },
  { label: "Fri", row: 5 },
]

function formatDateLabel(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function detailLabel(detail: ContributionDetail) {
  if (detail.type === "commits") {
    return `${detail.count} commit${detail.count === 1 ? "" : "s"}`
  }

  if (detail.type === "pull_requests") {
    return `${detail.count} pull request${detail.count === 1 ? "" : "s"}`
  }

  if (detail.type === "pull_request_reviews") {
    return `${detail.count} review${detail.count === 1 ? "" : "s"}`
  }

  if (detail.type === "issues") {
    return `${detail.count} issue${detail.count === 1 ? "" : "s"}`
  }

  return `${detail.count} repo creation${detail.count === 1 ? "" : "s"}`
}

export default function GitHubContributionChart({ username, months = 6 }: Props) {
  const [data, setData] = useState<ContributionResponse | null>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        setStatus("loading")
        const response = await fetch(
          `/api/github-contributions?username=${encodeURIComponent(username)}&format=json&months=${months}`,
          {
          signal: controller.signal,
            cache: "no-store",
          }
        )

        if (!response.ok) {
          throw new Error(`Contribution request failed with ${response.status}`)
        }

        const payload = (await response.json()) as ContributionResponse
        setData(payload)
        setStatus("ready")
      } catch (error) {
        if (controller.signal.aborted) return
        console.error("Detailed GitHub contributions fetch failed:", error)
        setStatus("error")
      }
    }

    load()

    return () => controller.abort()
  }, [months, username])

  const latestActiveDate = useMemo(() => {
    if (!data) return null

    const dates = data.calendar.weeks.flatMap((week) => week.contributionDays.map((day) => day.date)).filter(Boolean)
    for (let index = dates.length - 1; index >= 0; index -= 1) {
      const date = dates[index]
      const total = data.detailsByDate[date]?.reduce((sum, detail) => sum + detail.count, 0) ?? 0
      const day = data.calendar.weeks.flatMap((week) => week.contributionDays).find((item) => item.date === date)
      if ((day?.contributionCount ?? 0) > 0 || total > 0) {
        return date
      }
    }

    return dates[dates.length - 1] ?? null
  }, [data])

  useEffect(() => {
    if (!selectedDate && latestActiveDate) {
      setSelectedDate(latestActiveDate)
    }
  }, [latestActiveDate, selectedDate])

  const baseWeekDate = useMemo(() => {
    if (!data) return null
    const firstWeek = data.calendar.weeks.find((week) => week.firstDay)
    return new Date(firstWeek?.firstDay || data.calendar.months[0]?.firstDay || Date.now())
  }, [data])

  if (status === "loading") {
    return (
      <div className="github-state-card">
        <p>Loading contribution activity...</p>
      </div>
    )
  }

  if (status === "error" || !data || !baseWeekDate) {
    return (
      <div className="github-state-card error">
        <p>Detailed contribution activity is unavailable right now.</p>
      </div>
    )
  }

  const allDays = data.calendar.weeks.flatMap((week) => week.contributionDays)
  const activeDate = selectedDate ?? latestActiveDate ?? allDays[allDays.length - 1]?.date ?? null
  const activeDay = allDays.find((day) => day.date === activeDate) ?? null
  const activeDetails = activeDate ? data.detailsByDate[activeDate] ?? [] : []
  const activeTotal = activeDay?.contributionCount ?? activeDetails.reduce((sum, detail) => sum + detail.count, 0)
  const totalWeeks = Math.max(data.calendar.weeks.length, 1)

  return (
    <div className={styles.shell}>
      <div className={styles.chartScroller}>
        <div className={styles.chartFrame}>
          <div className={styles.monthRow}>
            {data.calendar.months.map((month) => {
              const weekIndex = Math.max(
                0,
                Math.min(
                  data.calendar.weeks.length - 1,
                  Math.floor((new Date(month.firstDay).valueOf() - baseWeekDate.valueOf()) / (7 * 24 * 60 * 60 * 1000))
                )
              )

              return (
                <span
                  key={`${month.year}-${month.name}-${month.firstDay}`}
                  className={styles.monthLabel}
                  style={{ left: `calc(var(--chart-label-gutter) + ${weekIndex} * var(--chart-step))` }}
                >
                  {month.name}
                </span>
              )
            })}
          </div>

          <div className={styles.chartGridWrap}>
            <div className={styles.weekdayColumn}>
              {weekdayLabels.map((item) => (
                <span key={item.label} className={styles.weekdayLabel} style={{ gridRow: item.row + 1 }}>
                  {item.label}
                </span>
              ))}
            </div>

            <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${totalWeeks}, var(--chart-cell))` }}>
              {data.calendar.weeks.map((week, weekIndex) =>
                week.contributionDays.map((day, dayIndex) => {
                  const isActive = activeDate === day.date

                  return (
                    <button
                      key={`${day.date}-${weekIndex}-${dayIndex}`}
                      type="button"
                      className={styles.dayCell}
                      data-active={isActive}
                      style={{
                        gridColumn: weekIndex + 1,
                        gridRow: dayIndex + 1,
                        backgroundColor: day.color || "#161b22",
                      }}
                      onClick={() => setSelectedDate(day.date)}
                      aria-label={`${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${formatDateLabel(day.date)}`}
                    />
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailPanel}>
        <div className={styles.detailHeader}>
          <div>
            <p className={styles.detailKicker}>Contribution activity</p>
            <h5>{activeDate ? formatDateLabel(activeDate) : "Select a contribution day"}</h5>
          </div>
          <strong className={styles.totalCount}>
            {activeTotal} contribution{activeTotal === 1 ? "" : "s"}
          </strong>
        </div>

        {activeDetails.length > 0 ? (
          <div className={styles.detailList}>
            {activeDetails.map((detail, index) => (
              <div key={`${detail.type}-${detail.repoName}-${detail.title || "repo"}-${index}`} className={styles.detailItem}>
                <div className={styles.detailPrimary}>
                  <a href={detail.url || detail.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                    {detail.title || detail.repoName}
                  </a>
                  {detail.title ? (
                    <a href={detail.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.repoLink}>
                      {detail.repoName}
                    </a>
                  ) : null}
                </div>
                <span className={styles.detailMeta}>{detailLabel(detail)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>Click a day with activity to inspect repository and contribution details.</p>
        )}
      </div>
    </div>
  )
}
