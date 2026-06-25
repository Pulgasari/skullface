export type LogLevel = "info" | "warn" | "error" | "success" | "debug";

export interface LogGroup {
  log(...args: any[]): void;
  end(): void;
}
