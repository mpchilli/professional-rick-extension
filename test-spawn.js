const { spawn } = require('child_process');
const prompt = 'Test "quoted" prompt with spaces\nand newlines';
const cmdArgs = ['-s', '-y', '--include-directories', '"C:\\Users\\ukchim01\\Downloads\\Ai Tools\\professional-rick-extension"', '-p', `"${prompt.replace(/"/g, '""')}"`];
const command = 'gemini.cmd';
console.log('Spawning:', command);
const proc = spawn(command, cmdArgs, {
    stdio: 'inherit',
    shell: true
});
