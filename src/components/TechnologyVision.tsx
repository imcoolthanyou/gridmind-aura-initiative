"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Brain, Cpu, Eye, Zap, TrendingUp, Shield, Clock, DollarSign } from "lucide-react"
import dynamic from "next/dynamic"
import DataFusionVisualization from '@/components/DataFusionVisualization'

const Scene = dynamic(() => import('@/components/3DScene'), { ssr: false });

export default function TechnologyVision() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <div ref={containerRef} className="relative pt-24 pb-20">
      <div className="container mx-auto px-6 space-y-32">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="inline-block p-4 rounded-2xl bg-electric-cyan/10 border border-electric-cyan/30 mb-6"
          >
            <Brain className="w-16 h-16 text-electric-cyan" />
          </motion.div>
          <h1 className="text-6xl font-bold text-quantized-silver mb-6 font-sans">
            The Future of{" "}
            <span className="text-electric-cyan text-glow-cyan">Grid Intelligence</span>
          </h1>
          <p className="text-xl text-quantized-silver/70 leading-relaxed">
            GridMind represents a paradigm shift in power infrastructure management—
            where artificial intelligence meets critical energy systems to create
            an adaptive, predictive, and self-healing grid ecosystem.
          </p>
        </motion.section>

        {/* AI Core Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-8 h-8 text-magenta" />
              <h2 className="text-4xl font-bold text-quantized-silver font-sans">
                Our AI Core
              </h2>
            </div>
            <p className="text-lg text-quantized-silver/70 mb-8 leading-relaxed">
              At the heart of GridMind lies a sophisticated ensemble of machine learning
              models, each specialized in extracting intelligence from complex sensor data.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "Convolutional Neural Networks",
                  description: "FRA signature classification with 99.2% accuracy",
                  metric: "99.2%",
                },
                {
                  title: "Anomaly Detection Algorithms",
                  description: "Real-time pattern recognition across multi-modal streams",
                  metric: "< 2s",
                },
                {
                  title: "LSTM Predictive Models",
                  description: "Time-series forecasting for failure prediction",
                  metric: "14-day",
                },
                {
                  title: "Transformer Architecture",
                  description: "Advanced NLP for automated report generation",
                  metric: "GPT-4",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel p-4 hover:glass-panel-bright transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-electric-cyan group-hover:text-glow-cyan transition-all">
                      {item.title}
                    </h3>
                    <span className="text-sm font-bold text-magenta font-mono">
                      {item.metric}
                    </span>
                  </div>
                  <p className="text-sm text-quantized-silver/70">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Animated Neural Network Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px]"
          >
            <Scene />
          </motion.div>
        </section>

        {/* Multi-Modal Fusion Engine */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-solar-orange" />
              <h2 className="text-4xl font-bold text-quantized-silver font-sans">
                Multi-Modal Fusion Engine
              </h2>
            </div>
            <p className="text-lg text-quantized-silver/70 max-w-3xl mx-auto">
              True intelligence emerges when disparate data streams converge. Our fusion
              engine synthesizes FRA, acoustic, thermal, and DGA data into unified insights.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <DataFusionVisualization />
          </div>
        </section>

        {/* Digital Twin Ecosystem */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="glass-panel p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/5 via-transparent to-magenta/5" />
              <div className="relative z-10">
                {/* AR/VR Concept */}
                <div className="w-full h-64 rounded-lg bg-gradient-to-br from-electric-cyan/20 to-magenta/20 border border-electric-cyan/30 flex items-center justify-center mb-4">
                  <Eye className="w-24 h-24 text-electric-cyan/40" />
                </div>
                <div className="space-y-3 text-sm text-quantized-silver/70">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-electric-cyan mt-1.5" />
                    <p>Real-time 3D asset visualization with live sensor overlays</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-magenta mt-1.5" />
                    <p>AR guidance for field engineers via mobile devices</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-solar-orange mt-1.5" />
                    <p>Predictive simulation of failure scenarios</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-electric-cyan" />
              <h2 className="text-4xl font-bold text-quantized-silver font-sans">
                Digital Twin Ecosystem
              </h2>
            </div>
            <p className="text-lg text-quantized-silver/70 mb-6 leading-relaxed">
              Every physical transformer exists simultaneously in the digital realm—a
              living, breathing Digital Twin that mirrors real-world conditions and
              predicts future states with unprecedented accuracy.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Predictive Simulation",
                  description:
                    "Run thousands of failure scenarios to identify optimal maintenance windows",
                },
                {
                  title: "AR Maintenance Overlay",
                  description:
                    "Field engineers see diagnostic data overlaid directly on physical equipment",
                },
                {
                  title: "Remote Inspection",
                  description:
                    "Experts anywhere in the world can virtually inspect assets in real-time",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-2 border-electric-cyan/30 pl-4"
                >
                  <h3 className="text-lg font-semibold text-quantized-silver mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-quantized-silver/60">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Impact & Metrics */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-quantized-silver font-sans mb-4">
              Measurable Impact
            </h2>
            <p className="text-lg text-quantized-silver/70 max-w-3xl mx-auto">
              GridMind delivers quantifiable improvements across safety, reliability,
              and operational efficiency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: TrendingUp,
                value: "70%",
                label: "Downtime Reduction",
                color: "electric-cyan",
              },
              {
                icon: Clock,
                value: "5x",
                label: "Asset Life Extension",
                color: "magenta",
              },
              {
                icon: DollarSign,
                value: "$2M+",
                label: "Savings per Asset/Year",
                color: "solar-orange",
              },
              {
                icon: Shield,
                value: "99.8%",
                label: "Prediction Accuracy",
                color: "amber",
              },
            ].map((metric, index) => {
              const Icon = metric.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel p-6 text-center hover:glass-panel-bright transition-all duration-300 group"
                >
                  <div
                    className="inline-flex p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `var(--${metric.color})20` }}
                  >
                    <Icon
                      className="w-8 h-8"
                      style={{ color: `var(--${metric.color})` }}
                    />
                  </div>
                  <div
                    className="text-4xl font-bold mb-2 font-mono"
                    style={{ color: `var(--${metric.color})` }}
                  >
                    {metric.value}
                  </div>
                  <div className="text-sm text-quantized-silver/70">{metric.label}</div>
                </motion.div>
              )
            })}
          </div>

          {/* Future Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8"
          >
            <h3 className="text-2xl font-bold text-quantized-silver font-sans mb-6 text-center">
              Future Development Roadmap
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  phase: "Phase 1: Q2 2025",
                  title: "Edge AI Deployment",
                  items: [
                    "On-device inference",
                    "Offline diagnostics",
                    "5G connectivity",
                  ],
                },
                {
                  phase: "Phase 2: Q4 2025",
                  title: "Autonomous Operations",
                  items: [
                    "Self-healing grid protocols",
                    "Automated load balancing",
                    "Predictive part ordering",
                  ],
                },
                {
                  phase: "Phase 3: 2026",
                  title: "Ecosystem Integration",
                  items: [
                    "Smart city integration",
                    "Renewable energy optimization",
                    "Carbon footprint reduction",
                  ],
                },
              ].map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="text-sm text-electric-cyan font-semibold mb-2">
                    {phase.phase}
                  </div>
                  <h4 className="text-lg font-bold text-quantized-silver mb-4">
                    {phase.title}
                  </h4>
                  <ul className="space-y-2 text-sm text-quantized-silver/70">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-electric-cyan" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center glass-panel p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/5 via-magenta/5 to-solar-orange/5" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-quantized-silver font-sans mb-4">
              Join the Grid Revolution
            </h2>
            <p className="text-lg text-quantized-silver/70 mb-8 max-w-2xl mx-auto">
              GridMind is more than technology—it's a commitment to a safer, more
              reliable energy future. Partner with us to transform your infrastructure.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-electric-cyan text-void font-bold text-lg rounded-xl shadow-lg shadow-electric-cyan/50 hover:shadow-electric-cyan/70 transition-all duration-300"
            >
              Request a Demo
            </motion.button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
