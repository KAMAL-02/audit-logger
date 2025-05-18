const winston = require('winston');
const LokiTransport = require('winston-loki');
require('dotenv').config();

let auditLogger;

function sanitize(input) {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
}

function initAuditLogger({
  service,
  environment,
  lokiHost,
  user,
  apikey,
  labels
}) {
  
  const username = user || process.env.LOKI_USERNAME;
  const password = apikey || process.env.LOKI_API_KEY;

  if (!username || !password) {
    throw new Error('Loki credentials are missing.');
  }

  const finalLokiHost = lokiHost || process.env.LOKI_HOST;

  const graphana_basic_auth = `${username}:${password}`;

  auditLogger = winston.createLogger({
    level: 'info',
    defaultMeta: {
      service: service || 'unknown-service',
      environment: environment || 'development',
    },
    format: winston.format.json(),
    transports: [
      new LokiTransport({
        host: finalLokiHost,
        labels: labels || { job: 'audit-log' },
        json: true,
        batching: true,
        interval: 5,
        basicAuth: graphana_basic_auth,
        replaceTimestamp: true,
        onConnectionError: (err) =>
          console.error('Loki connection error:', err?.message || err?.toString() || 'Unknown error'),
      }),
    ],
    exitOnError: false,
  });
}

function logUserAction(logData) {
  if (!auditLogger) {
    throw new Error('Audit logger not initialized. Call initAuditLogger first.');
  }

  const timestamp = logData.timestamp || new Date().toISOString();
  const source = logData.source || {};
  const sourceIp = source.ip || 'unknown';

  auditLogger.info('User Action', {
    timestamp,
    actor: sanitize(logData.actor),
    action: sanitize(logData.action),
    target: sanitize(logData.target),
    source: { ip: sanitize(sourceIp) },
    metadata: logData.metadata || {},
  });
}

module.exports = {
  initAuditLogger,
  logUserAction,
};
