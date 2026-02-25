"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Users,
  Building2,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  Globe,
  Briefcase,
  GraduationCap,
} from "lucide-react";

import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Analisis Wilayah", href: "/analisis", icon: BarChart3 },
    { name: "Peta Wilayah", href: "/peta", icon: Map },
    { name: "Kependudukan", href: "/statistik/kependudukan", icon: Users },
    { name: "Pendidikan", href: "/statistik/pendidikan", icon: GraduationCap },
    { name: "Ekonomi", href: "/statistik/ekonomi", icon: Briefcase },
    { name: "IDM", href: "/idm?year=2024", icon: Activity },
    { name: "SDGS", href: "/sdgs", icon: Globe },
    { name: "Fasilitas Umum", href: "/facilities", icon: Building2 },
    // { name: "Pengaturan", href: "/settings", icon: Settings },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64 shrink-0"
        )}
      >
        <div className={cn("flex items-center h-auto py-4 px-4 border-b border-slate-200", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Logo Pondokrejo" 
                  width={48} 
                  height={48} 
                  className="object-contain" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 leading-none">
                  Kalurahan Pondokrejo
                </span>
                <span className="text-xs text-slate-500 font-medium mt-1">
                  Kapanewon Tempel, Sleman Yogyakarta
                </span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="relative w-10 h-10 mx-auto">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  width={40} 
                  height={40} 
                  className="object-contain" 
                />
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-slate-100 text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href.includes('?') && pathname === item.href.split('?')[0]);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  isCollapsed ? "justify-center" : ""
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon size={20} className={cn(isActive ? "text-blue-600" : "text-slate-500")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 hidden lg:flex justify-end">
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
}
