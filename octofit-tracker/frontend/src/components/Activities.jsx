import { useCollection } from '../api.js';
import ResourceState from './ResourceState.jsx';

function displayName(value) {
  if (value && typeof value === 'object') return value.displayName || value.username || value.name || 'Student';
  return value || 'Student';
}

function activityType(activity) {
  return activity.type || activity.activityType || activity.activity_type || 'activity';
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
}

export default function Activities() {
  const { items, loading, error } = useCollection('activities');
  const state = <ResourceState loading={loading} error={error} items={items} emptyMessage="Logged activities will appear here." />;
  if (loading || error || items.length === 0) return state;

  return (
    <section className="data-panel" aria-label="Recent activities">
      <div className="panel-heading"><div><span className="section-kicker">MOVEMENT LOG</span><h2>Recent activity</h2></div><span className="record-count">{items.length} RECORDS</span></div>
      <div className="table-responsive">
        <table className="tracker-table">
          <thead><tr><th>Student</th><th>Activity</th><th>Team</th><th>Date</th><th>Duration</th><th>Points</th></tr></thead>
          <tbody>{items.map((activity, index) => {
            const type = activityType(activity);
            return (
              <tr key={activity._id || activity.id || activity.seedKey || `${type}-${index}`}>
                <td className="primary-cell">{displayName(activity.user || activity.userName || activity.username)}</td>
                <td><span className={`type-pill type-${String(type).toLowerCase()}`}>{type}</span></td>
                <td>{displayName(activity.team)}</td>
                <td>{formatDate(activity.occurredAt || activity.date || activity.createdAt)}</td>
                <td>{activity.durationMinutes ?? activity.duration_minutes ?? '—'}{activity.durationMinutes || activity.duration_minutes ? ' min' : ''}</td>
                <td className="points-cell">{activity.points ?? 0}<span> pts</span></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </section>
  );
}