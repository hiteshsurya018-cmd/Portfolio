"use client"

import { useEffect, useRef, useState } from "react"
import AssistantAvatar from "./AssistantAvatar"
import styles from "./AssistantContainer.module.css"
import AssistantUI, { type ChatMessage } from "./AssistantUI"

type AssistantContainerProps = {
  activeSection: string
  onNavigate: (sectionId: string) => void
}

const sectionPrompts: Record<string, string> = {
  home: "Hey \u{1F44B} I can guide you!",
  skills: "These are the core tools and stacks behind the work here.",
  projects: "This section shows my projects \u{1F680}",
  about: "Here's a quick intro about me.",
  experience: "This section covers my hands-on experience and leadership work.",
  presence: "This area shows GitHub and LinkedIn profile snapshots side by side.",
  contact: "Want to collaborate? I can point you to the fastest way to reach out.",
}

const welcomeMessage =
  "I'm your portfolio guide. Ask about projects, skills, profiles, experience, or contact details."

function createAssistantReply(input: string, activeSection: string) {
  const normalized = input.toLowerCase()

  if (normalized.includes("project")) {
    return {
      content: "The Projects section highlights featured work with live previews. I can scroll you there.",
      navigateTo: "projects",
    }
  }

  if (normalized.includes("about") || normalized.includes("intro")) {
    return {
      content: "The About section gives a concise background, focus areas, and what drives the work.",
      navigateTo: "about",
    }
  }

  if (normalized.includes("contact") || normalized.includes("hire") || normalized.includes("reach")) {
    return {
      content: "The Contact section has the direct form for outreach. I can take you there now.",
      navigateTo: "contact",
    }
  }

  if (
    normalized.includes("github") ||
    normalized.includes("linkedin") ||
    normalized.includes("profile") ||
    normalized.includes("analytics")
  ) {
    return {
      content: "The professional presence section shows GitHub and LinkedIn cards side by side, including repo activity and profile snapshots.",
      navigateTo: "presence",
    }
  }

  if (normalized.includes("resume") || normalized.includes("cv")) {
    return {
      content: "Use the CV or resume action in the hero area to open the PDF. I can keep you near the top section.",
      navigateTo: "home",
    }
  }

  if (normalized.includes("skill") || normalized.includes("stack")) {
    return {
      content: "The Skills section summarizes the stack used across the portfolio and project work.",
      navigateTo: "skills",
    }
  }

  return {
      content:
      activeSection in sectionPrompts
        ? `${sectionPrompts[activeSection]} Ask for projects, profiles, experience, or contact and I'll guide you.`
        : welcomeMessage,
  }
}

export default function AssistantContainer({ activeSection, onNavigate }: AssistantContainerProps) {
  const dockRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [introActive, setIntroActive] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipMessage, setTooltipMessage] = useState(sectionPrompts.home)
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: welcomeMessage },
  ])

  useEffect(() => {
    const entranceTimer = window.setTimeout(() => {
      setHasEntered(true)
    }, 180)

    const introTimer = window.setTimeout(() => {
      setIntroActive(false)
    }, 1800)

    return () => {
      window.clearTimeout(entranceTimer)
      window.clearTimeout(introTimer)
    }
  }, [])

  useEffect(() => {
    const nextMessage = sectionPrompts[activeSection] ?? sectionPrompts.home
    setTooltipMessage(nextMessage)
    const showDelay = hasEntered && introActive ? 640 : 0
    const showTimer = window.setTimeout(() => {
      setShowTooltip(true)
    }, showDelay)

    const timeoutId = window.setTimeout(() => {
      setShowTooltip(false)
    }, showDelay + (introActive ? 5200 : 4200))

    return () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(timeoutId)
    }
  }, [activeSection, hasEntered, introActive])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const dock = dockRef.current
      if (!dock) return

      const bounds = dock.getBoundingClientRect()
      const centerX = bounds.left + bounds.width / 2
      const centerY = bounds.top + bounds.height / 2
      const offsetX = Math.max(-1, Math.min(1, (event.clientX - centerX) / 120))
      const offsetY = Math.max(-1, Math.min(1, (event.clientY - centerY) / 120))

      dock.style.setProperty("--pointer-x", offsetX.toFixed(3))
      dock.style.setProperty("--pointer-y", offsetY.toFixed(3))
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [])

  const pushConversation = (userInput: string) => {
    const reply = createAssistantReply(userInput, activeSection)

    setMessages((current) => [
      ...current,
      { id: `user-${current.length + 1}`, role: "user", content: userInput },
      { id: `assistant-${current.length + 2}`, role: "assistant", content: reply.content },
    ])

    if (reply.navigateTo) {
      window.setTimeout(() => onNavigate(reply.navigateTo), 260)
    }
  }

  const handleSend = () => {
    const value = prompt.trim()
    if (!value) return
    pushConversation(value)
    setPrompt("")
  }

  return (
    <div className={styles.assistantRoot}>
      <div
        ref={dockRef}
        className={styles.assistantDock}
        data-entered={hasEntered}
        data-open={chatOpen}
        data-hovered={hovered}
        data-intro={introActive}
        data-section={activeSection}
      >
        <AssistantUI
          chatOpen={chatOpen}
          currentPrompt={prompt}
          messages={messages}
          showTooltip={showTooltip && !chatOpen}
          tooltipMessage={tooltipMessage}
          onCloseChat={() => setChatOpen(false)}
          onInputChange={setPrompt}
          onSend={handleSend}
          onQuickAction={(value) => {
            setChatOpen(true)
            pushConversation(value)
          }}
        />

        <button
          type="button"
          className={styles.assistantButton}
          onClick={() => setChatOpen((current) => !current)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label="Open virtual assistant"
        >
          <AssistantAvatar hovered={hovered || chatOpen} />
        </button>
      </div>
    </div>
  )
}
