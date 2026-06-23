export interface Route {
  path: string;
  component: () => void;
  beforeEnter?: () => boolean | Promise<boolean>;
}

export interface RouterAPI {
  addRoute(route: Route): void;
  navigate(path: string): Promise<void>;
  currentPath(): string;
}
