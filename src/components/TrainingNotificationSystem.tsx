"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  Zap, 
  Target, 
  AlertTriangle, 
  Trophy,
  TrendingUp,
  Lightbulb,
  Clock,
  Star
} from 'lucide-react'

export interface Notification {
  id: string
  type: 'objective_complete' | 'anomaly_detected' | 'bonus_xp' | 'mission_complete' | 'streak' | 'warning' | 'hint'
  title: string
  message: string
  xp?: number
  icon?: React.ReactNode
  color?: string
  duration?: number
  timestamp: number
}

interface TrainingNotificationSystemProps {
  notifications: Notification[]
  onNotificationDismiss: (id: string) => void
  soundEnabled?: boolean
}

// Notification sound effects (using Web Audio API)
const playNotificationSound = (type: string) => {
  if (typeof window === 'undefined') return
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Different sounds for different notification types
    switch (type) {
      case 'objective_complete':
        // Success sound - ascending notes
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
        break
      
      case 'anomaly_detected':
        // Discovery sound - mystery notes
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
        oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.15) // C#5
        break
      
      case 'bonus_xp':
        // Bonus sound - bright and sparkly
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime) // A5
        oscillator.frequency.setValueAtTime(1046.5, audioContext.currentTime + 0.1) // C6
        break
      
      case 'mission_complete':
        // Victory fanfare
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
        oscillator.frequency.setValueAtTime(1046.5, audioContext.currentTime + 0.3) // C6
        break
      
      default:
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
    }
    
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.log('Audio not supported')
  }
}

const getNotificationConfig = (type: string) => {
  switch (type) {
    case 'objective_complete':
      return {
        icon: <CheckCircle2 className="w-6 h-6" />,
        color: 'emerald',
        bgColor: 'bg-emerald/20',
        borderColor: 'border-emerald/40',
        textColor: 'text-emerald',
        duration: 4000
      }
    
    case 'anomaly_detected':
      return {
        icon: <AlertTriangle className="w-6 h-6" />,
        color: 'purple',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/40',
        textColor: 'text-purple-400',
        duration: 4000
      }
    
    case 'bonus_xp':
      return {
        icon: <Star className="w-6 h-6" />,
        color: 'amber',
        bgColor: 'bg-amber/20',
        borderColor: 'border-amber/40',
        textColor: 'text-amber',
        duration: 3000
      }
    
    case 'mission_complete':
      return {
        icon: <Trophy className="w-6 h-6" />,
        color: 'electric-cyan',
        bgColor: 'bg-electric-cyan/20',
        borderColor: 'border-electric-cyan/40',
        textColor: 'text-electric-cyan',
        duration: 6000
      }
    
    case 'streak':
      return {
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'orange',
        bgColor: 'bg-orange-500/20',
        borderColor: 'border-orange-500/40',
        textColor: 'text-orange-400',
        duration: 3000
      }
    
    case 'warning':
      return {
        icon: <Clock className="w-6 h-6" />,
        color: 'crimson',
        bgColor: 'bg-crimson/20',
        borderColor: 'border-crimson/40',
        textColor: 'text-crimson',
        duration: 4000
      }
    
    case 'hint':
      return {
        icon: <Lightbulb className="w-6 h-6" />,
        color: 'blue',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/40',
        textColor: 'text-blue-400',
        duration: 5000
      }
    
    default:
      return {
        icon: <Target className="w-6 h-6" />,
        color: 'quantized-silver',
        bgColor: 'bg-quantized-silver/20',
        borderColor: 'border-quantized-silver/40',
        textColor: 'text-quantized-silver',
        duration: 3000
      }
  }
}

