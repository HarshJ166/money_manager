"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Star } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Basic Plan",
    price: "Free",
    description: "Perfect for individuals getting started",
    features: [
      "Track unlimited transactions",
      "Basic budgeting tools",
      "Monthly reports",
      "Mobile app access",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro Plan",
    price: "$9.99",
    period: "/month",
    description: "Advanced features for serious budgeters",
    features: [
      "Everything in Basic",
      "AI-powered insights",
      "Custom categories",
      "Advanced analytics",
      "Priority support",
      "Export data",
      "Goal tracking",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Business Plan",
    price: "Custom",
    description: "Tailored solutions for teams",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Admin dashboard",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Training sessions",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-sans mb-4">Choose the perfect plan for you</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Start free and upgrade as your needs grow</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <Card
                className={`p-8 h-full ${plan.popular ? "border-cyan-200 shadow-lg scale-105" : "border-border/50"} bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold font-sans mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.popular ? "bg-cyan-600 hover:bg-cyan-700" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  asChild
                >
                  <Link href={plan.name === "Business Plan" ? "/contact" : "/auth/signup"}>{plan.cta}</Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
