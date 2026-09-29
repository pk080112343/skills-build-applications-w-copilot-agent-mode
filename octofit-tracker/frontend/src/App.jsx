import { Navigate, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';
import { API_TARGET_LABEL } from './api.js';
import logo from '../../../docs/octofitapp-small.png';
import './App.css';

const navigation = [
  { path: '/activities', label: 'Activities' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/teams', label: 'Teams' },
  { path: '/users', label: 'Students' },
  { path: '/workouts', label: 'Workouts' },
];

const pageDetails = {
  '/activities': { title: 'Activities', description: 'Recent movement across the OctoFit community.' },
  '/leaderboard': { title: 'Leaderboard', description: "A snapshot of this month's points and progress." },
  '/teams': { title: 'Teams', description: 'Small groups building healthy habits together.' },
  '/users': { title: 'Students', description: 'Student profiles and current point totals.' },
  '/workouts': { title: 'Workouts', description: 'Short, approachable ideas for the next session.' },
};

function AppShell() {
  const { pathname } = useLocation();
  const page = pageDetails[pathname] ?? pageDetails['/activities'];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/activities" aria-label="OctoFit Tracker home">
          <img src={logo} alt="" />
          <span>OctoFit<span className="brand-light">Tracker</span></span>
        </NavLink>
        <div className="nav-caption">Workspace</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item, index) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-index">0{index + 1}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <span className="sidebar-foot-mark" aria-hidden="true">O</span>
          <div><strong>Mergington High</strong><span>Student wellness</span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">OCTOFIT TRACKER <span>/</span> {page.title.toUpperCase()}</div>
            <h1>{page.title}</h1>
          </div>
          <div className="api-target" title="API base URL target">
            <span className="target-dot" />
            <div><span>API target</span><strong>{API_TARGET_LABEL}</strong></div>
          </div>
        </header>
        <div className="content-wrap">
          <div className="page-intro">
            <p>{page.description}</p>
            <span className="current-period">SEPTEMBER 2026</span>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/activities" replace />} />
        <Route path="activities" element={<Activities />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="teams" element={<Teams />} />
        <Route path="users" element={<Users />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="*" element={<Navigate to="/activities" replace />} />
      </Route>
    </Routes>
  );
}