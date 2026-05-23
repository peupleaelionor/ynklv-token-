#!/usr/bin/env node
/**
 * YNKLV one-time setup bootstrap.
 *
 * - Verifies tool versions (node, pnpm, forge)
 * - Ensures a .env exists
 * - Installs Foundry dependencies for the contracts package (if forge present)
 *
 * Safe to run repeatedly. Network access is required only for the forge step.
 */

import { execSync } from 'node:child_process'
import { existsSync, copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function log(msg) {
  process.stdout.write(`[33m▸[0m ${msg}\n`)
}
function ok(msg) {
  process.stdout.write(`[32m✓[0m ${msg}\n`)
}
function warn(msg) {
  process.stdout.write(`[31m![0m ${msg}\n`)
}

function has(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

log('YNKLV setup — checking toolchain')

const nodeMajor = Number(process.versions.node.split('.')[0])
if (nodeMajor < 20) warn(`Node ${process.versions.node} detected; >= 20 recommended.`)
else ok(`Node ${process.versions.node}`)

if (has('pnpm')) ok('pnpm present')
else warn('pnpm not found — enable with `corepack enable`.')

// Ensure .env
const envPath = resolve(root, '.env')
const examplePath = resolve(root, '.env.example')
if (!existsSync(envPath) && existsSync(examplePath)) {
  copyFileSync(examplePath, envPath)
  ok('Created .env from .env.example')
} else if (existsSync(envPath)) {
  ok('.env already present')
}

// Foundry deps
if (has('forge')) {
  ok('Foundry present')
  try {
    log('Installing contract dependencies (OpenZeppelin, forge-std)')
    execSync(
      'forge install OpenZeppelin/openzeppelin-contracts foundry-rs/forge-std --no-commit',
      { cwd: resolve(root, 'packages/contracts'), stdio: 'inherit' },
    )
    ok('Contract dependencies installed')
  } catch {
    warn('forge install failed (network?). Run it manually in packages/contracts.')
  }
} else {
  warn('Foundry not found — install from https://book.getfoundry.sh to build contracts.')
}

ok('Setup complete. Next: `pnpm dev`')
