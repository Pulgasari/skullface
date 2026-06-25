export interface Route {
  name?: string;
  path: string;
  component: (params?: Record<string, string>) => void;
  beforeEnter?: (params?: Record<string, string>) => boolean | Promise<boolean>;
}

export interface RouterAPI {
  addRoute(route: Route): void;
  navigate(path: string): Promise<void>;
  navigateByName(name: string, params?: Record<string, string>): Promise<void>;
  currentPath(): string;
}
