# @kamal-02/audit-logger

A lightweight, secure and very simple audit logging package for Node.js applications, designed to send structured audit logs to Grafana Loki.

## Features

- Simple integration with Winston and Loki
- Standardized audit log format for user actions
- Configurable logging environment and service name

## Installation

```bash
npm install @kamal-02/audit-logger
```

## Setup

1. First, set up your environment variables in a `.env` file (recommended):

```
LOKI_USERNAME=your_loki_username
LOKI_API_KEY=your_loki_api_key
LOKI_HOST=https://your-loki-instance.grafana.net
```

2. Initialize the logger in your application:

```javascript
const { initAuditLogger, logUserAction } = require('@kamal-02/audit-logger');

initAuditLogger({
  service: 'my-service',
  environment: 'production',
  lokiHost: 'https://logs-prod-XXX.grafana.net' || process.env.LOKI_HOST,
  user: 'your_loki_username' || process.env.LOKI_USERNAME,
  apikey: 'your_loki_api_key' || process.env.LOKI_API_KEY,
  labels: { job: 'my-audit-logs' }
});
```

## Usage

```javascript
// Log a user action
logUserAction({
  actor: {
    id: 'user123',
    type: 'user',
    name: 'John Doe'
  },
  action: 'DOCUMENT_UPDATE',
  target: {
    id: 'doc456',
    type: 'document',
    name: 'Important Contract'
  },
  source: {
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0...'
  },
  metadata: {
    changes: ['title', 'content'],
    previousState: 'DRAFT',
    newState: 'PUBLISHED'
  }
});
```

## API Reference

### `initAuditLogger(options)`

Initializes the audit logger with the provided options.

| Parameter   | Type   | Description | Required | Default |
|-------------|--------|-------------|----------|---------|
| service     | string | Service name | No | 'unknown-service' |
| environment | string | Environment name | No | 'development' |
| lokiHost    | string | Grafana Loki host URL | Yes | None |
| user        | string | Loki username | Yes | None |
| apikey      | string | Loki API key | Yes | None |
| labels      | object | Additional Loki labels | No | { job: 'audit-log' } |

### `logUserAction(logData)`

Logs a user action to Loki.

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| actor | object/string | The user or system performing the action | Yes |
| action | string | The action being performed | Yes |
| target | object/string | The resource being acted upon | Yes |
| source | object | Source information (IP, user agent) | No |
| timestamp | string | ISO timestamp | No |
| metadata | object | Additional contextual information | No |

## License

MIT