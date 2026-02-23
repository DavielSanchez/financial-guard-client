"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { CATEGORIZED_ICONS } from "@/lib/icons"
import { CategoryIcon } from "../category-icon"
import { AddCategoryDrawerProps } from "@/types/categories.types"

export const AddCategoryDrawer = ({ isOpen, onClose, txType, onSave }: AddCategoryDrawerProps) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#8F00FF");
  const [selectedIcon, setSelectedIcon] = useState("Plus");

  // Colores sugeridos para mantener la estética neon
  const quickColors = [
    "#8F00FF", "#00FF94", "#FF0055", "#00D4FF", 
    "#FFB800", "#FF4D00", "#FF00E5", "#FFFFFF"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden glass mb-6 rounded-2xl border border-white/10 shadow-2xl"
        >
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">
                Nueva Categoría de {txType === 'income' ? 'Ingreso' : 'Gasto'}
              </h3>
              <button onClick={onClose} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Input de Nombre */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Nombre</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ejem: Gimnasio, Freelance..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-all placeholder:text-white/20"
              />
            </div>

            {/* Selector de Color */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Color Personalizado</p>
                <input 
                  type="color" 
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-8 h-8 bg-transparent border-none cursor-pointer rounded-full overflow-hidden"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-between">
                {quickColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-90 ${
                      selectedColor === color ? "border-white" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Selector de Iconos Agrupado */}
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Selecciona un Icono</p>
              
              <div className="h-64 overflow-y-auto pr-2 no-scrollbar space-y-6">
                {CATEGORIZED_ICONS.map((group) => (
                  <div key={group.group} className="space-y-2">
                    <h4 className="text-[9px] uppercase font-bold text-white/40 ml-1 tracking-wider">
                      {group.group}
                    </h4>
                    <div className="grid grid-cols-6 gap-2">
                      {group.icons.map((iconName) => (
                        <motion.button
                          key={iconName}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedIcon(iconName)}
                          className={`flex items-center justify-center h-10 rounded-xl transition-all ${
                            selectedIcon === iconName 
                              ? "bg-white/20 ring-1 ring-white/40 shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                              : "bg-white/5 hover:bg-white/10 text-white/40"
                          }`}
                        >
                          <CategoryIcon 
                            name={iconName} 
                            color={selectedIcon === iconName ? selectedColor : "currentColor"} 
                            size={18} 
                            strokeWidth={2.5}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview y Botón Final */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className="flex flex-col items-center">
                   <div 
                    className="h-14 w-14 rounded-full flex items-center justify-center bg-background border border-white/10 transition-all duration-500"
                    style={{ 
                      boxShadow: `0 0 25px ${selectedColor}40`,
                      borderColor: `${selectedColor}40`
                    }}
                   >
                    <CategoryIcon 
                      name={selectedIcon} 
                      color={selectedColor} 
                      size={28} 
                      strokeWidth={2.5}
                    />
                   </div>
                </div>
                <button
                  disabled={!name.trim()}
                  onClick={() => onSave({ name, color: selectedColor, type: txType, icon: selectedIcon })}
                  className="flex-1 py-4 rounded-xl font-bold text-[10px] tracking-[0.2em] bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  GUARDAR CATEGORÍA
                </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};