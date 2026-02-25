import OfficeCanvas from '@/components/OfficeCanvas';
import AgentSidebar from '@/components/AgentSidebar';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      {/* Header */}
      <header className="bg-[#161b22] border-b-4 border-[#30363d] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏢</span>
          <h1 className="text-xl font-bold text-white">OpenClaw Office</h1>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-white rounded border-2 border-[#484f58] text-sm">
            ⚙️ Settings
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 p-6 flex items-center justify-center bg-[#0d1117]">
          <OfficeCanvas />
        </div>

        {/* Sidebar */}
        <AgentSidebar />
      </main>

      {/* Footer */}
      <footer className="bg-[#161b22] border-t-4 border-[#30363d] px-6 py-2">
        <div className="text-gray-400 text-sm">
          OpenClaw Office v0.1 · Pixel Art Virtual Secretary
        </div>
      </footer>
    </div>
  );
}
