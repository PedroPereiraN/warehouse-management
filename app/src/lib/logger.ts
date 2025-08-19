export class Logger {
  private static getTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace("T", " ").split(".")[0];
    // Example: 2025-08-19 12:34:56
  }

  static info(message: string, meta?: unknown) {
    console.log(
      `\x1b[32m${this.getTimestamp()} [INFO]\x1b[0m ${message}`,
      meta ?? "",
    );
  }

  static warn(message: string, meta?: unknown) {
    console.warn(
      `\x1b[93m${this.getTimestamp()} [WARN]\x1b[0m ${message}`,
      meta ?? "",
    );
  }

  static error(message: string, meta?: unknown) {
    console.error(
      `\x1b[31m${this.getTimestamp()} [ERROR]\x1b[0m ${message}`,
      meta ?? "",
    );
  }
}
