// plugins/logger/frontend.ts

export function log (level, ...args) {
  window.__skullface_logger.log(level, ...args);
}

export function info (...args) {
  window.__skullface_logger.log("info", ...args);
}

export function warn (...args) {
  window.__skullface_logger.log("warn", ...args);
}

export function error (...args) {
  window.__skullface_logger.log("error", ...args);
}

export function success (...args) {
  window.__skullface_logger.log("success", ...args);
}

export function group (label) {
  return window.__skullface_logger.group(label);
}
