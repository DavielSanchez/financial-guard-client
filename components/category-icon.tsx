"use client"

import React from "react"
import * as LucideIcons from "lucide-react"
import { LucideProps } from "lucide-react"

interface CategoryIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
  color: string;
}

export const CategoryIcon = ({ name, color, ...props }: CategoryIconProps) => {
  // Buscamos el componente dinámicamente
  const Icon = (LucideIcons as any)[name] as React.ElementType;

  // Si no existe, usamos un icono de ayuda por defecto
  if (!Icon) {
    return <LucideIcons.HelpCircle color={color} {...props} />;
  }

  return <Icon color={color} {...props} />;
}