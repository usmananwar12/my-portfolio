"use client"

import { useState, useEffect, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, ExternalLink, Code, Cpu, Database, Globe, ChevronDown, Send, User, MessageSquare } from "lucide-react"
import emailjs from '@emailjs/browser'
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion"

interface CardData {
    id: number;
    img: string;
}

interface CardRotateProps {
    children: ReactNode;
    onSendToBack: () => void;
    sensitivity: number;
}

interface StackProps {
    randomRotation?: boolean;
    sensitivity?: number;
    cardDimensions?: { width: number; height: number };
    cardsData?: CardData[];
    animationConfig?: { stiffness: number; damping: number };
    sendToBackOnClick?: boolean;
}

function CardRotate({ children, onSendToBack, sensitivity }: CardRotateProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [60, -60]);
    const rotateY = useTransform(x, [-100, 100], [-60, 60]);

    function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
        if (
            Math.abs(info.offset.x) > sensitivity ||
            Math.abs(info.offset.y) > sensitivity
        ) {
            onSendToBack();
        } else {
            x.set(0);
            y.set(0);
        }
    }

    return (
        <motion.div
            className="absolute cursor-grab"
            style={{ x, y, rotateX, rotateY }}
            drag
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            dragElastic={0.6}
            whileTap={{ cursor: "grabbing" }}
            onDragEnd={handleDragEnd}
        >
            {children}
        </motion.div>
    );
}

