"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project, ProjectStatus } from "@/data/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Section } from "@/components/layout/PageLayout";
import { JapanMap } from "@/components/status/JapanMap";
import { ProjectCard } from "@/components/status/ProjectCard";
import { ProjectDetailModal } from "@/components/status/ProjectDetailModal";
import { STATUS_TABS } from "@/lib/status";
import { MAP_DEFAULT_SIZE } from "@/lib/constants";
import { ANIMATION, VIEWPORT } from "@/lib/animation";
import { PRIMARY_COLOR } from "@/lib/theme";

export default function StatusPage() {
  const [activeTab, setActiveTab] = useState<ProjectStatus | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // モーダルが閉じられた時にselectedProjectをクリア
      setSelectedProject(null);
    }
  };

  return (
    <div>
      {/* リッチなセクションタイトル */}
      <Section className="border-t border-white/20">
        <motion.div
          className="relative text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT.once}
          transition={ANIMATION.normal}
        >
          {/* 装飾的な背景パターン */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, ${PRIMARY_COLOR.glow.light} 0%, transparent 50%),
                ${PRIMARY_COLOR.pattern.light}
              `,
              backgroundSize: '100% 100%, 20px 20px',
            }}
          />

          {/* アイコン装飾 */}
          <div className="relative inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <MapPin className="h-10 w-10 text-primary" style={{ filter: `drop-shadow(0 0 12px ${PRIMARY_COLOR.glow.intense})` }} />
              {/* アイコンのグロー効果 */}
              <div 
                className="absolute inset-0 rounded-full blur-2xl -z-10 opacity-50"
                style={{
                  background: `radial-gradient(circle, ${PRIMARY_COLOR.glow.medium}, transparent 70%)`
                }}
              />
            </div>
          </div>

          {/* タイトル */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-heading text-foreground relative inline-block mb-4">
            <span className="relative">
              実績・工事状況
              {/* タイトルの下に装飾的なアンダーライン（静止表示） */}
              <div
                className="absolute -bottom-3 left-1/2 h-1 w-[70%] bg-primary/60 rounded-full -translate-x-1/2"
                style={{
                  boxShadow: `0 0 12px ${PRIMARY_COLOR.glow.strong}`
                }}
              />
            </span>
          </h1>

          {/* 装飾的なグロー背景 */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl -z-10 opacity-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${PRIMARY_COLOR.glow.medium}, transparent 70%)`
            }}
          />
        </motion.div>
      </Section>
      
      {/* 日本地図セクション */}
      <Section className="border-t border-white/20">
        <div className="w-full h-full">
          <JapanMap
            width={MAP_DEFAULT_SIZE.width}
            height={MAP_DEFAULT_SIZE.height}
            projects={projects}
            onProjectClick={handleProjectClick}
          />
        </div>
      </Section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ProjectStatus | "all")}
        >
          <TabsList>
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {projects
                  .filter((p) => tab.value === "all" || p.status === tab.value)
                  .map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectClick(project)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* プロジェクト詳細モーダル */}
      <ProjectDetailModal
        project={selectedProject}
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
      />
    </div>
  );
}
