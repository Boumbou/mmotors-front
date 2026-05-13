import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { type SideBarSectionType } from "@/types/SideBarSectionType"

export default function ProfileLayout({ children, sections }: { children: React.ReactNode, sections: SideBarSectionType | undefined }) {
    return (
            <SidebarProvider>
                <AppSidebar  sections={sections}/>
                <SidebarInset>
                    {/* header with trigger to open sidebar on mobile */}
                    <header className="flex h-16 shrink-0 items-center gap-2 px-4 bg-slate-100">
                        <SidebarTrigger className="-m1-1"/>
                    </header>

                    <main className="flex min-h-svh p-6 bg-slate-100">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
            
    )
}