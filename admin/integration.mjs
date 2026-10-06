// LOCAL ADMIN: an Astro integration that exists only in `astro dev`.
// It adds the /admin page and a small JSON API that edits files on this PC.
// Production builds never include it. Localhost-only: requests from other hosts are refused.
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { renderConfig } from './config-writer.mjs';

const run = promisify(execFile);
const ROOT = fileURLToPath(new URL('../', import.meta.url));
const PROJECTS = path.join(ROOT, 'src/content/projects');
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_BODY = 20 * 1024 * 1024; // 20 MB, enough for a photo

export default function devAdmin() {
  return {
    name: 'local-admin',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev') return; // not in production builds
        injectRoute({
          pattern: '/admin',
          entrypoint: fileURLToPath(new URL('./page.astro', import.meta.url)),
        });
      },
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/__admin/api/')) return next();
          if (!isLocal(req.headers.host)) return send(res, 403, { error: 'Local access only.' });
          try {
            const route = req.url.split('?')[0].replace('/__admin/api/', '');
            if (req.method === 'GET' && route === 'state') return send(res, 200, await readState(server));
            if (req.method !== 'POST') return send(res, 405, { error: 'Use POST.' });
            const body = await readJson(req);
            if (route === 'config') {
              await writeConfig(body.config);
              server.moduleGraph.invalidateAll();
              return send(res, 200, { ok: true });
            }
            if (route === 'project') return send(res, 200, await saveProject(body));
            if (route === 'upload') return send(res, 200, await upload(body));
            if (route === 'publish') return send(res, 200, await publish(body.message));
            return send(res, 404, { error: 'Unknown route.' });
          } catch (err) {
            return send(res, 400, { error: err.message });
          }
        });
      },
    },
  };
}

// ---- helpers ---------------------------------------------------------------

const isLocal = (host = '') => /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) reject(new Error('Upload too large (max 20 MB).'));
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { reject(new Error('Bad JSON.')); }
    });
    req.on('error', reject);
  });
}

function parseMd(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: text };
  return { data: YAML.parse(m[1]) ?? {}, body: text.slice(m[0].length) };
}

const exists = (p) => fs.access(p).then(() => true, () => false);

// ---- read ------------------------------------------------------------------

async function readState(server) {
  const mod = await server.ssrLoadModule('/src/site.config.ts');
  const config = JSON.parse(JSON.stringify(mod.siteConfig));

  const contentSrc = await fs.readFile(path.join(ROOT, 'src/content.config.ts'), 'utf8');
  const tagBlock = contentSrc.match(/TAGS = \[([^\]]*)\]/)?.[1] ?? '';
  const tags = [...tagBlock.matchAll(/'([^']+)'/g)].map((m) => m[1]);

  const projects = [];
  for (const slug of (await fs.readdir(PROJECTS)).sort()) {
    const file = path.join(PROJECTS, slug, 'index.md');
    if (!(await exists(file))) continue;
    const { data, body } = parseMd(await fs.readFile(file, 'utf8'));
    const files = await fs.readdir(path.join(PROJECTS, slug));
    projects.push({
      slug,
      data,
      body,
      images: files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f)),
    });
  }
  projects.sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)));
  return { config, tags, projects };
}

// ---- write: config ---------------------------------------------------------

async function writeConfig(config) {
  if (!config || !config.features) throw new Error('Config is missing.');
  if (!config.name?.trim()) throw new Error('Site name cannot be empty.');
  if (!['dark', 'light'].includes(config.defaultTheme)) throw new Error('Default theme must be dark or light.');
  if (!['live', 'maintenance'].includes(config.siteStatus)) throw new Error('Site status must be live or maintenance.');
  const pinned = config.pinnedProjects ?? [];
  if (pinned.length > 6) throw new Error('Pinned projects: maximum 6.');
  await fs.writeFile(path.join(ROOT, 'src/site.config.ts'), renderConfig(config), 'utf8');
}

// ---- write: projects -------------------------------------------------------

