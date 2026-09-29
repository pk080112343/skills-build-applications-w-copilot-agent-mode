import { useCollection } from '../api.js';
import ResourceState from './ResourceState.jsx';

function personName(value) {
  if (value && typeof value === 'object') return value.displayName || value.username || value.name || 'Student';
  return value || 'Student';
}

export default function Leaderboard() {
  const { items, loading, error } = useCollection('leaderboard');
  const state = <ResourceState loading={loading} error={error} items={items} emptyMessage="Leaderboard standings will appear as points are earned." />;
  if (loading || error || items.length === 0) return state;

  const standings = [...items].sort((left, right) => (left.rank ?? Number.MAX_SAFE_INTEGER) - (right.rank ?? Number.MAX_SAFE_INTEGER) || (right.points ?? 0) - (left.points ?? 0));

  return (
    <section className="data-panel" aria-label="Leaderboard standings">
      <div className="panel-heading"><div><span className="section-kicker">MONTHLY STANDINGS</span><h2>Points race</h2></div><span className="record-count">{standings.length} STUDENTS</span></div>
      <div className="table-responsive">
        <table className="tracker-table leaderboard-table">
          <thead><tr><th>Rank</th><th>Student</th><th>Team</th><th>Points</th><th>Period</th></tr></thead>
          <tbody>{standings.map((entry, index) => (
            <tr key={entry._id || entry.id || `${entry.user}-${index}`}>
              <td><span className={`rank-mark${(entry.rank ?? index + 1) <= 3 ? ' rank-top' : ''}`}>{entry.rank ?? index + 1}</span></td>
              <td className="primary-cell">{personName(entry.user || entry.student || entry.username)}</td>
              <td>{personName(entry.team)}</td>
              <td className="points-cell">{entry.points ?? entry.totalPoints ?? 0}<span> pts</span></td>
              <td>{entry.period || entry.month || 'Current'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}