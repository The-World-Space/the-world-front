//make child process, use import/export
import { exec } from 'child_process';

const child = exec('apollo service:download --endpoint=http://lunuy.com:3000/graphql graphql-schema.json');

child.stdout?.on('data', (data) => {
    console.log(data);
    }
);

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
