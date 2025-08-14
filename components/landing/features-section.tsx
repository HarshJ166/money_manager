"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Brain, BarChart3, Lock, Smartphone, PieChart, Calendar } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Intelligent Budgeting",
    description: "Automate your savings and expenses effortlessly with AI-powered recommendations.",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    icon: BarChart3,
    title: "Real-Time Insights",
    description: "Get actionable insights with our AI-driven analytics and spending patterns.",
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description: "We prioritize your privacy with top-notch security measures and encryption.",
    gradient: "from-green-500 to-green-600",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Access your finances on any device with our responsive design.",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: PieChart,
    title: "Visual Reports",
    description: "Beautiful charts and graphs make understanding your finances simple.",
    gradient: "from-yellow-500 to-yellow-600",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Set up recurring transactions and never miss a payment again.",
    gradient: "from-red-500 to-red-600",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-sans mb-4">Everything you need to manage your money</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make financial management simple and effective
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group">
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 font-sans group-hover:text-cyan-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
