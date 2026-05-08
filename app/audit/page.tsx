import TopBar from "@/components/layout/TopBar"
import SideNav from "@/components/layout/SideNav"
import SpendForm from "@/components/audit/SpendForm"

export const metadata = {
  title: "Audit Your Stack",
}

export default function AuditPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-1 pt-16">
        <SideNav progress={72} />
        <main className="flex-1 md:ml-64 p-4 lg:p-8" id="main-content">
          <div className="max-w-5xl mx-auto">
            <SpendForm />
          </div>
        </main>
      </div>
    </div>
  )
}
