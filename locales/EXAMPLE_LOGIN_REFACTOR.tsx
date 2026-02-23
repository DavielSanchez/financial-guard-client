// /**
//  * Example: Refactored Login Page with Type-Safe i18n
//  * 
//  * This demonstrates how to replace hardcoded strings with the new dictionary system.
//  * Copy this pattern to migrate other components.
//  */

// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import Link from "next/link"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faShieldHalved,
//   faEnvelope,
//   faLock,
//   faArrowRight,
//   faFingerprint,
//   faUserPlus,
// } from "@fortawesome/free-solid-svg-icons"
// import { useAuth } from "@/hooks/use-auth"
// import { useI18n } from "@/hooks/use-translations"
// import { GlassCard } from "@/components/glass-card"

// export default function LoginPageRefactored() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [errorMessage, setErrorMessage] = useState("")
  
//   const { login } = useAuth()
//   const { t } = useI18n() // ✨ Type-safe translations

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setErrorMessage("")
    
//     try {
//       await login({ email, password })
//     } catch (error: any) {
//       console.error("Login error:", error)
//       const message = error.response?.data?.error || "An error occurred"
      
//       setErrorMessage(
//         Array.isArray(message) ? message[0] : message
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
//       {/* Background animations */}
//       <motion.div
//         className="pointer-events-none absolute right-1/4 top-1/4 h-96 w-96 rounded-full opacity-20"
//         style={{ background: "radial-gradient(circle, var(--neon-1) 0%, transparent 70%)" }}
//         animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0] }}
//         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//       />
      
//       <motion.div
//         className="pointer-events-none absolute left-1/3 bottom-1/4 h-80 w-80 rounded-full opacity-20"
//         style={{ background: "radial-gradient(circle, var(--neon-2) 0%, transparent 70%)" }}
//         animate={{ x: [0, -40, 25, 0], y: [0, 40, -30, 0] }}
//         transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
//       />

//       <motion.div
//         initial={{ opacity: 0, y: 40, scale: 0.95 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="relative z-10 w-full max-w-md"
//       >
//         <GlassCard glowColor="purple" className="p-8">
//           {/* Logo Section */}
//           <div className="mb-8 flex flex-col items-center gap-4">
//             <motion.div
//               className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-purple/20"
//               animate={{
//                 boxShadow: [
//                   "0 0 20px rgba(var(--neon-1-rgb),0.3)",
//                   "0 0 40px rgba(var(--neon-1-rgb),0.5)",
//                   "0 0 20px rgba(var(--neon-1-rgb),0.3)",
//                 ],
//               }}
//               transition={{ duration: 2, repeat: Infinity }}
//             >
//               <FontAwesomeIcon
//                 icon={faShieldHalved}
//                 className="glow-purple text-2xl text-neon-purple"
//               />
//             </motion.div>
            
//             <div className="text-center">
//               <h1 className="text-glow-purple font-serif text-2xl font-bold tracking-wider text-foreground">
//                 {/* ✨ Now using i18n dictionary */}
//                 {t('auth.title')}
//               </h1>
//               <p className="mt-1 text-sm text-muted-foreground">
//                 {t('auth.subtitle')}
//               </p>
//             </div>
//           </div>

//           {/* Error Message */}
//           {errorMessage && (
//             <motion.div
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               className="mb-6 flex items-center gap-3 rounded-xl border border-neon-pink/50 bg-neon-pink/10 p-4"
//             >
//               <div className="h-2 w-2 animate-pulse rounded-full bg-neon-pink shadow-[0_0_10px_#ff007f]" />
//               <span className="text-[10px] font-bold tracking-widest text-neon-pink uppercase">
//                 {errorMessage === "Invalid login credentials"
//                   ? t('auth.login.errorAccessDenied')
//                   : errorMessage}
//               </span>
//             </motion.div>
//           )}

