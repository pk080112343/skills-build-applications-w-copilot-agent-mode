import { useEffect, useState } from 'react';

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
const apiOrigin = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

export const API_BASE_URL = `${apiOrigin}/api`;
export const API_TARGET_LABEL = codespaceName ? `${codespaceName}-8000` : 'localhost:8000';

export function normalizeCollection(payload, resource) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const candidates = [payload.results, payload.data, payload.items, payload[resource]];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && Array.isArray(candidate.results)) return candidate.results;
  }
  return [];
}

export function useCollection(resource) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadCollection() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/${resource}/`, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const payload = await response.json();
        setItems(normalizeCollection(payload, resource));
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Unable to load records.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadCollection();
    return () => controller.abort();
  }, [resource]);

  return { items, loading, error };
}