const cp = require('child_process');
const fs = require('fs');
try {
   const out = cp.execSync('node test-genai-polling.js', { stdio: 'pipe' });
   fs.writeFileSync('debug-out.txt', out.toString());
} catch(e) {
   fs.writeFileSync('debug-out.txt', "STDOUT:\n" + e.stdout.toString() + "\nSTDERR:\n" + e.stderr.toString());
}
