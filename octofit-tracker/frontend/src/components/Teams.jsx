import { useCollection } from '../api.js';
import ResourceState from './ResourceState.jsx';

export default function Teams() {
  const { items, loading, error } = useCollection('teams');
  const state = <ResourceState loading={loading} error={error} items={items} emptyMessage="Teams will show up once students join a group." />;
  if (loading || error || items.length === 0) return state;

  return (
    <section className="data-panel" aria-label="OctoFit teams">
      <div className="panel-heading"><div><span className="section-kicker">GROUPS</span><h2>Team directory</h2></div><span className="record-count">{items.length} TEAMS</span></div>
      <div className="team-list">{items.map((team, index) => {
        const members = Array.isArray(team.members) ? team.members : Array.isArray(team.users) ? team.users : [];
        return (
          <article className="team-row" key={team._id || team.id || team.slug || team.name || index}>
            <span className={`team-number team-number-${index % 3}`}>0{index + 1}</span>
            <div className="team-copy"><h3>{team.name || team.title || 'Team'}</h3><p>{team.description || 'A group working toward consistent movement.'}</p></div>
            <div className="team-members"><strong>{team.memberCount ?? team.member_count ?? members.length}</strong><span>members</span></div>
            <span className="team-arrow" aria-hidden="true">&gt;</span>
          </article>
        );
      })}</div>
    </section>
  );
}