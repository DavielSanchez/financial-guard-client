"use client"

import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWifi, faArrowRotateRight } from "@fortawesome/free-solid-svg-icons"

export default function OfflinePage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "rgba(143,0,255,0.1)" }}
      >
        <FontAwesomeIcon
          icon={faWifi}
          className="text-4xl text-primary"
          style={{ filter: "drop-shadow(0 0 10px rgba(143,0,255,0.5))" }}
        />
      </div>
      <h1 className="text-center text-xl font-bold text-foreground">
        Sin conexión
      </h1>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        No hay conexión a internet. Algunas funciones pueden no estar disponibles.
      </p>
      <button
        onClick={() => router.refresh()}
        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
      >
        <FontAwesomeIcon icon={faArrowRotateRight} />
        Reintentar
      </button>
    </div>
  )
}
