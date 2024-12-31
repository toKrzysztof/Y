const { execSync } = require('child_process');

const ORIENTDB_ROOT_PASSWORD = 'tcRswTJEA4FGz2aDTxnMca';

const command = `cmd /c "set ORIENTDB_ROOT_PASSWORD=${ORIENTDB_ROOT_PASSWORD} && docker-compose up`;

console.log(command);

execSync(command, { stdio: 'inherit' });
