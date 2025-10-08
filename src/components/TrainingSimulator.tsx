"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, 
  Trophy, 
  Clock, 
  CheckCircle2, 
  Circle,
  Target,
  Zap,
  Medal,
  Star,
  User,
  Award
} from "lucide-react"
import dynamic from "next/dynamic"
import TrainingNotificationSystem, { NotificationTemplates, type Notification } from './TrainingNotificationSystem'

// Dynamic import for SimulatorCockpit
const SimulatorCockpit = dynamic(() => import('./SimulatorCockpit'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-void/50 rounded-lg border border-electric-cyan/30">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
        <p className="text-sm text-quantized-silver/60">Loading 3D simulator...</p>
      </div>
    </div>
  )
})

// Training mission types and data
interface TrainingMission {
  id: string
  title: string
  difficulty: number // 1-5 stars
  description: string
  duration: number // minutes
  xpReward: number
  objectives: string[]
  scenario: string
  isCompleted: boolean
  isLocked: boolean
  completionTime?: number
  score?: number
}

interface UserStats {
  id: string
  name: string
  avatar: string
  totalXP: number
  rank: number
  completedMissions: number
  averageScore: number
  isCurrentUser?: boolean
}

// Sample training missions
const trainingMissions: TrainingMission[] = [
  {
    id: "basic-001",
    title: "Transformer Basics: Visual Inspection",
    difficulty: 1,
    description: "Learn to identify key transformer components and their normal operating states.",
    duration: 15,
    xpReward: 500,
    objectives: [
      "Locate the oil tank",
      "Identify cooling radiators", 
      "Find the tap changer",
      "Examine bushings"
    ],
    scenario: "basic_inspection",
    isCompleted: true,
    isLocked: false,
    completionTime: 12,
    score: 950
  },
  {
    id: "thermal-002", 
    title: "Thermal Anomaly Detection",
    difficulty: 2,
    description: "Detect overheating issues using thermal imaging and sensor data.",
    duration: 25,
    xpReward: 750,
    objectives: [
      "Scan for thermal hotspots",
      "Identify cooling system failures",
      "Assess thermal gradient patterns",
      "Recommend corrective actions"
    ],
    scenario: "thermal_detection",
    isCompleted: true,
    isLocked: false,
    completionTime: 22,
    score: 875
  },
  {
    id: "fault-003",
    title: "Critical Fault Diagnosis",
    difficulty: 3,
    description: "Diagnose complex electrical faults under emergency conditions.",
    duration: 35,
    xpReward: 1000,
    objectives: [
      "Identify electrical fault type",
      "Isolate affected systems",
      "Determine root cause",
      "Execute emergency protocols"
    ],
    scenario: "critical_fault",
    isCompleted: false,
    isLocked: false
  },
  {
    id: "cascade-004",
    title: "Cascade Failure Prevention",
    difficulty: 4,
    description: "Prevent grid-wide failures during critical system overloads.",
    duration: 45,
    xpReward: 1500,
    objectives: [
      "Monitor system load distribution",
      "Predict failure cascade paths",
      "Implement load shedding protocols",
      "Coordinate emergency response"
    ],
    scenario: "cascade_prevention",
    isCompleted: false,
    isLocked: true
  },
  {
    id: "master-005",
    title: "Master Operator Certification",
    difficulty: 5,
    description: "Ultimate challenge: Multi-system crisis management under extreme conditions.",
    duration: 60,
    xpReward: 2500,
    objectives: [
      "Manage simultaneous failures",
      "Coordinate multi-team response",
      "Optimize grid stability",
      "Execute complex recovery procedures"
    ],
    scenario: "master_certification",
    isCompleted: false,
    isLocked: true
  }
]

// Sample leaderboard data
const leaderboardData: UserStats[] = [
  { id: "user-001", name: "Sarah Chen", avatar: "👩‍🔬", totalXP: 12500, rank: 1, completedMissions: 25, averageScore: 925 },
  { id: "user-002", name: "Marcus Rodriguez", avatar: "👨‍⚡", totalXP: 11750, rank: 2, completedMissions: 23, averageScore: 890 },
  { id: "user-003", name: "Aisha Patel", avatar: "👩‍💻", totalXP: 10980, rank: 3, completedMissions: 22, averageScore: 875 },
  { id: "user-004", name: "You", avatar: "👤", totalXP: 1450, rank: 24, completedMissions: 2, averageScore: 912, isCurrentUser: true },
  { id: "user-005", name: "David Kim", avatar: "👨‍🔧", totalXP: 9850, rank: 4, completedMissions: 20, averageScore: 860 },
  { id: "user-006", name: "Elena Volkov", avatar: "👩‍🏭", totalXP: 9200, rank: 5, completedMissions: 19, averageScore: 845 }
]

