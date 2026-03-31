"use client"

import type React from "react"

import { useState, useEffect } from "react"
import emailjs from "@emailjs/browser"
import AssistantContainer from "./components/assistant/AssistantContainer"

type GitHubProfile = {
  login: string
  avatar_url: string
  html_url: string
  blog: string | null
  location: string | null
  bio: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

const linkedInProfile = {
  url: "https://www.linkedin.com/in/hitesh-surya-b1119a342",
  handle: "hitesh-surya-b1119a342",
  name: "Hitesh Surya Thejaswi M",
  headline: "Software Engineer | Full Stack | AI/ML | Data Scientist",
  location: "Bengaluru, Karnataka, India",
  analytics: [
    { label: "Profile viewers", value: "168", detail: "Past 90 days" },
    { label: "Post impressions", value: "119", detail: "84.9% past 7 days" },
    { label: "Search appearances", value: "7", detail: "Previous week" },
  ],
  highlights: [
    { label: "Location", value: "Bengaluru, Karnataka, India" },
    { label: "Profile Handle", value: "hitesh-surya-b1119a342" },
  ],
}

export default function Portfolio() {
  const emailjsConfigured = Boolean(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  )
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitState, setSubmitState] = useState<{
    status: "idle" | "sending" | "sent" | "error"
    message: string
  }>({
    status: "idle",
    message: "",
  })

  const [activeSection, setActiveSection] = useState("home")
  const [githubProfile, setGithubProfile] = useState<GitHubProfile | null>(null)
  const [githubStatus, setGithubStatus] = useState<"loading" | "ready" | "error">("loading")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all fields")
      return
    }
    setSubmitState({ status: "sending", message: "Sending your message..." })
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("Email service not configured")
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        { publicKey }
      )

      setSubmitState({ status: "sent", message: "Message sent. I'll get back to you soon." })
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "text" in error
          ? String((error as { text?: string }).text || "Failed to send. Please try again in a moment.")
          : "Failed to send. Please try again in a moment."
      console.error("EmailJS send failed:", error)
      setSubmitState({ status: "error", message })
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToNextSection = () => {
    const skillsSection = document.getElementById("skills")
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const [selectedProject, setSelectedProject] = useState("garden")



  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      let currentSection = ''

      sections.forEach((section) => {
        const sectionElement = section as HTMLElement
        const sectionTop = sectionElement.offsetTop
        const sectionHeight = sectionElement.clientHeight
        if (window.scrollY >= sectionTop - 200) {
          currentSection = section.getAttribute('id') || ''
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const videoMap = [
      { id: "garden", videoId: "garden-video", emojiId: "garden-emoji" },
      { id: "exchange", videoId: "exchange-video", emojiId: "exchange-emoji" },
    ]

    videoMap.forEach(({ id, videoId, emojiId }) => {
      const video = document.getElementById(videoId) as HTMLVideoElement | null
      const emoji = document.getElementById(emojiId)
      if (!video || !emoji) return

      const shouldPlay = activeSection === "projects" && selectedProject === id

      if (shouldPlay) {
        emoji.style.opacity = "0"
        video.style.opacity = "1"
        video.muted = false
        video.controls = true
        video.currentTime = 0
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      } else {
        video.pause()
        video.currentTime = 0
        video.muted = true
        video.controls = false
        emoji.style.opacity = "1"
        video.style.opacity = "0"
      }
    })
  }, [activeSection, selectedProject])

  useEffect(() => {
    const controller = new AbortController()

    const loadGithubProfile = async () => {
      try {
        setGithubStatus("loading")
        const response = await fetch("https://api.github.com/users/hiteshsurya018-cmd", {
          signal: controller.signal,
          headers: {
            Accept: "application/vnd.github+json",
          },
        })

        if (!response.ok) {
          throw new Error(`GitHub request failed with ${response.status}`)
        }

        const data = (await response.json()) as GitHubProfile
        setGithubProfile(data)
        setGithubStatus("ready")
      } catch (error) {
        if (controller.signal.aborted) return
        console.error("GitHub profile fetch failed:", error)
        setGithubStatus("error")
      }
    }

    loadGithubProfile()

    return () => controller.abort()
  }, [])

  const formatGithubDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date))

  const downloadCV = () => {
    const link = document.createElement("a")
    link.href = "/Surya(ATS).pdf"
    link.download = "Surya(ATS).pdf"
    link.target = "_blank" // open PDF in new tab/window
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="portfolio">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .portfolio {
          font-family: var(--font-body), "Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif;
          background: radial-gradient(1200px 600px at 10% -10%, rgba(60, 140, 230, 0.12), transparent 62%),
            radial-gradient(900px 500px at 110% 10%, rgba(45, 95, 215, 0.14), transparent 62%),
            radial-gradient(1000px 800px at 50% 120%, rgba(30, 70, 190, 0.16), transparent 62%),
            #05070d;
          color: #f5f7ff;
          line-height: 1.6;
          overflow-x: hidden;
          position: relative;
        }

        .portfolio::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(circle at 50% 20%, rgba(0, 0, 0, 0.8), transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .portfolio::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(400px 200px at 20% 30%, rgba(255, 255, 255, 0.08), transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .portfolio > * {
          position: relative;
          z-index: 1;
        }

        /* Navigation */
        .navbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(6, 9, 16, 0.75);
          backdrop-filter: blur(26px);
          -webkit-backdrop-filter: blur(26px);
          z-index: 1000;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
        }

        .navbar.scrolled {
          background: rgba(6, 9, 16, 0.92);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.4);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 400;
          font-family: var(--font-display), "Bebas Neue", system-ui, sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f4f8ff;
          text-shadow: 0 10px 30px rgba(111, 255, 233, 0.25);
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 1.6rem;
          align-items: center;
          padding: 0.6rem 1.2rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.02);
        }

        .nav-links button {
          background: none;
          border: none;
          color: #cdd7f3;
          text-decoration: none;
          transition: color 0.3s ease;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
        }

        .nav-links button:hover {
          color: #8fc5ff;
        }

        .nav-links button.active {
          color: #8fc5ff;
          position: relative;
        }

        .nav-links button.active::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #5a7bff, transparent);
          border-radius: 999px;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 5.5rem 2rem 2rem;
          position: relative;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 3.5rem;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-content h1 {
          font-size: clamp(2.8rem, 4vw, 4.6rem);
          font-weight: 500;
          font-family: var(--font-display), "Bebas Neue", system-ui, sans-serif;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .hero-content .name {
          background: linear-gradient(120deg, #6fb7ff 0%, #7da6ff 50%, #4a7dff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: #a8b3d6;
          margin-bottom: 2rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #b4bfdc;
          margin-bottom: 3rem;
          line-height: 1.8;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: linear-gradient(120deg, #6fb7ff 0%, #7da6ff 60%, #4a7dff 100%);
          color: #02040a;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 12px 30px rgba(90, 123, 255, 0.3);
        }

        .btn-secondary {
          background: transparent;
          color: #f5f7ff;
          padding: 1rem 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          border-color: #8fc5ff;
          background: rgba(90, 123, 255, 0.1);
        }

        .hero-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .profile-image-container {
          width: 320px;
          height: 320px;
          border: 2px solid rgba(90, 123, 255, 0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(90, 123, 255, 0.12);
          position: relative;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
        }

        .profile-image-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent, #5a7bff, #8fc5ff, transparent);
          animation: rotate 6s linear infinite;
          z-index: 1;
        }

        .profile-image-container::after {
          content: '';
          position: absolute;
          inset: 3px;
          background: #070a12;
          border-radius: 50%;
          z-index: 2;
        }

        .profile-photo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          position: relative;
          z-index: 3;
          transition: transform 0.3s ease;
        }

        .profile-photo:hover {
          transform: scale(1.05);
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .social-links a {
          color: #aeb8d6;
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.3s ease, transform 0.3s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .social-links a:hover {
          color: #8fc5ff;
          transform: translateY(-2px);
          background: rgba(90, 123, 255, 0.1);
          border-color: rgba(90, 123, 255, 0.55);
        }

        .social-links a svg {
          width: 20px;
          height: 20px;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: #a6b1d0;
          font-size: 1.5rem;
          animation: bounce 2s infinite;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .scroll-indicator:hover {
          color: #8fc5ff;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        /* Section Styles */
        .section {
          padding: 6.5rem 2rem;
        }

        #projects.section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 3rem 2rem;
        }

        #projects .container {
          width: 100%;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: clamp(2.2rem, 3vw, 3.2rem);
          font-weight: 500;
          font-family: var(--font-display), "Bebas Neue", system-ui, sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          color: #9ea8c7;
          text-align: center;
          margin-bottom: 4rem;
          font-size: 1.1rem;
        }

        /* Skills Section */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .skill-category {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: transform 0.3s ease, border-color 0.3s ease;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
        }

        .skill-category:hover {
          transform: translateY(-5px);
          border-color: rgba(90, 123, 255, 0.6);
        }

        .skill-category h3 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #ffffff;
        }

        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .skill-tag {
          background: rgba(90, 123, 255, 0.18);
          color: #8fc5ff;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          border: 1px solid rgba(90, 123, 255, 0.3);
        }

        /* Projects Section */
        .projects-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 2rem;
          align-items: start;
        }

        .projects-list {
          display: grid;
          gap: 1rem;
        }

        .project-item {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1rem 1.1rem;
          text-align: left;
          color: #cdd7f3;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }

        .project-item:hover {
          border-color: rgba(90, 123, 255, 0.4);
          transform: translateY(-2px);
        }

        .project-item.active {
          border-color: rgba(90, 123, 255, 0.65);
          box-shadow: 0 18px 40px rgba(10, 12, 26, 0.45);
          color: #8fc5ff;
        }

        .project-stage {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.5rem;
          min-height: 380px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .project-stage::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 40%, rgba(90, 123, 255, 0.25), transparent 60%);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }

        .project-stage.active::before {
          opacity: 1;
        }

        .project-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          overflow: hidden;
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          box-shadow: 0 22px 50px rgba(0, 0, 0, 0.35);
          position: relative;
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
        }

        .project-image {
          height: 230px;
          background: linear-gradient(135deg, rgba(111, 183, 255, 0.14) 0%, rgba(74, 125, 255, 0.12) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8fc5ff;
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          position: relative;
          overflow: hidden;
          border-radius: 14px 14px 0 0;
          background-color: #0b0f1a;
        }

        .project-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          max-width: 100%;
          max-height: 100%;
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .project-emoji {
          position: relative;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        .project-content {
          padding: 1.2rem 1.6rem 1.4rem;
          position: relative;
          z-index: 1;
        }

        .project-content h3 {
          font-size: 1.25rem;
          margin-bottom: 0.4rem;
          color: #ffffff;
        }

        .project-details {
          margin-top: 0.6rem;
        }

        .project-content p {
          color: #a7b1cf;
          margin-bottom: 1.2rem;
          line-height: 1.55;
          font-size: 0.95rem;
        }

        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .tech-tag {
          background: rgba(90, 123, 255, 0.18);
          color: #8fc5ff;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .project-links {
          display: flex;
          gap: 1rem;
        }

        .project-links a,
        .project-links button {
          background: none;
          border: none;
          color: #8fc5ff;
          text-decoration: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.3s ease;
          cursor: pointer;
          font-size: 1rem;
        }

        .project-links a:hover,
        .project-links button:hover {
          color: #ffffff;
        }

        /* About Section */
        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .about-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #a9b3d1;
        }

        .about-text strong {
          color: #8fc5ff;
        }

        .about-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        .info-item h4 {
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .info-item p {
          color: #8892b0;
        }

        .expertise-cards {
          display: grid;
          gap: 1.5rem;
        }

        .expertise-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.3s ease, border-color 0.3s ease;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
        }

        .expertise-card:hover {
          transform: translateX(10px);
          border-color: rgba(90, 123, 255, 0.55);
        }

        .expertise-card .icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .expertise-card h4 {
          color: #ffffff;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .expertise-card p {
          color: #a7b1cf;
          line-height: 1.6;
        }


        /* Experience Section */
        .experience-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .experience-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 2rem;
          transition: transform 0.3s ease, border-color 0.3s ease;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
        }

        .experience-card.highlight {
          border-color: rgba(90, 123, 255, 0.55);
          box-shadow: 0 24px 55px rgba(10, 12, 26, 0.45);
          background: rgba(90, 123, 255, 0.08);
        }

        .experience-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #8fc5ff;
          border: 1px solid rgba(90, 123, 255, 0.4);
          background: rgba(90, 123, 255, 0.12);
        }

        .experience-card:hover {
          transform: translateY(-5px);
          border-color: rgba(90, 123, 255, 0.55);
        }

        .experience-divider {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #9ea8c7;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .experience-divider::before,
        .experience-divider::after {
          content: "";
          height: 1px;
          flex: 1;
          background: rgba(255, 255, 255, 0.08);
        }

        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .experience-header h3 {
          color: #ffffff;
          font-size: 1.3rem;
        }

        .experience-location {
          color: #8fc5ff;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .experience-card p {
          color: #a7b1cf;
          line-height: 1.6;
        }

        .hackathon-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .hackathon-tag {
          background: rgba(90, 123, 255, 0.18);
          color: #8fc5ff;
          padding: 0.4rem 0.8rem;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 500;
          border: 1px solid rgba(90, 123, 255, 0.3);
        }

        /* Contact Section */
        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .contact-info h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .contact-info p {
          color: #a7b1cf;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .contact-details {
          display: grid;
          gap: 1.5rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1rem 1.2rem;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
        }

        .contact-item .icon {
          width: 50px;
          height: 50px;
          background: rgba(90, 123, 255, 0.18);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8fc5ff;
          font-size: 1.2rem;
        }

        .contact-item div h4 {
          color: #ffffff;
          margin-bottom: 0.2rem;
        }

        .contact-item div p {
          color: #a7b1cf;
          margin: 0;
        }

        .contact-form {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 22px 50px rgba(0, 0, 0, 0.35);
        }

        .contact-form h3 {
          color: #ffffff;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group label {
          display: block;
          color: #ffffff;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          background: rgba(6, 9, 16, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 1rem;
          color: #ffffff;
          font-size: 1rem;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: rgba(90, 123, 255, 0.6);
          box-shadow: 0 0 0 2px rgba(90, 123, 255, 0.18);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-status {
          margin-top: 0.75rem;
          font-size: 0.95rem;
          color: #a7b1cf;
        }

        .form-status.success {
          color: #8fc5ff;
        }

        .form-status.error {
          color: #ff7bc8;
        }

        /* Profile Presence */
        .presence-section {
          padding-top: 2rem;
        }

        .presence-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 560px));
          justify-content: center;
          align-items: center;
          gap: 1.75rem;
          max-width: 1160px;
          margin: 5rem auto;
        }

        .github-analytics-card,
        .linkedin-analytics-card {
          background:
            radial-gradient(420px 180px at 0% 0%, rgba(111, 232, 255, 0.1), transparent 65%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03));
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          width: min(100%, 560px);
          min-height: 520px;
          padding: 1.125rem;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          justify-self: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .github-analytics-card:hover,
        .linkedin-analytics-card:hover {
          transform: translateY(-6px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.14);
          box-shadow: 0 36px 96px rgba(0, 0, 0, 0.36);
        }

        .github-state-card {
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          border: 1px dashed rgba(255, 255, 255, 0.12);
          color: #b8c4e9;
          background: rgba(6, 9, 16, 0.34);
          text-align: center;
          padding: 1.5rem;
        }

        .github-state-card.error {
          border-color: rgba(255, 123, 200, 0.28);
          color: #ffd6ee;
        }

        .github-profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 0.85rem;
        }

        .github-profile-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .github-avatar {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
        }

        .github-kicker {
          color: #8fdcff;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 0.3rem;
        }

        .github-profile-meta h3 {
          font-size: 1.25rem;
          margin-bottom: 0.2rem;
          color: #ffffff;
        }

        .github-bio {
          color: #b8c4e9;
          max-width: 360px;
          font-size: 0.8125rem;
          opacity: 0.8;
          line-height: 1.5;
          white-space: pre-line;
        }

        .github-profile-links {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .github-profile-links a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.68rem 0.95rem;
          border-radius: 999px;
          color: #f6fbff;
          text-decoration: none;
          border: 1px solid rgba(143, 220, 255, 0.22);
          background: rgba(255, 255, 255, 0.04);
          font-size: 0.9rem;
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }

        .github-profile-links a:hover {
          transform: translateY(-2px);
          border-color: rgba(143, 220, 255, 0.4);
          background: rgba(143, 220, 255, 0.08);
        }

        .github-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .github-stat-card,
        .github-detail-item {
          background: rgba(8, 12, 22, 0.56);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 0.9rem;
        }

        .github-stat-card span,
        .github-detail-item span {
          display: block;
          color: #93a7d8;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.35rem;
        }

        .github-stat-card strong {
          font-size: 1.4rem;
          color: #ffffff;
          line-height: 1;
        }

        .github-details-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .github-detail-item strong {
          font-size: 0.95rem;
          color: #f5f7ff;
        }

        .github-contributions-wrap {
          margin-top: 0.95rem;
          padding-top: 0.95rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .github-contributions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.7rem;
        }

        .github-contributions-header h4 {
          font-size: 1.05rem;
          color: #ffffff;
        }

        .github-contributions-link {
          color: #8fdcff;
          text-decoration: none;
          font-size: 0.88rem;
        }

        .github-contributions-card {
          overflow: hidden;
          padding: 0.6rem;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(8, 12, 22, 0.62);
        }

        .github-contributions-image {
          display: block;
          width: 100%;
          height: auto;
          transform: scale(0.8);
          transform-origin: top left;
          width: 124%;
          max-width: none;
          margin-bottom: -1.8rem;
          filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.22));
        }

        .github-contribution-legend {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.6rem;
          margin-top: 0.55rem;
          color: #93a7d8;
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .github-legend-scale {
          display: inline-grid;
          grid-template-columns: repeat(5, 12px);
          gap: 4px;
        }

        .github-legend-scale span {
          width: 12px;
          height: 12px;
          border-radius: 3px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .github-legend-scale span:nth-child(1) {
          background: #161b22;
        }

        .github-legend-scale span:nth-child(2) {
          background: #0e4429;
        }

        .github-legend-scale span:nth-child(3) {
          background: #006d32;
        }

        .github-legend-scale span:nth-child(4) {
          background: #26a641;
        }

        .github-legend-scale span:nth-child(5) {
          background: #39d353;
        }

        /* LinkedIn Snapshot */
        .linkedin-analytics-section {
          padding-top: 0;
        }

        .linkedin-analytics-card {
          background:
            radial-gradient(420px 180px at 100% 0%, rgba(10, 102, 194, 0.22), transparent 65%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.03));
        }

        .linkedin-profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.1rem;
        }

        .linkedin-profile-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .linkedin-avatar {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
        }

        .linkedin-kicker {
          color: #70b7ff;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 0.45rem;
        }

        .linkedin-profile-meta h3 {
          font-size: 1.25rem;
          margin-bottom: 0.3rem;
          color: #ffffff;
        }

        .linkedin-headline {
          color: #d9e8ff;
          margin-bottom: 0.45rem;
          font-size: 0.8125rem;
          opacity: 0.8;
        }

        .linkedin-summary {
          color: #b8c4e9;
          max-width: 360px;
          font-size: 0.8125rem;
          opacity: 0.8;
          line-height: 1.5;
        }

        .linkedin-profile-links {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .linkedin-profile-links a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.68rem 0.95rem;
          border-radius: 999px;
          color: #f6fbff;
          text-decoration: none;
          border: 1px solid rgba(112, 183, 255, 0.28);
          background: rgba(10, 102, 194, 0.14);
          font-size: 0.9rem;
          transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
        }

        .linkedin-profile-links a:hover {
          transform: translateY(-2px);
          border-color: rgba(112, 183, 255, 0.45);
          background: rgba(10, 102, 194, 0.2);
        }

        .linkedin-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .linkedin-stat-card,
        .linkedin-detail-item {
          background: rgba(8, 12, 22, 0.56);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 1rem;
        }

        .linkedin-stat-card span,
        .linkedin-detail-item span {
          display: block;
          color: #9db8e9;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .linkedin-stat-card strong {
          display: block;
          font-size: 1.55rem;
          color: #ffffff;
          line-height: 1;
          margin-bottom: 0.55rem;
        }

        .linkedin-stat-card p,
        .linkedin-detail-item strong {
          color: #c5d4f2;
          font-size: 0.92rem;
          line-height: 1.45;
        }

        .linkedin-details-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
        }

        /* Footer */
        .footer {
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 3rem 2rem 2rem;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 3rem;
        }

        .footer-section h3 {
          color: #ffffff;
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .footer-section p {
          color: #a7b1cf;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .footer-links {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 0.5rem;
        }

        .footer-links button {
          background: none;
          border: none;
          color: #a7b1cf;
          text-decoration: none;
          transition: color 0.3s ease;
          cursor: pointer;
          font-size: 1rem;
        }

        .footer-links button:hover {
          color: #8fc5ff;
        }

        .footer-bottom {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #a7b1cf;
        }

        .footer-bottom .heart {
          color: #ff7bc8;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-content h1 {
            font-size: 2.5rem;
          }

          .skills-grid,
          .projects-grid {
            gap: 1.5rem;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .project-stage {
            margin-top: 1.5rem;
          }


          .about-content,
          .contact-content,
          .footer-content {
            grid-template-columns: 1fr;
          }

          .github-profile-header {
            flex-direction: column;
          }

          .github-profile-header,
          .github-profile-links,
          .linkedin-profile-header,
          .linkedin-profile-links {
            justify-content: flex-start;
          }

          .github-profile-meta,
          .linkedin-profile-meta {
            align-items: flex-start;
          }

          .github-stats-grid,
          .github-details-grid,
          .linkedin-stats-grid,
          .linkedin-details-grid {
            grid-template-columns: 1fr 1fr;
          }

          .presence-grid {
            grid-template-columns: 1fr;
            max-width: 560px;
          }

          .github-contributions-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .linkedin-profile-header {
            flex-direction: column;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .profile-image-container {
            width: 250px;
            height: 250px;
          }
          
          .profile-photo {
            width: 100%;
            height: 100%;
          }

          .github-analytics-card {
            padding: 1.35rem;
            border-radius: 22px;
          }

          .github-profile-meta,
          .linkedin-profile-meta {
            flex-direction: column;
          }

          .github-avatar,
          .linkedin-avatar {
            width: 72px;
            height: 72px;
          }

          .github-stats-grid,
          .github-details-grid,
          .linkedin-stats-grid,
          .linkedin-details-grid {
            grid-template-columns: 1fr;
          }


          .presence-section {
            padding-top: 1rem;
          }

          .github-contributions-card {
            padding: 0.85rem;
          }

          .linkedin-analytics-card {
            padding: 1.35rem;
            border-radius: 22px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section id="home" className="hero">
        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">Hitesh Surya Thejaswi M</div>
            <ul className="nav-links">
              <li>
                <button onClick={() => scrollToSection("home")} className={activeSection === "home" ? "active" : ""}>
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("about")} className={activeSection === "about" ? "active" : ""}>
                  About
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("skills")} className={activeSection === "skills" ? "active" : ""}>
                  Skills
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("experience")}
                  className={activeSection === "experience" ? "active" : ""}
                >
                  Experience
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("projects")}
                  className={activeSection === "projects" ? "active" : ""}
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className={activeSection === "contact" ? "active" : ""}
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </nav>
        <div className="hero-container">
          <div className="hero-content">
            <h1>
              Hi, I'm <span className="name">Hitesh Surya</span>
            </h1>
            <p className="hero-subtitle">Software Engineer | Full Stack | AI/ML | Data Scientist</p>
            <p className="hero-description">
              Software engineer building smart and scalable full-stack solutions that turn complex ideas into intuitive
              digital products.
            </p>
            <div className="hero-buttons">
              <button onClick={() => scrollToSection("contact")} className="btn-primary">
                Get In Touch 📧
              </button>
              <button onClick={downloadCV} className="btn-secondary">
                Download CV 📄
              </button>
            </div>
            <div className="social-links">
              <a href="https://github.com/hiteshsurya018-cmd" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/hitesh-surya-b1119a342" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="mailto:hiteshsurya018@gmail.com">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.749L12 10.724l9.615-6.903h.749c.904 0 1.636.732 1.636 1.636z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="profile-image-container">
              <img src="/chatgpt-image.png" alt="Hitesh Surya Thejaswi M" className="profile-photo" />
            </div>
          </div>
        </div>
        <button className="scroll-indicator" onClick={scrollToNextSection}>
          ↓
        </button>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <div className="container">
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">Technologies I work with to bring ideas to life</p>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Programming Languages</h3>
              <div className="skill-tags">
                <span className="skill-tag">JavaScript</span>
                <span className="skill-tag">Python</span>
                <span className="skill-tag">C</span>
              </div>
            </div>
            <div className="skill-category">
              <h3>Frontend Technologies</h3>
              <div className="skill-tags">
                <span className="skill-tag">React</span>
                <span className="skill-tag">HTML</span>
                <span className="skill-tag">CSS</span>
                <span className="skill-tag">Next.js</span>
                <span className="skill-tag">Three.js</span>
                <span className="skill-tag">VS Code</span>
              </div>
            </div>
            <div className="skill-category">
              <h3>Backend Technologies</h3>
              <div className="skill-tags">
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">Express.js</span>
                <span className="skill-tag">MongoDB</span>
              </div>
            </div>
            <div className="skill-category">
              <h3>AI/ML</h3>
              <div className="skill-tags">
                <span className="skill-tag">YOLOv5</span>
                <span className="skill-tag">NLP</span>
                <span className="skill-tag">Machine Learning</span>
                <span className="skill-tag">Computer Vision</span>
              </div>
            </div>
            <div className="skill-category">
              <h3>Tools</h3>
              <div className="skill-tags">
                <span className="skill-tag">Git</span>
                <span className="skill-tag">GitHub</span>
                <span className="skill-tag">VS Code</span>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Projects Section */}
      <section id="projects" className="section">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">A showcase of my recent work and personal projects</p>
          <div className="projects-grid">
            <div className="projects-list">
              <button
                className={`project-item${selectedProject === "garden" ? " active" : ""}`}
                onClick={() => setSelectedProject("garden")}
              >
                3D Virtual Garden Builder
              </button>
              <button
                className={`project-item${selectedProject === "chatbot" ? " active" : ""}`}
                onClick={() => setSelectedProject("chatbot")}
              >
                AI Medical Chatbot
              </button>
              <button
                className={`project-item${selectedProject === "exchange" ? " active" : ""}`}
                onClick={() => setSelectedProject("exchange")}
              >
                Exchange Rate Predictor
              </button>
            </div>

            <div className={`project-stage${selectedProject ? " active" : ""}`}>
              {selectedProject === "garden" && (
                <div className="project-card" id="garden-card">
                  <div className="project-image">
                    <video
                      id="garden-video"
                      className="project-video"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      crossOrigin="anonymous"
                      suppressHydrationWarning
                    >
                      <source src="/VG Video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div id="garden-emoji" className="project-emoji">GDN</div>
                  </div>
                  <div className="project-content">
                    <h3>3D Virtual Garden Builder</h3>
                    <div className="project-details">
                      <p>
                        Developed a 3D virtual garden builder enabling users to upload real garden images, detect medicinal
                        plants with 95%+ accuracy using YOLOv5, and visualize them in an interactive React + Three.js
                        environment. Enhanced plant detection with AI-powered medicinal insights.
                      </p>
                      <div className="project-tech">
                        <span className="tech-tag">React</span>
                        <span className="tech-tag">Three.js</span>
                        <span className="tech-tag">YOLOv5</span>
                        <span className="tech-tag">Node.js</span>
                        <span className="tech-tag">MongoDB</span>
                      </div>
                      <div className="project-links">
                        <button>Live Demo</button>
                        <button>Code</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedProject === "chatbot" && (
                <div className="project-card">
                  <div className="project-image">AI</div>
                  <div className="project-content">
                    <h3>AI Medical Chatbot</h3>
                    <div className="project-details">
                      <p>
                        Created an offline-friendly NLP chatbot trained on a 5,000+ entry medical dataset, delivering 90%+
                        intent classification accuracy for symptom-based advice without third-party APIs. Demonstrated
                        practical AI deployment skills.
                      </p>
                      <div className="project-tech">
                        <span className="tech-tag">Python</span>
                        <span className="tech-tag">NLP</span>
                        <span className="tech-tag">Machine Learning</span>
                        <span className="tech-tag">Medical Dataset</span>
                      </div>
                      <div className="project-links">
                        <button>Live Demo</button>
                        <button>Code</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedProject === "exchange" && (
                <div className="project-card" id="exchange-card">
                  <div className="project-image">
                    <video
                      id="exchange-video"
                      className="project-video"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      crossOrigin="anonymous"
                      suppressHydrationWarning
                    >
                      <source src="/Exchange rate predictor.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div id="exchange-emoji" className="project-emoji">FX</div>
                  </div>
                  <div className="project-content">
                    <h3>Exchange Rate Predictor</h3>
                    <div className="project-details">
                      <p>
                        Built a currency intelligence platform that unifies real-time FX ingestion, normalization,
                        visualization, and forecasting. Implemented ARIMA and LSTM models for interpretable, comparable
                        short-term predictions alongside historical trends, plus live conversion, multi-currency
                        comparison, OCR receipt extraction, and expense summaries.
                      </p>
                      <div className="project-tech">
                        <span className="tech-tag">Next.js</span>
                        <span className="tech-tag">React</span>
                        <span className="tech-tag">TypeScript</span>
                        <span className="tech-tag">Tailwind CSS</span>
                        <span className="tech-tag">Recharts</span>
                        <span className="tech-tag">Tesseract.js</span>
                        <span className="tech-tag">TensorFlow.js</span>
                        <span className="tech-tag">Frankfurter API</span>
                        <span className="tech-tag">ipapi.co</span>
                      </div>
                      <div className="project-links">
                        <a
                          href="https://currency-exchange-rate-predictor-hitesh-surya.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live Demo
                        </a>
                        <a
                          href="https://github.com/hiteshsurya018-cmd/Currency-Converter-with-exchange-rate-predictor"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Code
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            Aspiring full stack developer with a strong interest in AI/ML, robotics, and UI/UX — always eager to learn,
            build, and innovate.
          </p>
          <div className="about-content">
            <div className="about-text">
              <p>
                Hi, I'm <strong>Hitesh Surya Thejaswi M</strong>, an undergraduate student pursuing a Bachelor's degree
                in Information Science and Engineering (ISE) at{" "}
                <strong>Maharaja Institute of Technology, Mysuru</strong>.
              </p>

              <p>
                I'm passionate about crafting dynamic web applications, exploring the world of artificial intelligence
                and machine learning, diving into robotics, and designing intuitive user interfaces. I believe in the
                power of technology to drive meaningful change and am constantly seeking opportunities to grow as a
                developer and problem solver.
              </p>

              <div className="about-info">
                <div className="info-item">
                  <h4>Schooling</h4>
                  <p>DAV Public School, Mysore - 72%</p>
                </div>
                <div className="info-item">
                  <h4>PUC</h4>
                  <p>Sharadha Vidya Mandir, Mysore - 78%</p>
                </div>
                <div className="info-item">
                  <h4>Graduation</h4>
                  <p>MIT Mysore - CGPA 8.0 (Expected)</p>
                </div>
                <div className="info-item">
                  <h4>Languages</h4>
                  <p>Kannada, English, Hindi, German (Learning)</p>
                </div>
              </div>
            </div>
            <div className="expertise-cards">
              <div className="expertise-card">
                <div className="icon">💻</div>
                <h4>Full Stack Development</h4>
                <p>Building robust, scalable applications using modern technologies across the frontend and backend.</p>
              </div>
              <div className="expertise-card">
                <div className="icon">🎨</div>
                <h4>UI/UX Design</h4>
                <p>
                  Creating visually appealing and user-friendly designs that enhance the overall digital experience.
                </p>
              </div>
              <div className="expertise-card">
                <div className="icon">⚡</div>
                <h4>AI/ML & Robotics</h4>
                <p>
                  Exploring artificial intelligence, machine learning algorithms, and robotics to create intelligent
                  solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section">
        <div className="container">
          <h2 className="section-title">Experience & Activities</h2>
          <p className="section-subtitle">Workshops, hackathons, and learning experiences</p>
          <div className="experience-grid">
            <div className="experience-card highlight">
              <div className="experience-header">
                <h3>Global Quest Technilogies</h3>
                <span className="experience-location">
                  Data Science / Gen AI Intern · <span className="experience-badge">Currently</span>
                </span>
              </div>
              <p>
                Contributed to applied data science and generative AI projects, focusing on data preparation, model
                experimentation, and practical deployment workflows.
              </p>
            </div>

            <div className="experience-card highlight">
              <div className="experience-header">
                <h3>Inventeron</h3>
                <span className="experience-location">
                  AIML Data Analyst Intern · <span className="experience-badge">Currently</span>
                </span>
              </div>
              <p>
                Worked on AI/ML data analysis tasks, supporting model insights, reporting, and data-driven decision
                making.
              </p>
            </div>

            <div className="experience-divider" aria-hidden="true"></div>

            <div className="experience-card">
              <div className="experience-header">
                <h3>Generative AI Workshop</h3>
                <span className="experience-location">IIT Hyderabad</span>
              </div>
              <p>
                Attended a 2-day intensive workshop focused on cutting-edge generative AI concepts, including prompt
                engineering, LLMs, and practical applications using tools like ChatGPT and image generation models.
              </p>
            </div>

            <div className="experience-card">
              <div className="experience-header">
                <h3>Hackathons Coordinated</h3>
                <span className="experience-location">Organizer</span>
              </div>
              <div className="hackathon-list">
                <span className="hackathon-tag">Hackfinity</span>
                <span className="hackathon-tag">Hackverse</span>
              </div>
            </div>

            <div className="experience-card">
              <div className="experience-header">
                <h3>Hackathons Participated</h3>
                <span className="experience-location">Various</span>
              </div>
              <div className="hackathon-list">
                <span className="hackathon-tag">Hack 4 Mysore</span>
                <span className="hackathon-tag">Invaders</span>
                <span className="hackathon-tag">Prahyatha'24</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <h2 className="section-title">Get In Touch !</h2>
          <p className="section-subtitle">I'm always interested in hearing about new projects and opportunities.</p>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Let's talk about your project</h3>
              <p>
                I'm always interested in new opportunities and exciting projects. Whether you have a question or just
                want to say hi, feel free to reach out!
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="icon">📧</div>
                  <div>
                    <h4>Email</h4>
                    <p>hiteshsurya018@gmail.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="icon">📱</div>
                  <div>
                    <h4>Phone</h4>
                    <p>+91 9353134049</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="icon">📍</div>
                  <div>
                    <h4>Location</h4>
                    <p>Karnataka, In</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <h3>Send me a message</h3>
              {!emailjsConfigured && (
                <p className="form-status error">
                  Email service not configured. Check your .env.local and restart the server.
                </p>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Project inquiry"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={submitState.status === "sending"}>
                  {submitState.status === "sending" ? "Sending..." : "Send Message"}
                </button>
                {submitState.status !== "idle" && (
                  <p
                    className={`form-status ${
                      submitState.status === "sent"
                        ? "success"
                        : submitState.status === "error"
                        ? "error"
                        : ""
                    }`}
                  >
                    {submitState.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section id="presence" className="section presence-section">
        <div className="container">
          <div className="presence-grid">
            <div className="github-analytics-card">
              {githubStatus === "loading" && (
                <div className="github-state-card">
                  <p>Loading GitHub analytics...</p>
                </div>
              )}

              {githubStatus === "error" && (
                <div className="github-state-card error">
                  <p>GitHub analytics are temporarily unavailable. Please try again in a moment.</p>
                </div>
              )}

              {githubStatus === "ready" && githubProfile && (
                <>
                  <div className="github-profile-header">
                    <div className="github-profile-meta">
                      <div>
                        <p className="github-kicker">GitHub</p>
                        <h3>{githubProfile.login}</h3>
                        <p className="github-bio">{githubProfile.bio || "Building full-stack and AI-driven products."}</p>
                      </div>
                    </div>
                    <div className="github-profile-links">
                      <a href={githubProfile.html_url} target="_blank" rel="noopener noreferrer">
                        View GitHub
                      </a>
                    </div>
                  </div>

                  <div className="github-stats-grid">
                    <div className="github-stat-card">
                      <span>Public Repos</span>
                      <strong>{githubProfile.public_repos}</strong>
                    </div>
                    <div className="github-stat-card">
                      <span>Followers</span>
                      <strong>{githubProfile.followers}</strong>
                    </div>
                    <div className="github-stat-card">
                      <span>Following</span>
                      <strong>{githubProfile.following}</strong>
                    </div>
                    <div className="github-stat-card">
                      <span>Public Gists</span>
                      <strong>{githubProfile.public_gists}</strong>
                    </div>
                  </div>

                  <div className="github-details-grid">
                    <div className="github-detail-item">
                      <span>Location</span>
                      <strong>{githubProfile.location || "Not specified"}</strong>
                    </div>
                    <div className="github-detail-item">
                      <span>Joined GitHub</span>
                      <strong>{formatGithubDate(githubProfile.created_at)}</strong>
                    </div>
                    <div className="github-detail-item">
                      <span>Last Updated</span>
                      <strong>{formatGithubDate(githubProfile.updated_at)}</strong>
                    </div>
                  </div>

                  <div className="github-contributions-wrap">
                    <div className="github-contributions-header">
                      <div>
                        <p className="github-kicker">Contribution Activity</p>
                        <h4>Past 12 months</h4>
                      </div>
                      <a
                        href={githubProfile.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-contributions-link"
                      >
                        Open on GitHub
                      </a>
                    </div>

                    <div className="github-contributions-card">
                      <img
                        className="github-contributions-image"
                        src={`https://ghchart.rshah.org/409ba5/${githubProfile.login}`}
                        alt={`${githubProfile.login} contribution chart`}
                        loading="lazy"
                      />
                    </div>

                    <div className="github-contribution-legend">
                      <span>Less</span>
                      <div className="github-legend-scale" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="linkedin-analytics-card">
              <div className="linkedin-profile-header">
                <div className="linkedin-profile-meta">
                  <div>
                    <p className="linkedin-kicker">LinkedIn</p>
                    <h3>{linkedInProfile.name}</h3>
                    <p className="linkedin-headline">{linkedInProfile.headline}</p>
                    <p className="linkedin-summary">{linkedInProfile.summary}</p>
                  </div>
                </div>

                <div className="linkedin-profile-links">
                  <a href={linkedInProfile.url} target="_blank" rel="noopener noreferrer">
                    View LinkedIn
                  </a>
                </div>
              </div>

              <div className="linkedin-stats-grid">
                {linkedInProfile.analytics.map((item) => (
                  <div key={item.label} className="linkedin-stat-card">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <p>{item.detail}</p>
                  </div>
                ))}
              </div>

              <div className="linkedin-details-grid">
                {linkedInProfile.highlights.map((item) => (
                  <div key={item.label} className="linkedin-detail-item">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Hitesh Surya</h3>
            <p>Full Stack Developer passionate about creating exceptional digital experiences.</p>
            <div className="social-links">
              <a href="https://github.com/hiteshsurya018-cmd" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.23
4c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839
1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931
0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404
1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235
3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086
8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/hitesh-surya-b1119a342" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a href="mailto:hiteshsurya018@gmail.com">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.749L12 10.724l9.615-6.903h.749c.904 0 1.636.732 1.636 1.636z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            Made with <span className="heart">❤️</span> by Hitesh Surya
          </p>
        </div>
      </footer>
      <AssistantContainer activeSection={activeSection} onNavigate={scrollToSection} />
    </div>
  )
}