//           {/* Login Form */}
//           <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//             {/* Email Input */}
//             <div className="group relative">
//               <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
//                 <FontAwesomeIcon
//                   icon={faEnvelope}
//                   className="glow-cyan text-sm text-neon-cyan"
//                 />
//               </div>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder={t('auth.login.emailPlaceholder')}
//                 required
//                 className="glass w-full rounded-xl py-3.5 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none transition-shadow focus:ring-1 focus:ring-neon-purple/50"
//               />
//             </div>

//             {/* Password Input */}
//             <div className="group relative">
//               <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
//                 <FontAwesomeIcon
//                   icon={faLock}
//                   className="glow-pink text-sm text-neon-pink"
//                 />
//               </div>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder={t('auth.login.passwordPlaceholder')}
//                 required
//                 className="glass w-full rounded-xl py-3.5 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none transition-shadow focus:ring-1 focus:ring-neon-pink/50"
//               />
//             </div>

//             {/* Submit Button */}
//             <motion.button
//               type="submit"
//               disabled={loading}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-neon-purple py-3.5 font-serif text-sm font-bold tracking-widest text-white transition-shadow disabled:opacity-60"
//             >
//               {loading ? (
//                 <div className="neon-spinner h-5 w-5 rounded-full border-2 border-transparent border-t-white" />
//               ) : (
//                 <>
//                   <span>{t('auth.login.submitButton')}</span>
//                   <FontAwesomeIcon
//                     icon={faArrowRight}
//                     className="transition-transform group-hover:translate-x-1"
//                   />
//                 </>
//               )}
//             </motion.button>
//           </form>

//           {/* Biometric & Links */}
//           <div className="mt-6 flex flex-col items-center gap-6">
//             <div className="flex w-full items-center gap-3">
//               <div className="h-px flex-1 bg-border" />
//               <span className="text-xs text-muted-foreground">
//                 {t('auth.login.biometricLabel')}
//               </span>
//               <div className="h-px flex-1 bg-border" />
//             </div>

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="button"
//               className="glass flex items-center gap-3 rounded-xl px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-neon-green"
//             >
//               <FontAwesomeIcon icon={faFingerprint} className="text-neon-green" />
//               <span>Biometric Auth</span>
//             </motion.button>

//             <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
//               <span>{t('auth.login.registerLink')}</span>
//               <Link
//                 href="/register"
//                 className="inline-flex items-center gap-2 font-semibold text-neon-purple transition-colors hover:text-neon-cyan"
//               >
//                 {t('auth.login.registerLink')}
//                 <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
//               </Link>
//             </div>

//             <Link
//               href="#"
//               className="text-xs font-semibold text-neon-yellow transition-colors hover:text-neon-cyan"
//             >
//               {t('auth.login.forgotPassword')}
//             </Link>
//           </div>
//         </GlassCard>

//         {/* Footer */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8 }}
//           className="mt-8 text-center text-xs text-muted-foreground"
//         >
//           Financial Guard™ | Secured Command Center
//         </motion.p>
//       </motion.div>
//     </div>
//   )
// }

// /**
//  * KEY CHANGES FROM ORIGINAL:
//  * 
//  * 1. Import: `import { useI18n } from '@/hooks/use-translations'`
//  * 
//  * 2. Usage: `const { t } = useI18n()`
//  * 
//  * 3. Replace hardcoded strings:
//  *    - "FINANCIAL GUARD" → t('auth.title')
//  *    - "Access your command center" → t('auth.subtitle')
//  *    - "Email address" → t('auth.login.emailPlaceholder')
//  *    - "ENTER THE GUARD" → t('auth.login.submitButton')
//  *    - etc.
//  * 
//  * BENEFITS:
//  * ✅ Type-safe: Invalid keys cause TypeScript errors
//  * ✅ Auto-complete: Full IDE support for all available keys
//  * ✅ Single source of truth: All strings in one place
//  * ✅ Multi-language ready: Change language in SettingsProvider
//  * ✅ Maintainable: Easy to update or add new translations
//  */