export default function TrainingSimulator() {
  const [selectedMission, setSelectedMission] = useState<TrainingMission | null>(null)
  const [currentUser] = useState(leaderboardData.find(u => u.isCurrentUser) || leaderboardData[3])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userStats, setUserStats] = useState({
    totalXP: currentUser.totalXP,
    completedMissions: currentUser.completedMissions,
    currentStreak: 0
  })

  // Notification handlers
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [...prev, notification])
  }, [])
  
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])
  
  const handleMissionStart = useCallback((mission: TrainingMission) => {
    setSelectedMission(mission)
  }, [])
  
  const handleReturnToHub = useCallback(() => {
    setSelectedMission(null)
  }, [])
  
  const handleMissionComplete = useCallback((score: number, xpGained: number) => {
    // Update user stats
    setUserStats(prev => ({
      ...prev,
      totalXP: prev.totalXP + xpGained,
      completedMissions: prev.completedMissions + 1,
      currentStreak: prev.currentStreak + 1
    }))
    
    // Show completion notification
    addNotification(NotificationTemplates.missionComplete(score, xpGained))
    
    // Show streak bonus if applicable
    if (userStats.currentStreak > 0 && userStats.currentStreak % 3 === 0) {
      const streakBonus = userStats.currentStreak * 50
      setTimeout(() => {
        addNotification(NotificationTemplates.streak(userStats.currentStreak, streakBonus))
        setUserStats(prev => ({ ...prev, totalXP: prev.totalXP + streakBonus }))
      }, 1500)
    }
    
    // Return to hub after completion
    setTimeout(() => {
      setSelectedMission(null)
    }, 3000)
  }, [userStats.currentStreak, addNotification])

  // Mission Hub (Left Panel)
  const MissionHub = () => (
    <div className="w-80 h-full bg-void/40 backdrop-blur-sm border-r border-electric-cyan/30 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-quantized-silver mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-electric-cyan" />
          Mission Hub
        </h2>
        <p className="text-sm text-quantized-silver/60">Select a training scenario to begin</p>
      </div>

      <div className="space-y-4">
        {trainingMissions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-panel p-4 cursor-pointer transition-all duration-300 hover:border-electric-cyan/60 ${
              selectedMission?.id === mission.id ? 'border-electric-cyan bg-electric-cyan/10' : ''
            } ${mission.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !mission.isLocked && handleMissionStart(mission)}
            whileHover={!mission.isLocked ? { scale: 1.02 } : {}}
            whileTap={!mission.isLocked ? { scale: 0.98 } : {}}
          >
            {/* Mission Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-quantized-silver text-sm mb-1">{mission.title}</h3>
                <p className="text-xs text-quantized-silver/60 line-clamp-2">{mission.description}</p>
              </div>
              {mission.isCompleted && (
                <CheckCircle2 className="w-5 h-5 text-emerald ml-2 flex-shrink-0" />
              )}
            </div>

            {/* Difficulty Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < mission.difficulty 
                      ? 'text-electric-cyan fill-current' 
                      : 'text-quantized-silver/30'
                  }`}
                />
              ))}
              <span className="text-xs text-quantized-silver/60 ml-2">
                Level {mission.difficulty}
              </span>
            </div>

            {/* Mission Stats */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-quantized-silver/60">
                  <Clock className="w-3 h-3" />
                  {mission.duration}m
                </span>
                <span className="flex items-center gap-1 text-electric-cyan">
                  <Zap className="w-3 h-3" />
                  {mission.xpReward} XP
                </span>
              </div>
              {mission.isCompleted && mission.score && (
                <span className="text-emerald font-medium">{mission.score}/1000</span>
              )}
            </div>

            {/* Locked Overlay */}
            {mission.isLocked && (
              <div className="absolute inset-0 bg-void/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Medal className="w-6 h-6 text-amber mx-auto mb-2" />
                  <p className="text-xs text-quantized-silver/60">Complete previous missions</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* User Progress Summary */}
      <div className="mt-6 pt-6 border-t border-electric-cyan/30">
        <h3 className="text-sm font-semibold text-quantized-silver mb-3">Your Progress</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-quantized-silver/60">Missions Completed:</span>
            <span className="text-electric-cyan font-medium">{userStats.completedMissions}/25</span>
          </div>
          <div className="flex justify-between">
            <span className="text-quantized-silver/60">Total XP:</span>
            <span className="text-electric-cyan font-medium">{userStats.totalXP.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-quantized-silver/60">Current Rank:</span>
            <span className="text-amber font-medium">#{currentUser.rank}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-quantized-silver/60">Average Score:</span>
            <span className="text-emerald font-medium">{currentUser.averageScore}/1000</span>
          </div>
        </div>
      </div>
    </div>
  )

  // Operator Leaderboard (Right Panel)
  const OperatorLeaderboard = () => (
    <div className="w-80 h-full bg-void/40 backdrop-blur-sm border-l border-electric-cyan/30 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-quantized-silver mb-2 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber" />
          Operator Leaderboard
        </h2>
        <p className="text-sm text-quantized-silver/60">Top performers this month</p>
      </div>

      <div className="space-y-3">
        {leaderboardData.slice(0, 10).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-panel p-3 transition-all duration-300 ${
              user.isCurrentUser 
                ? 'border-electric-cyan bg-electric-cyan/10 shadow-lg shadow-electric-cyan/20' 
                : 'hover:border-quantized-silver/40'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Rank Badge */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                user.rank === 1 ? 'bg-amber/20 text-amber border border-amber/40' :
                user.rank === 2 ? 'bg-quantized-silver/20 text-quantized-silver border border-quantized-silver/40' :
                user.rank === 3 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                'bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/30'
              }`}>
                {user.rank <= 3 ? (
                  user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'
                ) : (
                  user.rank
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{user.avatar}</span>
                  <span className={`text-sm font-medium truncate ${
                    user.isCurrentUser ? 'text-electric-cyan' : 'text-quantized-silver'
                  }`}>
                    {user.name}
                  </span>
                  {user.isCurrentUser && (
                    <User className="w-3 h-3 text-electric-cyan flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-quantized-silver/60">
                    {user.totalXP.toLocaleString()} XP
                  </span>
                  <span className="text-quantized-silver/60">
                    {user.completedMissions} missions
                  </span>
                </div>
              </div>
            </div>
            
            {/* Achievement Badges */}
            {user.rank <= 3 && (
              <div className="mt-2 flex gap-1">
                <Award className="w-3 h-3 text-amber" />
                <span className="text-xs text-amber">Top Performer</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Leaderboard Footer */}
      <div className="mt-6 pt-6 border-t border-electric-cyan/30 text-center">
        <p className="text-xs text-quantized-silver/60">
          Rankings updated every hour
        </p>
        <motion.button
          className="mt-3 px-4 py-2 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 rounded-lg text-xs font-medium transition-all duration-300 hover:bg-electric-cyan/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Full Rankings
        </motion.button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen pt-16">
      {/* Left Panel - Mission Hub */}
      <MissionHub />

      {/* Center Panel - Interactive 3D Simulator */}
      <div className="flex-1 h-full relative">
        {selectedMission ? (
          <SimulatorCockpit 
            mission={selectedMission}
            onMissionComplete={handleMissionComplete}
            onReturnToHub={handleReturnToHub}
            onNotificationAdd={(type: string, title: string, message: string, xp?: number) => {
              if (type === 'objective_complete') {
                addNotification(NotificationTemplates.objectiveComplete(message, xp || 100))
              } else if (type === 'anomaly_detected') {
                addNotification(NotificationTemplates.anomalyDetected(message, xp || 200))
              }
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-void/20">
            <div className="text-center">
              <Target className="w-16 h-16 text-electric-cyan/60 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-quantized-silver mb-2">
                Select a Mission to Begin
              </h3>
              <p className="text-quantized-silver/60 max-w-md">
                Choose a training scenario from the Mission Hub to start your certification journey. 
                Master each level to unlock advanced challenges.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Operator Leaderboard */}
      <OperatorLeaderboard />
      
      {/* Training Notification System */}
      <TrainingNotificationSystem 
        notifications={notifications}
        onNotificationDismiss={dismissNotification}
        soundEnabled={true}
      />
    </div>
  )
}