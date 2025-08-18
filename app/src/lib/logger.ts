export class Logger {
  static info(message: string, meta?: any) {
    console.log(`[INFO] ${message}`, meta ?? "");
  }

  static warn(message: string, meta?: any) {
    console.warn(`[WARN] ${message}`, meta ?? "");
  }

  static error(message: string, meta?: any) {
    console.error(`[ERROR] ${message}`, meta ?? "");
  }
}
