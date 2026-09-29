import { useCollection } from '../api.js';
import ResourceState from './ResourceState.jsx';

function initials(user) {
  const name = user.displayName || user.display_name || user.name || user.username || '?';
  return name.split(/[\s-]+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export default function Users() {
  const { items, loading, error } = useCollection('users');
  const state = <ResourceState loading={loading} error={error} items={items} emptyMessage="Student profiles will appear here." />;
  if (loading || error || items.length === 0) return state;

  return (
    <section className="data-panel" aria-label="Student directory">
      <div className="panel-heading"><div><span className="section-kicker">PEOPLE</span><h2>Student roster</h2></div><span className="record-count">{items.length} PROFILES</span></div>
      <div className="table-responsive">
        <table className="tracker-table">
          <thead><tr><th>Student</th><th>Username</th><th>Grade</th><th>Points</th></tr></thead>
          <tbody>{items.map((user, index) => (
            <tr key={user._id || user.id || user.username || index}>
              <td><div className="student-name"><span className="student-avatar">{initials(user)}</span><span className="primary-cell">{user.displayName || user.display_name || user.name || user.username || 'Student'}</span></div></td>
              <td>@{user.username || 'student'}</td>
              <td>{user.grade ? `Grade ${user.grade}` : user.gradeLevel || user.grade_level || '-'}</td>
              <td className="points-cell">{user.totalPoints ?? user.total_points ?? 0}<span> pts</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}