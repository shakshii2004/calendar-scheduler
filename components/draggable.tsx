"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"

interface DraggableProps {
  children: React.ReactNode
}

export function Draggable({ children }: DraggableProps) {
  const [isDragging, setIsDragging] = useState(false)
  const constraintsRef = useRef(null)

  return (
    <motion.div ref={constraintsRef} className="relative">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        whileDrag={{ scale: 1.02, zIndex: 20 }}
        className={isDragging ? "z-10" : ""}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

