const { initAuditLogger, logUserAction } = require('./index');

try {
  // Initialize the logger
  initAuditLogger({
    service: 'test-service',
    environment: 'test',
    labels: { job: 'test-audit-log' }
  });
  
  // Log a test action
  logUserAction({
    actor: {
      id: 'test-user-12345',
      name: 'Test User'
    },
    action: 'TEST_ACTION',
    target: {
      id: 'test-resource-456',
      type: 'test-resource'
    },
    metadata: {
      test: true,
      timestamp: new Date().toISOString()
    }
  });
  
  console.log('Test completed successfully');
} catch (error) {
  console.error('Test failed:', error);
}