function Stack({
    randomRotation = false,
    sensitivity = 200,
    cardDimensions = { width: 208, height: 208 },
    cardsData = [],
    animationConfig = { stiffness: 260, damping: 20 },
    sendToBackOnClick = false
}: StackProps) {
    const [cards, setCards] = useState<CardData[]>(
        cardsData.length
            ? cardsData
            : [
                { id: 1, img: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
                { id: 2, img: "https://images.unsplash.com/photo-1536148935331-408321065b18?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
                { id: 3, img: "https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
                { id: 4, img: "https://images.unsplash.com/photo-1503252947848-7338d3f92f31?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
            ]
    );

    const [randomRotations, setRandomRotations] = useState<number[]>([]);

    useEffect(() => {
        if (randomRotation) {
            setRandomRotations(cards.map(() => Math.random() * 10 - 5));
        }
    }, [randomRotation, cards.length]);

    const sendToBack = (id: number) => {
        setCards((prev) => {
            const newCards = [...prev];
            const index = newCards.findIndex((card) => card.id === id);
            const [card] = newCards.splice(index, 1);
            newCards.unshift(card);
            return newCards;
        });
    };

    return (
        <div
            className="relative"
            style={{
                width: cardDimensions.width,
                height: cardDimensions.height,
                perspective: 600,
            }}
        >
            {cards.map((card, index) => {
                const randomRotate = randomRotation && randomRotations[index] ? randomRotations[index] : 0;

                return (
                    <CardRotate
                        key={card.id}
                        onSendToBack={() => sendToBack(card.id)}
                        sensitivity={sensitivity}
                    >
                        <motion.div
                            className="rounded-2xl overflow-hidden border-4 border-white"
                            onClick={() => sendToBackOnClick && sendToBack(card.id)}
                            animate={{
                                rotateZ: (cards.length - index - 1) * 4 + randomRotate,
                                scale: 1 + index * 0.06 - cards.length * 0.06,
                                transformOrigin: "90% 90%",
                            }}
                            initial={false}
                            transition={{
                                type: "spring",
                                stiffness: animationConfig.stiffness,
                                damping: animationConfig.damping,
                            }}
                            style={{
                                width: cardDimensions.width,
                                height: cardDimensions.height,
                            }}
                        >
                            <img
                                src={card.img}
                                alt={`card-${card.id}`}
                                className="w-full h-full object-cover pointer-events-none"
                            />
                        </motion.div>
                    </CardRotate>
                );
            })}
        </div>
    );
}

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [particles, setParticles] = useState<Array<{
    left: string
    top: string
    animationDelay: string
    animationDuration: string
  }>>([])
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    setIsVisible(true)

    // Generate particles only on client side
    const generatedParticles = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    }))
    setParticles(generatedParticles)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const skills = [
    { name: "HTML & CSS", icon: Code, color: "from-orange-400 to-red-500" },
    { name: "Bootstrap/Tailwind", icon: Code, color: "from-blue-400 to-purple-500" },
    { name: "JavaScript", icon: Code, color: "from-yellow-400 to-orange-500" },
    { name: "C++", icon: Cpu, color: "from-blue-500 to-indigo-600" },
    { name: "Python", icon: Code, color: "from-green-400 to-blue-500" },
    { name: "React.js", icon: Code, color: "from-cyan-400 to-blue-500" },
    { name: "Next.js", icon: Globe, color: "from-gray-700 to-gray-900" },
    { name: "Node.js", icon: Database, color: "from-green-500 to-emerald-600" },
  ]

  const projects = [
    {
      title: "Al Zahid Madni",
      description: "Professional travel agency website with comprehensive travel services, booking system, and destination information.",
      url: "alzahidmadni.com",
      tech: ["Next.js", "Tailwind CSS", "React"],
      gradient: "from-blue-500 to-purple-600",
    },
    {
      title: "The Educators Aziz Campus",
      description: "Official website for one of Pakistan's most popular schools, featuring comprehensive information about academics, faculty, and campus life.",
      url: "the-educators.vercel.app",
      tech: ["Next.js", "React", "Tailwind CSS"],
      gradient: "from-green-500 to-teal-600",
    },
    {
      title: "ZExporters",
      description: "Professional website for potato cold storage facility with business management features.",
      url: "zexporters.com",
      tech: ["React", "Node.js", "CSS"],
      gradient: "from-orange-500 to-red-600",
    },
  ]

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await emailjs.send(
        'service_gssm733',
        'template_fvm5v8i',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: 'Usman Anwar'
        },
        '5pC9DSQ-9Rs0pl0Nx'
      )
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('EmailJS Error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20" />

        {/* Floating Particles */}
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          />
        ))}

        {/* Moving Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-bounce"
          style={{ animationDuration: "6s" }}
        />

        {/* Mouse Follower */}
        <div
          className="absolute w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-sm opacity-50 pointer-events-none transition-all duration-100 ease-out"
          style={{
            left: mousePosition.x - 12,
            top: mousePosition.y - 12,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div
            className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Left Side - Text Content */}
            <div className="text-left">
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                  Usman Anwar
                </h1>
                <div className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
                  <span className="inline-block animate-shine">
                    Web Developer
                  </span>
                </div>
              </div>

              <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
                Crafting digital experiences with modern technologies. Passionate about creating innovative web solutions
                that make a difference.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 md:mr-8">
                <Button
                  onClick={() => scrollToSection("projects")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  View My Work
                </Button>
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 bg-transparent"
                >
                  Get In Touch
                </Button>
              </div>

              <div onClick={() => scrollToSection("skills")} className="cursor-pointer animate-bounce inline-block">
                <ChevronDown className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            {/* Right Side - Interactive Image Stack */}
            <div className="flex justify-center md:justify-end">
                <div className="relative md:mr-16">
                <Stack 
                  cardDimensions={{ width: 320, height: 320 }}
                  sensitivity={150}
                  randomRotation={true}
                  sendToBackOnClick={true}
                />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="text-sm text-gray-400 mb-2">Try dragging the cards!</p>
                  <p className="text-xs text-gray-500">Interactive 3D card stack</p>
                </div>
                </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Technical Skills
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <Card
                  key={skill.name}
                  className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${skill.color} flex items-center justify-center group-hover:animate-spin transition-all duration-300`}
                    >
                      <skill.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                      {skill.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Featured Projects
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <a
                  key={project.title}
                  href={`https://${project.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group overflow-hidden cursor-pointer">
                    <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <ExternalLink className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                      </div>

                      <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((tech) => (
                          <Badge
                            key={tech}
                            className="bg-white/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors duration-300"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-sm text-gray-400 font-mono">{project.url}</div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Let's Connect
              </h2>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Ready to bring your ideas to life? Let's discuss your next project and create something amazing together.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold mb-6 text-white">Send me a message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your Email"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300"
                      />
                    </div>

                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Your Message"
                        required
                        rows={5}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </Button>

                    {submitStatus === 'success' && (
                      <div className="text-green-400 text-center py-2 bg-green-500/10 rounded-lg">
                        Message sent successfully! I'll get back to you soon.
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="text-red-400 text-center py-2 bg-red-500/10 rounded-lg">
                        Failed to send message. Please try again.
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-white">Get in touch</h3>
                  <p className="text-gray-300 mb-8">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                  </p>
                </div>

                <div className="space-y-6">
                  <a
                    href="mailto:usmananwar9957@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Email</h4>
                      <p className="text-gray-400">usmananwar9957@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://github.com/usmananwar12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Github className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">GitHub</h4>
                      <p className="text-gray-400">github.com/usmananwar12</p>
                    </div>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/musman-anwar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">LinkedIn</h4>
                      <p className="text-gray-400">linkedin.com/in/musman-anwar</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400">© 2025 Usman Anwar. Crafted with passion and modern web technologies.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
