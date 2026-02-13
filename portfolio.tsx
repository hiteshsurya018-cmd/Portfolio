"use client"

import type React from "react"

import { useState, useEffect } from "react"

export default function Portfolio() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [activeSection, setActiveSection] = useState("home")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all fields")
      return
    }
    alert("Thank you for your message! I'll get back to you soon.")
    setFormData({ name: "", email: "", subject: "", message: "" })
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

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      let currentSection = ''

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
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
    const timer = setTimeout(() => {
      const setupHoverVideo = (cardId: string, videoId: string, emojiId: string) => {
        const card = document.getElementById(cardId)
        const video = document.getElementById(videoId) as HTMLVideoElement | null
        const emoji = document.getElementById(emojiId)

        if (!card || !video || !emoji) {
          return () => {}
        }

        const handleMouseEnter = () => {
          emoji.style.opacity = '0'
          video.style.opacity = '1'
          video.muted = false
          video.controls = true
          video.currentTime = 0
          const playPromise = video.play()
          if (playPromise !== undefined) {
            playPromise.catch(() => {})
          }
        }

        const handleMouseLeave = () => {
          video.pause()
          video.currentTime = 0
          video.muted = true
          video.controls = false
          emoji.style.opacity = '1'
          video.style.opacity = '0'
        }

        card.addEventListener('mouseenter', handleMouseEnter)
        card.addEventListener('mouseleave', handleMouseLeave)

        return () => {
          card.removeEventListener('mouseenter', handleMouseEnter)
          card.removeEventListener('mouseleave', handleMouseLeave)
        }
      }

      const cleanupGarden = setupHoverVideo('garden-card', 'garden-video', 'garden-emoji')
      const cleanupExchange = setupHoverVideo('exchange-card', 'exchange-video', 'exchange-emoji')

      return () => {
        cleanupGarden()
        cleanupExchange()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const downloadCV = () => {
    const link = document.createElement("a")
    link.href = "/Hitesh_Surya_CV.pdf"
    link.download = "Hitesh_Surya_CV.pdf"
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #0a0e1a;
          color: #ffffff;
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* Navigation */
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(10, 14, 26, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 1000;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .navbar.scrolled {
          background: rgba(10, 14, 26, 0.95);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
          align-items: center;
        }

        .nav-links button {
          background: none;
          border: none;
          color: #ffffff;
          text-decoration: none;
          transition: color 0.3s ease;
          font-weight: 500;
          cursor: pointer;
          font-size: 1rem;
        }

        .nav-links button:hover {
          color: #667eea;
        }

        .nav-links button.active {
          color: #667eea;
          position: relative;
        }

        .nav-links button.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background: #667eea;
          border-radius: 50%;
        }

        .theme-toggle {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }

        .theme-toggle:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 0 2rem;
          margin-top: 80px;
          position: relative;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .hero-content .name {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: #a0a9c0;
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .hero-description {
          font-size: 1.1rem;
          color: #8892b0;
          margin-bottom: 3rem;
          line-height: 1.8;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
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
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: transparent;
          color: #ffffff;
          padding: 1rem 2rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
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
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .hero-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .profile-image-container {
          width: 300px;
          height: 300px;
          border: 3px solid #667eea;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(102, 126, 234, 0.1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }

        .profile-image-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent, #667eea, transparent);
          animation: rotate 4s linear infinite;
          z-index: 1;
        }

        .profile-image-container::after {
          content: '';
          position: absolute;
          inset: 3px;
          background: #0a0e1a;
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
          color: #8892b0;
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
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-links a:hover {
          color: #667eea;
          transform: translateY(-2px);
          background: rgba(102, 126, 234, 0.1);
          border-color: #667eea;
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
          color: #8892b0;
          font-size: 1.5rem;
          animation: bounce 2s infinite;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .scroll-indicator:hover {
          color: #667eea;
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
          padding: 6rem 2rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          color: #8892b0;
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
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .skill-category:hover {
          transform: translateY(-5px);
          border-color: #667eea;
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
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          border: 1px solid rgba(102, 126, 234, 0.3);
        }

        /* Projects Section */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
        }

        .project-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .project-card:hover {
          transform: translateY(-5px);
          border-color: #667eea;
        }

        .project-image {
          height: 300px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8892b0;
          font-size: 3rem;
          position: relative;
          overflow: hidden;
          border-radius: 12px 12px 0 0;
          background-color: #0a0e1a;
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
          padding: 1.9rem;
        }

        .project-content h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .project-content p {
          color: #8892b0;
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
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
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
          color: #667eea;
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
          color: #8892b0;
        }

        .about-text strong {
          color: #667eea;
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
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .expertise-card:hover {
          transform: translateX(10px);
          border-color: #667eea;
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
          color: #8892b0;
          line-height: 1.6;
        }


        /* Experience Section */
        .experience-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .experience-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .experience-card:hover {
          transform: translateY(-5px);
          border-color: #667eea;
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
          color: #667eea;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .experience-card p {
          color: #8892b0;
          line-height: 1.6;
        }

        .hackathon-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .hackathon-tag {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          padding: 0.4rem 0.8rem;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 500;
          border: 1px solid rgba(102, 126, 234, 0.3);
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
          color: #8892b0;
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
        }

        .contact-item .icon {
          width: 50px;
          height: 50px;
          background: rgba(102, 126, 234, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #667eea;
          font-size: 1.2rem;
        }

        .contact-item div h4 {
          color: #ffffff;
          margin-bottom: 0.2rem;
        }

        .contact-item div p {
          color: #8892b0;
          margin: 0;
        }

        .contact-form {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
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
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 1rem;
          color: #ffffff;
          font-size: 1rem;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        /* Footer */
        .footer {
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
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
          color: #8892b0;
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
          color: #8892b0;
          text-decoration: none;
          transition: color 0.3s ease;
          cursor: pointer;
          font-size: 1rem;
        }

        .footer-links button:hover {
          color: #667eea;
        }

        .footer-bottom {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: #8892b0;
        }

        .footer-bottom .heart {
          color: #ff6b6b;
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
            grid-template-columns: 1fr;
          }

          .about-content,
          .contact-content,
          .footer-content {
            grid-template-columns: 1fr;
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
        }
      `}</style>

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
            <li>
              <button className="theme-toggle">🌙</button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>
              Hi, I'm <span className="name">Hitesh Surya</span>
            </h1>
            <p className="hero-subtitle">Software Engineer | Full Stack | AI/ML | Computer Vision</p>
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
              <img src="/hitesh-profile.jpg" alt="Hitesh Surya Thejaswi M" className="profile-photo" />
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
            <div className="project-card" id="garden-card">
              <div className="project-image">
                <video
                  id="garden-video"
                  className="project-video"
                  muted
                  loop
                  preload="metadata"
                  crossOrigin="anonymous"
                  suppressHydrationWarning
                >
                  <source
                    src="/garden-video.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div id="garden-emoji" className="project-emoji">🌱</div>
              </div>
              <div className="project-content">
                <h3>3D Virtual Garden Builder</h3>
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
                  <button>🔗 Live Demo</button>
                  <button>💻 Code</button>
                </div>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">🤖</div>
              <div className="project-content">
                <h3>AI Medical Chatbot</h3>
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
                  <button>🔗 Live Demo</button>
                  <button>💻 Code</button>
                </div>
              </div>
            </div>
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
                  <source
                    src="/Exchange rate predictor.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <div id="exchange-emoji" className="project-emoji">💱</div>
              </div>
              <div className="project-content">
                <h3>Exchange Rate Predictor</h3>
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
                    🔗 Live Demo
                  </a>
                  <a
                    href="https://github.com/hiteshsurya018-cmd/Currency-Converter-with-exchange-rate-predictor"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💻 Code
                  </a>
                </div>
              </div>
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
                <h3>Hackathons Participated</h3>
                <span className="experience-location">Various</span>
              </div>
              <div className="hackathon-list">
                <span className="hackathon-tag">Hack 4 Mysore</span>
                <span className="hackathon-tag">Invaders</span>
                <span className="hackathon-tag">Prahyatha'24</span>
              </div>
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
                <button type="submit" className="btn-primary">
                  Send Message ✈️
                </button>
              </form>
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
    </div>
  )
}
