"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MapPin, Zap, Clock, Power, FileText } from "lucide-react";
import type { Project } from "@/data/types";
import { PRIMARY_COLOR } from "@/lib/theme";
import {
  getStatusLabel,
  getStatusColorForModal,
} from "@/lib/status";
import { cn } from "@/lib/utils";

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailModal({
  project,
  open,
  onOpenChange,
}: ProjectDetailModalProps) {
  if (!project) return null;

  const statusColor = getStatusColorForModal(project.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[95vw] max-h-[85vh] overflow-y-auto p-0 gap-0 bg-black/95 backdrop-blur-md border-2 border-primary/30 shadow-2xl">
        {/* サイバーテックなヘッダー */}
        <DialogHeader className="relative p-6 border-b border-primary/20">
          {/* グロー効果 */}
          <div 
            className="absolute top-0 left-0 right-0 h-px opacity-50"
            style={{
              background: `linear-gradient(90deg, transparent, ${PRIMARY_COLOR.base}, transparent)`,
              boxShadow: `0 0 10px ${PRIMARY_COLOR.glow.medium}`,
            }}
          />
          
          <DialogTitle className="text-xl font-bold text-primary mb-2">
            {project.name}
          </DialogTitle>
          <div
            className={cn(
              "text-xs font-bold px-3 py-1.5 rounded border inline-block",
              statusColor
            )}
          >
            {getStatusLabel(project.status)}
          </div>
        </DialogHeader>
        
        <DialogDescription className="sr-only">
          {project.description}
        </DialogDescription>

        <div className="p-6 space-y-5">
          {/* 基本情報 - サイバーテックなグリッドレイアウト */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-primary/10 hover:border-primary/30 transition-all">
              <MapPin className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" style={{ filter: `drop-shadow(0 0 4px ${PRIMARY_COLOR.glow.medium})` }} />
              <div>
                <p className="font-medium text-xs text-primary/60 mb-1">所在地</p>
                <p className="text-sm text-foreground">{project.region}</p>
              </div>
            </div>

            {(project.capacityMW > 0 || project.energyMWh > 0) && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-primary/10 hover:border-primary/30 transition-all">
                <Zap className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" style={{ filter: `drop-shadow(0 0 4px ${PRIMARY_COLOR.glow.medium})` }} />
                <div>
                  <p className="font-medium text-xs text-primary/60 mb-1">容量・エネルギー</p>
                  <p className="text-sm text-foreground">{project.capacityMW}MW / {project.energyMWh}MWh</p>
                </div>
              </div>
            )}

            {project.powerArea && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-primary/10 hover:border-primary/30 transition-all">
                <Power className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" style={{ filter: `drop-shadow(0 0 4px ${PRIMARY_COLOR.glow.medium})` }} />
                <div>
                  <p className="font-medium text-xs text-primary/60 mb-1">電力エリア</p>
                  <p className="text-sm text-foreground">{project.powerArea}</p>
                </div>
              </div>
            )}

            {/* 種別 - 一時的に非表示 */}
            {/* {project.type && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-primary/10 hover:border-primary/30 transition-all">
                <Tag className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" style={{ filter: `drop-shadow(0 0 4px ${PRIMARY_COLOR.glow.medium})` }} />
                <div>
                  <p className="font-medium text-xs text-primary/60 mb-1">種別</p>
                  <p className="text-sm text-foreground">{project.type}</p>
                </div>
              </div>
            )} */}

            {project.lotNumber && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-primary/10 hover:border-primary/30 transition-all">
                <FileText className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" style={{ filter: `drop-shadow(0 0 4px ${PRIMARY_COLOR.glow.medium})` }} />
                <div>
                  <p className="font-medium text-xs text-primary/60 mb-1">地番</p>
                  <p className="text-sm text-foreground">{project.lotNumber}</p>
                </div>
              </div>
            )}

            {project.landCategory && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-primary/10 hover:border-primary/30 transition-all">
                <FileText className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" style={{ filter: `drop-shadow(0 0 4px ${PRIMARY_COLOR.glow.medium})` }} />
                <div>
                  <p className="font-medium text-xs text-primary/60 mb-1">地目</p>
                  <p className="text-sm text-foreground">{project.landCategory}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-primary/10 hover:border-primary/30 transition-all">
              <Clock className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" style={{ filter: `drop-shadow(0 0 4px ${PRIMARY_COLOR.glow.medium})` }} />
              <div>
                <p className="font-medium text-xs text-primary/60 mb-1">
                  {project.status === 'operational' ? '稼働開始日' : '稼働予定日'}
                </p>
                <p className="text-sm text-foreground">
                  {project.status === 'operational' 
                    ? project.startDate 
                    : project.plannedDate || '未定'}
                </p>
              </div>
            </div>
          </div>

          {/* 説明 - サイバーテックな区切り */}
          {project.description && (
            <div className="relative pt-4 border-t border-primary/20">
              <div 
                className="absolute top-0 left-0 right-0 h-px opacity-30"
                style={{
                  background: `linear-gradient(90deg, transparent, ${PRIMARY_COLOR.base}, transparent)`,
                }}
              />
              <h3 className="font-semibold mb-3 text-primary text-sm">プロジェクト概要</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{project.description}</p>
            </div>
          )}

          {/* 写真（あれば） */}
          {project.photos && project.photos.length > 0 && (
            <div className="relative pt-4 border-t border-primary/20">
              <div 
                className="absolute top-0 left-0 right-0 h-px opacity-30"
                style={{
                  background: `linear-gradient(90deg, transparent, ${PRIMARY_COLOR.base}, transparent)`,
                }}
              />
              <h3 className="font-semibold mb-4 text-primary text-sm">関連画像</h3>
              <div className="grid grid-cols-2 gap-3">
                {project.photos.map((photo, index) => (
                  <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-primary/20 hover:border-primary/40 transition-all">
                    <Image 
                      src={photo} 
                      alt={`${project.name} - 画像${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

