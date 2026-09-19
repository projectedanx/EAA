/**
 * A central logger utility to encapsulate and standardize logging across the application.
 * This ensures that we can control log output, format messages, and potentially
 * send logs to external services in the future without changing scattered console calls.
 */
export const logger = {
  /**
   * Logs an informational message.
   * @param message - The message to log.
   * @param optionalParams - Additional parameters to log.
   */
  info: (message?: any, ...optionalParams: any[]) => {
    console.info(message, ...optionalParams);
  },

  /**
   * Logs a warning message.
   * @param message - The warning message to log.
   * @param optionalParams - Additional parameters to log.
   */
  warn: (message?: any, ...optionalParams: any[]) => {
    console.warn(message, ...optionalParams);
  },

  /**
   * Logs an error message.
   * @param message - The error message to log.
   * @param optionalParams - Additional parameters to log.
   */
  error: (message?: any, ...optionalParams: any[]) => {
    console.error(message, ...optionalParams);
  },

  /**
   * Logs a debug message.
   * @param message - The debug message to log.
   * @param optionalParams - Additional parameters to log.
   */
  debug: (message?: any, ...optionalParams: any[]) => {
    console.debug(message, ...optionalParams);
  },
};
