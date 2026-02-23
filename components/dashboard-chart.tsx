"use client"

import { ChartPoint, DashboardChartProps } from "@/types/dashboard.types";
import { useI18n } from "@/hooks/use-translations";
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { useSettings } from "./settings-provider";



export function DashboardChart({ 
  data, 
  isLoading, 
  color = "#8F00FF", 
  gradientId 
}: DashboardChartProps) {
  const { t } = useI18n();
  const { formatCurrency } = useSettings()
  
  const hasData = data && data.length > 0;
  const isAllZero = hasData ? data.every(point => point.v === 0) : true;

  if (isLoading) {
    return (
      <div className="flex h-28 w-full items-center justify-center">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-transparent" />
      </div>
    );
  }

  if (isAllZero) {
    return (
      <div className="flex h-28 w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
          {t('dashboard.noActivity' as any) || "Sin actividad"}
        </p>
      </div>
    );
  }

  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            {/* Usamos el color dinámico para el gradiente */}
            <linearGradient id="dynamic-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="d" hide />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
             content={({ active, payload }) => {
              if (active && payload?.length) {
                return (
                  <div className="rounded border border-white/10 bg-black/80 px-2 py-1 text-[10px] text-white backdrop-blur-md">
                    {formatCurrency(Number(payload[0].value ?? 0))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={color} // La línea cambia de color
            strokeWidth={2.5}
            fill="url(#dynamic-gradient)" // El relleno cambia de color
            animationDuration={800}
            // Importante: syncId si quieres que todos los charts se muevan igual
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}