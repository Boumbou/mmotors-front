export type Section = {
    title: string;
    url: string;
    isActive?: boolean;
}

export type SideBarSectionType = {
    type: string;
    title: string;
    sections: Section[];
}

export const sidebarData: { navMain: SideBarSectionType[] } = {
  navMain: [
    {
      type: "customer",
      title:"Mon espace",
      sections: [
        {
          title: "Tableau de bord",
          url: "#",
          isActive: true,
        },
        {
          title: "Mes favoris",
          url: "#",
        },
        {
          title: "Mes dossiers",
          url: "#",
        },
        {
          title: "Mon compte",
          url: "#",
        },
      ],
      
    },
    {
      type: "staff",
      title: "Mon cockpit",
      sections: [
        {
          title: "Tableau de bord",
          url: "#",
          isActive: true,
        },
        {
          title: "Véhicules",
          url: "#",
        },
        {
          title: "Dossiers clients",
          url: "#",
        }
      ],
      
    },
    {
      type: "admin",
      title: "Espace admin",
      sections: [
        {
          title: "Tableau de bord",
          url: "#",
          isActive: true,
        },
        {
          title: "Mon équipe",
          url: "#",
        },
      ],
      
    },
  ],
};
