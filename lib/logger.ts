/**
 * @file lib/logger.ts
 * @description Centralized debug logger for StackAudit.
 *
 * Usage:
 *   const log = createLogger("useAuditForm")
 *   log.info("Form loaded", { teamSize })
 *   log.warn("localStorage parse failed", err)
 *   log.error("API call failed", err)
 *
 * In production (NODE_ENV === "production"), all output is suppressed.
 * In development, every line is prefixed with [StackAudit/<module>]
 * so you can instantly find the source of any log in DevTools.
 */

const IS_DEV = process.env.NODE_ENV !== "production"

export interface Logger {
  info:  (msg: string, data?: unknown) => void
  warn:  (msg: string, data?: unknown) => void
  error: (msg: string, data?: unknown) => void
}

/**
 * Create a scoped logger for a specific module.
 *
 * @param module - Short name shown in the prefix, e.g. "useAuditForm", "auditEngine"
 * @returns Logger object with info / warn / error methods
 */
export function createLogger(module: string): Logger {
  const prefix = `[StackAudit/${module}]`

  return {
    info(msg, data) {
      if (!IS_DEV) return
      data !== undefined
        ? console.info(`${prefix} ℹ ${msg}`, data)
        : console.info(`${prefix} ℹ ${msg}`)
    },
    warn(msg, data) {
      if (!IS_DEV) return
      data !== undefined
        ? console.warn(`${prefix} ⚠ ${msg}`, data)
        : console.warn(`${prefix} ⚠ ${msg}`)
    },
    error(msg, data) {
      if (!IS_DEV) return
      data !== undefined
        ? console.error(`${prefix} ✖ ${msg}`, data)
        : console.error(`${prefix} ✖ ${msg}`)
    },
  }
}
