import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { SAMPLE_ADDRESS } from '@/lib/sample-data'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar variant="user" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header address={SAMPLE_ADDRESS} title="Member Dashboard" />
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
