const { execSync } = require('child_process');

const ORIENTDB_ROOT_PASSWORD = process.env.ORIENTDB_ROOT_PASSWORD;

const command = `cmd /c "set ORIENTDB_ROOT_PASSWORD=${ORIENTDB_ROOT_PASSWORD} && docker-compose up"`;

console.log('Running docker compose with build args...');

execSync(command, { stdio: 'inherit' });