async function saveProject({ slug, isNew, data, body }) {
  if (!SLUG.test(slug || '')) throw new Error('Folder name must be lowercase letters, numbers and dashes.');
  const dir = path.join(PROJECTS, slug);
  const file = path.join(dir, 'index.md');
  if (isNew) {
    if (await exists(file)) throw new Error(`A project called "${slug}" already exists.`);
    await fs.mkdir(dir, { recursive: true });
  } else if (!(await exists(file))) {
    throw new Error(`Project "${slug}" not found.`);
  }

  // Same rules as src/content.config.ts, so a save never breaks the build.
  const d = data;
  if (!d.title?.trim() || d.title.length > 80) throw new Error('Title is required (max 80 characters).');
  if (!d.summary?.trim() || d.summary.length > 160) throw new Error('Summary is required (max 160 characters).');
  if (!d.date) throw new Error('Date is required.');
  if (!Array.isArray(d.tags) || d.tags.length === 0) throw new Error('Pick at least one tag.');
  if (!['draft', 'published'].includes(d.status)) throw new Error('Status must be draft or published.');
  if (!d.coverAlt || d.coverAlt.length < 5) throw new Error('Cover description (alt text) must be at least 5 characters.');
  const coverFile = d.cover?.replace(/^\.\//, '');
  if (!coverFile || !(await exists(path.join(dir, coverFile)))) throw new Error('Upload a cover picture first.');
  for (const l of d.links ?? []) {
    if (!/^https?:\/\//.test(l.url)) throw new Error(`Link "${l.label}" must start with http:// or https://`);
  }

  const front = {
    title: d.title.trim(),
    date: d.date,
    ...(d.updated ? { updated: d.updated } : {}),
    summary: d.summary.trim(),
    tags: d.tags,
    status: d.status,
    cover: d.cover,
    coverAlt: d.coverAlt.trim(),
    links: d.links ?? [],
  };
  const text = `---\n${YAML.stringify(front, { lineWidth: 0 })}---\n\n${(body ?? '').trim()}\n`;
  await fs.writeFile(file, text, 'utf8');
  return { ok: true, slug };
}

// ---- write: uploads --------------------------------------------------------

async function upload({ target, slug, filename, base64 }) {
  const buf = Buffer.from(base64 || '', 'base64');
  if (!buf.length) throw new Error('The file is empty.');
  const ext = path.extname(filename || '').toLowerCase();
  const isImg = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);

  if (target === 'portrait') {
    if (!['.jpg', '.jpeg'].includes(ext)) throw new Error('The portrait must be a .jpg file.');
    const p = path.join(ROOT, 'src/assets/about/portrait.jpg');
    await fs.writeFile(p, buf);
    return { ok: true, url: '/src/assets/about/portrait.jpg?v=' + Date.now() };
  }

  if (target === 'cv-en' || target === 'cv-no') {
    if (ext !== '.pdf') throw new Error('The CV must be a .pdf file.');
    const name = target === 'cv-en' ? 'cv-en.pdf' : 'cv-no.pdf';
    await fs.writeFile(path.join(ROOT, 'public/files', name), buf);
    return { ok: true, url: `/files/${name}?v=${Date.now()}` };
  }

  if (!SLUG.test(slug || '')) throw new Error('Set a folder name for the project first.');
  if (!isImg) throw new Error('Pictures must be .jpg, .png or .webp.');
  const dir = path.join(PROJECTS, slug);
  await fs.mkdir(dir, { recursive: true });

  if (target === 'cover') {
    // One cover per project: remove older cover.* files so only one remains.
    for (const f of await fs.readdir(dir)) if (/^cover\.(jpe?g|png|webp)$/i.test(f)) await fs.unlink(path.join(dir, f));
    const name = `cover${ext}`;
    await fs.writeFile(path.join(dir, name), buf);
    return { ok: true, file: `./${name}`, url: `/src/content/projects/${slug}/${name}?v=${Date.now()}` };
  }

  if (target === 'image') {
    // Pictures inside the post body: photo-1.jpg, photo-2.jpg, ...
    const existing = await fs.readdir(dir);
    let n = 1;
    while (existing.includes(`photo-${n}${ext}`)) n++;
    const name = `photo-${n}${ext}`;
    await fs.writeFile(path.join(dir, name), buf);
    return {
      ok: true,
      file: `./${name}`,
      url: `/src/content/projects/${slug}/${name}?v=${Date.now()}`,
      markdown: `![Describe this picture](./${name})`,
    };
  }

  throw new Error('Unknown upload target.');
}

// ---- publish ---------------------------------------------------------------

async function publish(message) {
  const status = await run('git', ['status', '--porcelain'], { cwd: ROOT });
  if (!status.stdout.trim()) return { ok: true, published: false, output: 'Nothing changed. Nothing to publish.' };
  await run('git', ['add', '-A'], { cwd: ROOT });
  const msg = (message || '').trim() || 'Update site content';
  await run('git', ['commit', '-m', msg], { cwd: ROOT });
  const push = await run('git', ['push', 'origin', 'main'], { cwd: ROOT });
  return { ok: true, published: true, output: (push.stdout + push.stderr).trim() };
}
