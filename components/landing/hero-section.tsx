"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, TrendingUp, Shield, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Join hundreds of users transforming their financial health
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans mb-6 bg-gradient-to-r from-foreground via-foreground to-cyan-600 bg-clip-text text-transparent">
              Master Your Finances
              <br />
              <span className="text-cyan-600">Effortlessly</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Simplify budgeting and tracking with our intuitive Money Manager app. Get real-time insights and take
              control of your financial future.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg group bg-transparent hover:bg-muted/50 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-yellow-400/20 blur-3xl rounded-3xl"></div>
              <motion.div
                className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: TrendingUp,
                      title: "Smart Analytics",
                      desc: "AI-powered insights for better decisions",
                      color: "from-cyan-500 to-cyan-600",
                    },
                    {
                      icon: Shield,
                      title: "Bank-Level Security",
                      desc: "Your data is protected with encryption",
                      color: "from-yellow-500 to-yellow-600",
                    },
                    {
                      icon: Zap,
                      title: "Real-Time Sync",
                      desc: "Access your data anywhere, anytime",
                      color: "from-green-500 to-green-600",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
