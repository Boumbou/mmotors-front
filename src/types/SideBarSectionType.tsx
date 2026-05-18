import { HugeiconsIcon } from "@hugeicons/react";
import {  CarSignalIcon, DashboardBrowsingIcon, Folder, Setting06Icon, User02Icon } from "@hugeicons/core-free-icons";

export type SideBarSectionType = {
    value: string;
    title: string;
    icon: React.ReactNode;
}

export const sidebarData: {  [key: string]: SideBarSectionType[] } = {
  customer: [
    {
      value: "profile",
      title:"Mon profile",
      icon: <HugeiconsIcon icon={User02Icon} className="w-4 h-4 mr-2" />
    },
    {
      value: "applications",
      title: "Mes dossiers",
      icon: <HugeiconsIcon icon={Folder} className="w-4 h-4 mr-2" />
    },
  ],
  staff: [
    {
      value: "dashboard",
      title: "Tableau de bord",
      icon: <HugeiconsIcon icon={DashboardBrowsingIcon} className="w-4 h-4 mr-2" />
    },
    {
      value: "applications",
      title: "Dossiers",
      icon: <HugeiconsIcon icon={Folder} className="w-4 h-4 mr-2" />
    },
    {
      value: "vehicles",
      title: "Véhicules",
      icon: <HugeiconsIcon icon={CarSignalIcon} className="w-4 h-4 mr-2" />
    }
  ],
  admin: [
    {
      value: "dashboard",
      title: "Tableau de bord",
      icon: <HugeiconsIcon icon={DashboardBrowsingIcon} className="w-4 h-4 mr-2" />

    },
    {
      value: "applications",
      title: "Dossiers",
      icon: <HugeiconsIcon icon={Folder} className="w-4 h-4 mr-2" />
    },
    {
      value: "vehicles",
      title: "Véhicules",
      icon: <HugeiconsIcon icon={CarSignalIcon} className="w-4 h-4 mr-2" />
    },
    {
      value: "settings",
      title: "Paramètres",
      icon: <HugeiconsIcon icon={Setting06Icon} className="w-4 h-4 mr-2" />
    }
  ]
};  
