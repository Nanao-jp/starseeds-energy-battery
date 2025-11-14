"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Zap } from "lucide-react";
import type { Project } from "@/data/types";
import { getStatusLabel, getStatusColorForCard } from "@/lib/status";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const statusColor = getStatusColorForCard(project.status);

  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer hover:shadow-xl transition-all border-2",
        statusColor,
        "hover:border-opacity-60"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded border",
              statusColor
            )}
          >
            {getStatusLabel(project.status)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 text-sm">
        <div className="flex items-center text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 mr-1.5" />
          <span className="truncate">{project.region}</span>
        </div>
        {(project.capacityMW > 0 || project.energyMWh > 0) && (
          <div className="flex items-center text-muted-foreground">
            <Zap className="w-3.5 h-3.5 mr-1.5" />
            <span>
              {project.capacityMW}MW / {project.energyMWh}MWh
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

