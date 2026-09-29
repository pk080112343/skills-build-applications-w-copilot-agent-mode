# OctoFit Tracker frontend

React 19 presentation tier built with Vite, React Router, and Bootstrap.

## API environment

Set `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` to the Codespaces name, without the protocol or port. For example:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

The frontend then calls `https://<name>-8000.app.github.dev/api/<resource>/`. Restart Vite after changing `.env.local`. If `VITE_CODESPACE_NAME` is unset or blank, requests safely use `http://localhost:8000/api/<resource>/`.

## Run

From the repository root:

```bash
npm --prefix octofit-tracker/frontend run dev -- --host 0.0.0.0 --port 5173
```