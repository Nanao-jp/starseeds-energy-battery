"use client";

import { motion } from "framer-motion";
import { Award, Zap, Globe } from "lucide-react";

const kpiData = [
  {
    icon: <Award className="h-10 w-10 text-green-500" />,
    value: "国内トップクラス",
    label: "総稼働容量",
  },
  {
    icon: <Zap className="h-10 w-10 text-green-500" />,
    value: "高い安定供給力",
    label: "総エネルギー量",
  },
  {
    icon: <Globe className="h-10 w-10 text-green-500" />,
    value: "全国への展開",
    label: "全国展開拠点",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export function KpiSection() {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {kpiData.map((item, index) => (
            <motion.div
              key={index}
              className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <p className="text-3xl font-bold text-gray-800">{item.value}</p>
              <p className="mt-2 text-md font-medium text-gray-500">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
