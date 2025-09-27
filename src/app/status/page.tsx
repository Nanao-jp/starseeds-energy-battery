"use client";

import { useState } from 'react';
import { projects } from '@/data/projects';
import type { Project, ProjectStatus } from '@/data/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, Zap, Clock } from 'lucide-react';

const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center py-16 bg-gray-50">
    <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
    <p className="mt-4 text-xl text-gray-600">{subtitle}</p>
  </div>
);

const ProjectCard = ({ project }: { project: Project }) => {
  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case 'operational': return '稼働中';
      case 'construction': return '工事中';
      case 'planning': return '計画中';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <div className={`text-sm font-bold px-2 py-1 rounded-full inline-block ${
          project.status === 'operational' ? 'bg-green-100 text-green-700' :
          project.status === 'construction' ? 'bg-yellow-100 text-yellow-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {getStatusLabel(project.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{project.region}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Zap className="w-4 h-4 mr-2" />
          <span>{project.capacityMW}MW / {project.energyMWh}MWh</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>
            {project.status === 'operational' ? `稼働開始: ${project.startDate}` : `稼働予定: ${project.plannedDate}`}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">{project.description}</p>
      </CardFooter>
    </Card>
  );
};

export default function StatusPage() {
  const [activeTab, setActiveTab] = useState<ProjectStatus>("operational");

  const tabs: { value: ProjectStatus; label: string }[] = [
    { value: 'operational', label: '運用中' },
    { value: 'construction', label: '工事中' },
    { value: 'planning', label: '計画中' },
  ];

  return (
    <div>
      <PageHeader title="実績・工事状況" subtitle="全国で進行中のプロジェクトをご覧ください" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProjectStatus)}>
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {projects.filter(p => p.status === tab.value).map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
