import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Login from './pages/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import EmployeeTasks from './pages/EmployeeTasks.jsx';
import EmployeeSessions from './pages/EmployeeSessions.jsx';
import HROverview from './pages/HROverview.jsx';
import HRLiveMonitoring from './pages/HRLiveMonitoring.jsx';
import HRControlPanel from './pages/HRControlPanel.jsx';
import HRRecentSessions from './pages/HRRecentSessions.jsx';
import HRReports from './pages/HRReports.jsx';

function Shell() {
  const { user } = useAuth();
  const [page, setPage] = useState('Dashboard');

  if (!user) return <Login />;

  const isHR = user.role === 'hr';

  const renderPage = () => {
    if (isHR) {
      switch (page) {
        case 'Dashboard':       return <HROverview />;
        case 'Live Monitoring': return <HRLiveMonitoring />;
        case 'Control Panel':   return <HRControlPanel />;
        case 'Recent Sessions': return <HRRecentSessions />;
        case 'Reports':         return <HRReports />;
        default:                return <HROverview />;
      }
    }
    switch (page) {
      case 'Dashboard':       return <EmployeeDashboard />;
      case 'My Tasks':        return <EmployeeTasks />;
      case 'Recent Sessions': return <EmployeeSessions />;
      default:                return <EmployeeDashboard />;
    }
  };

  return (
    <div className="bg-canvas min-h-screen flex">
      <Sidebar role={user.role} page={page} setPage={setPage} />
      <main className="flex-1 min-w-0 relative z-10">
        <Topbar page={page} />
        <div className="px-6 lg:px-10 pb-16 max-w-[1380px] mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
