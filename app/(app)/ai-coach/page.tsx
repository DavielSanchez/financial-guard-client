"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faRobot,
  faPaperPlane,
  faLightbulb,
  faChartLine,
  faGamepad,
  faCreditCard,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons"
import { useI18n } from "@/hooks/use-translations"
import { GlassCard } from "@/components/glass-card"

type Message = {
  id: number
  role: "user" | "ai"
  text: string
}

const actionChips = [
  { key: "affordPS5" as const, icon: faGamepad, color: "#FF007F" },
  { key: "analyzeSubscriptions" as const, icon: faCreditCard, color: "#00D4FF" },
  { key: "savingsForecast" as const, icon: faChartLine, color: "#00FF94" },
  { key: "spendingTips" as const, icon: faLightbulb, color: "#8F00FF" },
]

export default function AiCoachPage() {
  const { t } = useI18n()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      text: t('aiCoach.greeting' as any),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getResponseForKey = (key: string) => {
    const responseKey = `aiCoach.responses.${key}` as const
    const response = t(responseKey as any)
    return response !== responseKey ? response : null
  }

  const sendMessage = (text: string, responseKey?: string) => {
    if (!text.trim()) return
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: text.trim(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiText =
        (responseKey && getResponseForKey(responseKey)) ||
        `I have analyzed your financial data regarding "${text}". Based on your current spending patterns and income trajectory, I would recommend reviewing your budget allocations and considering automated savings rules. Would you like me to create a detailed action plan?`
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: aiText,
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-2xl flex-col px-4 pt-6 lg:px-0">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        {/* Pulsing Orb */}
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(143,0,255,0.3), rgba(0,212,255,0.1))",
            animation: "orb-pulse 3s ease-in-out infinite",
          }}
        >
          <FontAwesomeIcon
            icon={faWandMagicSparkles}
            className="glow-purple text-lg text-neon-purple"
          />
        </motion.div>
        <div>
          <h1 className="font-serif text-lg font-bold tracking-wider text-foreground">
            {t('aiCoach.title' as any).toUpperCase()}
          </h1>
          <p className="text-[10px] text-neon-green">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-neon-green mr-1 animate-pulse" />
            {t('aiCoach.status.online' as any)} · {t('aiCoach.status.analyzing' as any)}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-3 pb-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-neon-purple/20 text-foreground backdrop-blur-xl"
                      : "glass text-foreground"
                  }`}
                  style={
                    msg.role === "ai"
                      ? {
                          borderColor: "rgba(143,0,255,0.15)",
                        }
                      : {}
                  }
                >
                  {msg.role === "ai" && (
                    <FontAwesomeIcon
                      icon={faRobot}
                      className="glow-purple mb-1 mr-2 inline text-[10px] text-neon-purple"
                    />
                  )}
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass flex items-center gap-1.5 rounded-2xl px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-neon-purple"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Action Chips */}
      {messages.length <= 2 && (
        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
          {actionChips.map((chip) => (
            <motion.button
              key={chip.label}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage(chip.label)}
              className="glass flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs text-foreground transition-colors hover:bg-white/10"
            >
              <FontAwesomeIcon
                icon={chip.icon}
                className="text-[10px]"
                style={{
                  color: chip.color,
                  filter: `drop-shadow(0 0 6px ${chip.color})`,
                }}
              />
              <span className="whitespace-nowrap">{chip.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass mb-2 flex items-center gap-2 rounded-2xl p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input, undefined)}
          placeholder={t('aiCoach.placeholder' as any)}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder-muted-foreground/50"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => sendMessage(input, undefined)}
          disabled={!input.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon-purple text-white disabled:opacity-30"
        >
          <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
        </motion.button>
      </div>
    </div>
  )
}
