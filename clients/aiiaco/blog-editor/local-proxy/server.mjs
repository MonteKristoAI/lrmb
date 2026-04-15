/**
 * MK Blog Editor - Local Claude Proxy
 *
 * Runs on your machine, bridges the blog editor UI to Claude Code CLI.
 * Uses your Max subscription (no API credits).
 * Has access to all MCP servers, files, and skills.
 *
 * Maintains persistent sessions per post - Claude remembers the full conversation.
 *
 * Start: node local-proxy/server.mjs
 * Runs on: http://localhost:3100
 */

import { spawn } from 'child_process';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PORT = 3100;
const MK_ROOT = join(process.env.HOME, 'Desktop', 'MonteKristo AI');
const CLAUDE_PATH = process.env.CLAUDE_PATH || '/Users/milanmandic/.npm-global/bin/claude';

// Session store: postId -> sessionId
const sessions = new Map();

// Find the actual HTML file path for a post
function findPostFile(clientSlug, postSlug) {
  if (!clientSlug) return null;
  const postsDir = join(MK_ROOT, 'Blog', 'clients', clientSlug, 'posts');
  if (!existsSync(postsDir)) return null;

  // Try exact slug match
  const exactPath = join(postsDir, `${postSlug}.html`);
  if (existsSync(exactPath)) return exactPath;

  // Try with blog prefix (blog17-slug.html pattern)
  try {
    const files = require('fs').readdirSync(postsDir);
    const match = files.find(f => f.endsWith('.html') && f.includes(postSlug));
    if (match) return join(postsDir, match);

    // Try partial slug match
    const partial = files.find(f => f.endsWith('.html') && postSlug.split('-').slice(0, 3).every(w => f.includes(w)));
    if (partial) return join(postsDir, partial);
  } catch {}

  return null;
}

// Build first-message context with file paths (Claude reads them itself)
function buildSystemPrompt(clientSlug, postSlug, sourceFilePath) {
  const parts = [];

  // Core identity and rules
  parts.push(`You are the AI editor inside the MK Blog Editor tool. You help improve blog posts.
You have access to the full MonteKristo AI file system. Use the Read tool to read any file you need.

CRITICAL RULES:
- ZERO em dashes allowed anywhere. Not 1, not 3. ZERO.
- ZERO banned words (delve, tapestry, nuanced, realm, landscape, multifaceted, pivotal, utilize, facilitate, robust, seamless, cutting-edge, transformative, innovative, dynamic, game-changer, revolutionize, crucial, moreover, furthermore, in conclusion, it's worth noting, dive deep, incredibly, extremely, absolutely, truly, significantly, groundbreaking, revolutionary, leverage, streamline, empower, harness, unpack, unravel)
- All REIG Solar internal links must be ABSOLUTE: https://www.reig-us.com/{slug}/
- Readability: Flesch 60+, transitions 30-50%, max 300 words between subheadings
- Every post needs 3+ verified external authority links
- Full anti-AI rules: see ~/Documents/MonteKristo Vault/skills/content-quality.md

When suggesting changes, format as:
REPLACE: \`exact old text\`
WITH: \`exact new text\`
`);

  // Point to files Claude should read (not paste content, let Claude read them)
  parts.push(`\n## FILES YOU SHOULD READ

Before answering any question, read the relevant files below using the Read tool.`);

  // Blog post file
  const postFile = findPostFile(clientSlug, postSlug) || sourceFilePath;
  if (postFile) {
    parts.push(`\n### THE BLOG POST (read this FIRST):
${postFile}
This is the HTML file you are editing. Read it fully before making any suggestions.`);
  }

  // Client config files
  if (clientSlug) {
    const clientDir = join(MK_ROOT, 'Blog', 'clients', clientSlug);
    const configFiles = [
      { file: 'STYLE.md', desc: 'Tone, voice, writing rules for this client' },
      { file: 'BRAND.md', desc: 'Brand positioning, topics, external sources' },
      { file: 'SITEMAP.md', desc: 'All valid internal link URLs (MUST use these for links)' },
      { file: 'FEEDBACK.md', desc: 'Client feedback and corrections' },
      { file: 'LINK-USAGE.md', desc: 'Which internal links are overused/underused' },
      { file: 'EXTERNAL-LINKS.md', desc: 'Verified external authority links' },
      { file: 'IMAGE-LOG.md', desc: 'Previously used images (do not reuse)' },
      { file: 'LINKING-GRAPH.md', desc: 'Hub-spoke internal linking strategy' },
    ];

    parts.push(`\n### CLIENT CONFIG FILES (read as needed):`);
    for (const { file, desc } of configFiles) {
      const path = join(clientDir, file);
      if (existsSync(path)) {
        parts.push(`- ${path} : ${desc}`);
      }
    }
  }

  // System-wide files
  parts.push(`\n### SYSTEM FILES (read as needed):
- ${join(MK_ROOT, 'Blog', 'CLAUDE.md')} : Full blog production pipeline and rules
- ${join(MK_ROOT, 'Blog', 'AUDIT-AND-FIX.md')} : Blog audit checklist (12 checks)
`);

  return parts.join('\n');
}

function handleCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function runClaude(args, cwd) {
  return spawn(CLAUDE_PATH, args, {
    cwd,
    env: {
      ...process.env,
      FORCE_COLOR: '0',
      NO_COLOR: '1',
      PATH: process.env.PATH + ':/usr/local/bin:/Users/milanmandic/.npm-global/bin',
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
}

const server = createServer(async (req, res) => {
  handleCORS(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      mode: 'claude-cli-subscription',
      activeSessions: sessions.size,
    }));
    return;
  }

  // Clear session for a post (start fresh conversation)
  if (req.method === 'POST' && req.url === '/clear') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { postId } = JSON.parse(body);
    if (postId) sessions.delete(postId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ cleared: true }));
    return;
  }

  // Chat endpoint
  if (req.method === 'POST' && req.url === '/chat') {
    let body = '';
    for await (const chunk of req) body += chunk;

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }

    const { message, postId, clientSlug, postSlug, sourceFilePath, postHtml } = parsed;

    if (!message) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Message required' }));
      return;
    }

    // Stream response
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    try {
      const sessionKey = postId || 'default';
      const existingSession = sessions.get(sessionKey);

      let args;

      if (existingSession) {
        // Continue existing conversation - Claude remembers everything
        args = [
          '--print',
          '--dangerously-skip-permissions',
          '--resume', existingSession,
          '--output-format', 'text',
          '-p', message,
        ];
      } else {
        // First message - include file paths for Claude to read
        const systemContext = buildSystemPrompt(clientSlug, postSlug, sourceFilePath);
        const firstMessage = systemContext + '\n\nUser request: ' + message;

        args = [
          '--print',
          '--dangerously-skip-permissions',
          '--model', 'sonnet',
          '--output-format', 'stream-json',
          '-p', firstMessage,
        ];
      }

      const claude = runClaude(args, MK_ROOT);

      let fullResponse = '';
      let sessionId = existingSession;

      claude.stdout.on('data', (data) => {
        const text = data.toString();

        // If stream-json mode (first message), parse for session ID and text
        if (!existingSession) {
          const lines = text.split('\n').filter(l => l.trim());
          for (const line of lines) {
            try {
              const obj = JSON.parse(line);
              // Capture session ID from the first response
              if (obj.session_id && !sessionId) {
                sessionId = obj.session_id;
                sessions.set(sessionKey, sessionId);
              }
              // Extract assistant text
              if (obj.type === 'assistant' && obj.message?.content) {
                for (const block of obj.message.content) {
                  if (block.type === 'text') {
                    fullResponse += block.text;
                    res.write(`data: ${JSON.stringify({ type: 'text', text: block.text })}\n\n`);
                  }
                }
              }
              // Result message type
              if (obj.type === 'result' && obj.result) {
                if (obj.session_id) {
                  sessionId = obj.session_id;
                  sessions.set(sessionKey, sessionId);
                }
              }
            } catch {
              // Not JSON, treat as plain text
              if (line.trim()) {
                fullResponse += line;
                res.write(`data: ${JSON.stringify({ type: 'text', text: line })}\n\n`);
              }
            }
          }
        } else {
          // Resume mode outputs plain text
          fullResponse += text;
          res.write(`data: ${JSON.stringify({ type: 'text', text })}\n\n`);
        }
      });

      claude.stderr.on('data', (data) => {
        const errText = data.toString();
        // Look for session ID in stderr too
        const sessionMatch = errText.match(/session[_\s]*id[:\s]*([a-f0-9-]+)/i);
        if (sessionMatch && !sessionId) {
          sessionId = sessionMatch[1];
          sessions.set(sessionKey, sessionId);
        }
      });

      claude.on('close', (code) => {
        res.write(`data: ${JSON.stringify({
          type: 'done',
          code,
          sessionId: sessionId || null,
          sessionPersisted: sessions.has(sessionKey),
        })}\n\n`);
        res.end();
      });

      claude.on('error', (err) => {
        res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
        res.end();
      });

      req.on('close', () => {
        claude.kill();
      });

    } catch (err) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
      res.end();
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   MK Blog Editor - Local Claude Proxy             ║
║   Running on http://localhost:${PORT}                ║
║   Mode: Claude CLI (Max subscription)             ║
║   Sessions: persistent per post                   ║
║   CWD: ${MK_ROOT.slice(-40).padEnd(40)}  ║
║                                                   ║
║   Keep this running while using the blog editor   ║
╚═══════════════════════════════════════════════════╝
  `);
});
