// executable-wrapper.js - Create local executable wrapper

import { writeFile, chmod } from 'fs/promises';
import { platform } from 'os';

export async function createLocalExecutable(workingDir, dryRun = false) {
  try {
    if (platform() === 'win32') {
      // Create Windows batch file
      const wrapperScript = `@echo off
REM Claude-Flow local wrapper
REM This script ensures cortex-agent runs from your project directory

set PROJECT_DIR=%CD%
set PWD=%PROJECT_DIR%
set CLAUDE_WORKING_DIR=%PROJECT_DIR%

REM Try to find cortex-agent binary
REM Check common locations for npm/npx installations

REM 1. Local node_modules (npm install cortex-agent)
if exist "%PROJECT_DIR%\\node_modules\\.bin\\cortex-agent.cmd" (
  cd /d "%PROJECT_DIR%"
  "%PROJECT_DIR%\\node_modules\\.bin\\cortex-agent.cmd" %*
  exit /b %ERRORLEVEL%
)

REM 2. Parent directory node_modules (monorepo setup)
if exist "%PROJECT_DIR%\\..\\node_modules\\.bin\\cortex-agent.cmd" (
  cd /d "%PROJECT_DIR%"
  "%PROJECT_DIR%\\..\\node_modules\\.bin\\cortex-agent.cmd" %*
  exit /b %ERRORLEVEL%
)

REM 3. Global installation (npm install -g cortex-agent)
where cortex-agent >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  cd /d "%PROJECT_DIR%"
  cortex-agent %*
  exit /b %ERRORLEVEL%
)

REM 4. Fallback to npx (will download if needed)
cd /d "%PROJECT_DIR%"
npx cortex-agent@latest %*
`;

      // Write the Windows batch file
      if (!dryRun) {
        await writeFile(`${workingDir}/cortex-agent.cmd`, wrapperScript, 'utf8');
        console.log('  ✓ Created local cortex-agent.cmd executable wrapper');
        console.log('    You can now use: cortex-agent instead of npx cortex-agent@alpha');
      }
    } else {
      // Check if we're in development mode (claude-code-flow repo)
      const isDevelopment = workingDir.includes('claude-code-flow');
      const devBinPath = isDevelopment
        ? workingDir.split('claude-code-flow')[0] + 'claude-code-flow/bin/cortex-agent'
        : '';

      // Create Unix/Linux/Mac shell script
      const wrapperScript = `#!/usr/bin/env bash
# Claude-Flow local wrapper
# This script ensures cortex-agent runs from your project directory

# Save the current directory
PROJECT_DIR="\${PWD}"

# Set environment to ensure correct working directory
export PWD="\${PROJECT_DIR}"
export CLAUDE_WORKING_DIR="\${PROJECT_DIR}"

# Try to find cortex-agent binary
# Check common locations for npm/npx installations

${
  isDevelopment
    ? `# Development mode - use local bin
if [ -f "${devBinPath}" ]; then
  cd "\${PROJECT_DIR}"
  exec "${devBinPath}" "$@"
fi

`
    : ''
}# 1. Local node_modules (npm install cortex-agent)
if [ -f "\${PROJECT_DIR}/node_modules/.bin/cortex-agent" ]; then
  cd "\${PROJECT_DIR}"
  exec "\${PROJECT_DIR}/node_modules/.bin/cortex-agent" "$@"

# 2. Parent directory node_modules (monorepo setup)
elif [ -f "\${PROJECT_DIR}/../node_modules/.bin/cortex-agent" ]; then
  cd "\${PROJECT_DIR}"
  exec "\${PROJECT_DIR}/../node_modules/.bin/cortex-agent" "$@"

# 3. Global installation (npm install -g cortex-agent)
elif command -v cortex-agent &> /dev/null; then
  cd "\${PROJECT_DIR}"
  exec cortex-agent "$@"

# 4. Fallback to npx (will download if needed)
else
  cd "\${PROJECT_DIR}"
  exec npx cortex-agent@latest "$@"
fi
`;

      // Write the wrapper script
      if (!dryRun) {
        await writeFile(`${workingDir}/cortex-agent`, wrapperScript, 'utf8');

        // Make it executable
        await chmod(`${workingDir}/cortex-agent`, 0o755);

        console.log('  ✓ Created local cortex-agent executable wrapper');
        console.log('    You can now use: ./cortex-agent instead of npx cortex-agent@alpha');
      }
    }
  } catch (err) {
    console.log(`  ⚠️  Could not create local executable: ${err.message}`);
  }
}
