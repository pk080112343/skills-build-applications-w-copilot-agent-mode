export default function ResourceState({ loading, error, items, emptyMessage }) {
  if (loading) {
    return <div className="resource-state" role="status"><span className="loading-mark" />Loading records</div>;
  }

  if (error) {
    return <div className="resource-state resource-error" role="alert"><strong>Could not load this view</strong><span>{error}</span></div>;
  }

  if (items.length === 0) {
    return <div className="resource-state"><strong>Nothing here yet</strong><span>{emptyMessage}</span></div>;
  }

  return null;
}