function NotificationCard({ 
  notification, 
  onDismiss,
  index 
}: { 
  notification: Notification
  onDismiss: (id: string) => void
  index: number 
}) {
  const config = getNotificationConfig(notification.type)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id)
    }, config.duration)
    
    return () => clearTimeout(timer)
  }, [notification.id, onDismiss, config.duration])
  
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.8, 
        x: 300,
        rotateY: -90 
      }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        x: 0,
        rotateY: 0 
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8, 
        x: 300,
        rotateY: 90 
      }}
      transition={{ 
        type: "spring", 
        damping: 20, 
        stiffness: 300,
        delay: index * 0.1 
      }}
      className={`
        glass-panel p-4 min-w-[320px] max-w-[400px] cursor-pointer
        ${config.bgColor} ${config.borderColor} shadow-lg
        hover:scale-105 transition-transform duration-200
      `}
      onClick={() => onDismiss(notification.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        {/* Icon with glow effect */}
        <motion.div 
          className={`${config.textColor} flex-shrink-0`}
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          {config.icon}
        </motion.div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-semibold text-sm ${config.textColor}`}>
              {notification.title}
            </h4>
            {notification.xp && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex items-center gap-1 bg-electric-cyan/20 px-2 py-1 rounded-full"
              >
                <Zap className="w-3 h-3 text-electric-cyan" />
                <span className="text-xs font-bold text-electric-cyan">
                  +{notification.xp} XP
                </span>
              </motion.div>
            )}
          </div>
          
          <p className="text-xs text-quantized-silver/80 mb-2">
            {notification.message}
          </p>
          
          {/* Progress bar for auto-dismiss */}
          <motion.div 
            className="w-full h-1 bg-quantized-silver/20 rounded-full overflow-hidden"
          >
            <motion.div
              className={`h-full ${config.bgColor.replace('/20', '/60')}`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ 
                duration: config.duration / 1000, 
                ease: "linear" 
              }}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Particle effects for special notifications */}
      {(notification.type === 'objective_complete' || notification.type === 'mission_complete') && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-electric-cyan rounded-full"
              initial={{ 
                x: '50%', 
                y: '50%', 
                scale: 0, 
                opacity: 1 
              }}
              animate={{ 
                x: `${50 + (Math.random() - 0.5) * 200}%`,
                y: `${50 + (Math.random() - 0.5) * 200}%`,
                scale: [0, 1, 0], 
                opacity: [1, 1, 0] 
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.1,
                ease: "easeOut" 
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function TrainingNotificationSystem({ 
  notifications, 
  onNotificationDismiss, 
  soundEnabled = true 
}: TrainingNotificationSystemProps) {
  // Play sound when new notification arrives
  useEffect(() => {
    if (notifications.length > 0 && soundEnabled) {
      const latestNotification = notifications[notifications.length - 1]
      const now = Date.now()
      
      // Only play sound for notifications that are less than 100ms old
      if (now - latestNotification.timestamp < 100) {
        playNotificationSound(latestNotification.type)
      }
    }
  }, [notifications, soundEnabled])
  
  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationCard
              notification={notification}
              onDismiss={onNotificationDismiss}
              index={index}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Helper function to create notifications
export const createNotification = (
  type: Notification['type'],
  title: string,
  message: string,
  xp?: number
): Notification => ({
  id: `${Date.now()}-${Math.random()}`,
  type,
  title,
  message,
  xp,
  timestamp: Date.now()
})

// Predefined notification templates
export const NotificationTemplates = {
  objectiveComplete: (objectiveName: string, xp: number = 100) =>
    createNotification(
      'objective_complete',
      'OBJECTIVE COMPLETE!',
      `${objectiveName} successfully identified`,
      xp
    ),
  
  anomalyDetected: (anomalyName: string, xp: number = 200) =>
    createNotification(
      'anomaly_detected',
      'ANOMALY DETECTED!',
      `Critical fault found: ${anomalyName}`,
      xp
    ),
  
  bonusXP: (reason: string, xp: number) =>
    createNotification(
      'bonus_xp',
      'BONUS XP!',
      reason,
      xp
    ),
  
  missionComplete: (score: number, totalXP: number) =>
    createNotification(
      'mission_complete',
      'MISSION COMPLETE!',
      `Final Score: ${score}/1000`,
      totalXP
    ),
  
  streak: (count: number, xp: number) =>
    createNotification(
      'streak',
      'STREAK BONUS!',
      `${count} objectives in a row!`,
      xp
    ),
  
  timeWarning: (timeLeft: number) =>
    createNotification(
      'warning',
      'TIME WARNING!',
      `Only ${timeLeft} seconds remaining`,
    ),
  
  hint: (hintText: string) =>
    createNotification(
      'hint',
      'TRAINING HINT',
      hintText
    )
}