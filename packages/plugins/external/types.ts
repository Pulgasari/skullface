export interface LaunchAPI {
  file   (path: string): Promise<void>;
  url     (url: string): Promise<void>;
  reveal (path: string): Promise<void>;
}
