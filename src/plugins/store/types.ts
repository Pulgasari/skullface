export interface Store {
  load   (): Record<string, any>;
  save   (): void;
  get    (key: string): any;
  set    (key: string, value: any): void;
  delete (key: string): void;
  clear  (): void;
  all    (): Record<string, any>;
}
