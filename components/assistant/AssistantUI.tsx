"use client"

import { useEffect, useMemo, useRef } from "react"
import styles from "./AssistantContainer.module.css"

export type ChatMessage = {
  id: string
  role: "assistant" | "user"
  content: string
}

type AssistantUIProps = {
  chatOpen: boolean
  currentPrompt: string
  messages: ChatMessage[]
  showTooltip: boolean
  tooltipMessage: string
  onCloseChat: () => void
  onInputChange: (value: string) => void
  onSend: () => void
  onQuickAction: (value: string) => void
}

const quickActions = ["Show projects", "About you", "Contact", "Resume"]

export default function AssistantUI({
  chatOpen,
  currentPrompt,
  messages,
  showTooltip,
  tooltipMessage,
  onCloseChat,
  onInputChange,
  onSend,
  onQuickAction,
}: AssistantUIProps) {
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = messagesRef.current
    if (!container) return
    container.scrollTop = container.scrollHeight
  }, [messages, chatOpen])

  const tooltipClassName = useMemo(
    () => `${styles.tooltip} ${showTooltip ? "" : styles.tooltipHidden}`.trim(),
    [showTooltip]
  )

  return (
    <>
      {tooltipMessage ? (
        <div className={tooltipClassName} aria-hidden={!showTooltip}>
          <div className={styles.tooltipTitle}>
            <span>Virtual Assistant</span>
          </div>
          <div>{tooltipMessage}</div>
        </div>
      ) : null}

      {chatOpen ? (
        <div className={styles.chatPanel} role="dialog" aria-label="Virtual assistant chat">
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              <strong>Portfolio Assistant</strong>
              <span>Context aware guide</span>
            </div>
            <button type="button" className={styles.closeButton} onClick={onCloseChat} aria-label="Close assistant">
              {"\u00D7"}
            </button>
          </div>

          <div ref={messagesRef} className={styles.messages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.role === "assistant" ? styles.assistantMessage : styles.userMessage
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className={styles.quickActions}>
            {quickActions.map((action) => (
              <button key={action} type="button" className={styles.quickAction} onClick={() => onQuickAction(action)}>
                {action}
              </button>
            ))}
          </div>

          <form
            className={styles.chatForm}
            onSubmit={(event) => {
              event.preventDefault()
              onSend()
            }}
          >
            <input
              className={styles.chatInput}
              value={currentPrompt}
              onChange={(event) => onInputChange(event.target.value)}
              placeholder="Ask about projects, skills, or contact..."
              aria-label="Ask the virtual assistant"
            />
            <button type="submit" className={styles.sendButton}>
              Send
            </button>
          </form>
        </div>
      ) : null}
    </>
  )
}
