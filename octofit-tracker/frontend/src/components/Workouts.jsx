import { useCollection } from '../api.js';
import ResourceState from './ResourceState.jsx';

function workoutType(workout) {
  return workout.type || workout.activityType || workout.activity_type || 'movement';
}

export default function Workouts() {
  const { items, loading, error } = useCollection('workouts');
  const state = <ResourceState loading={loading} error={error} items={items} emptyMessage="Suggested workouts will appear here." />;
  if (loading || error || items.length === 0) return state;

  return (
    <section className="workout-grid" aria-label="Workout suggestions">
      {items.map((workout, index) => {
        const type = workoutType(workout);
        const duration = workout.durationMinutes ?? workout.duration_minutes;
        return (
          <article className="workout-item" key={workout._id || workout.id || workout.slug || workout.title || index}>
            <div className="workout-topline"><span className={`type-pill type-${String(type).toLowerCase()}`}>{type}</span><span className="workout-number">0{index + 1}</span></div>
            <h2>{workout.title || workout.name || 'Workout'}</h2>
            <p>{workout.description || 'A focused session to help build a steady routine.'}</p>
            <div className="workout-meta"><span>{duration ? `${duration} min` : 'Flexible duration'}</span><span>{workout.difficulty || workout.level || 'All levels'}</span></div>
          </article>
        );
      })}
    </section>
  );
}