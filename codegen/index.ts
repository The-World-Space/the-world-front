//make child process, use import/export
import { exec } from 'child_process';
import { API_URL } from '../src/constants/apolloClient';

function execAsync(cmd: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const child = exec(cmd);
    
        child.stdout?.on('data', (data) => {
            console.log(data);
        });
    
        child.stderr?.on('data', (data) => {
            console.log(data);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject();
            }
        });
    });
}

async function main() {
    await execAsync(`apollo service:download --endpoint=${API_URL} graphql-schema.json`);
    await execAsync(`apollo codegen:generate --localSchemaFile=graphql-schema.json --target=typescript --tagName=gql`);
}

main();
