// plugins/fs/frontend.ts

export const readText  = (p)    => window.__skullface_fs.readText(p);
export const writeText = (p, t) => window.__skullface_fs.writeText(p, t);
export const readJSON  = (p)    => window.__skullface_fs.readJSON(p);
export const writeJSON = (p, o) => window.__skullface_fs.writeJSON(p, o);
export const exists    = (p)    => window.__skullface_fs.exists(p);
export const copy      = (s, d) => window.__skullface_fs.copy(s, d);
export const remove    = (p)    => window.__skullface_fs.remove(p);
export const mkdir     = (p)    => window.__skullface_fs.mkdir(p);
export const walk      = (p, o) => window.__skullface_fs.walk(p, o);
