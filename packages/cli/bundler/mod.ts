// @skullface/cli/bundler/mod.ts

export class SkullfaceBundler {
  constructor(
    private config: { 
      platform      : "mac" | "windows" | "linux"; 
      appName       : string; 
      appSlug       : string;
      projectRoot   : string;
      targetOptions : any;
    }
  ) {}

  async build () {
    // 1. Build Frontend
    // 2. Compile Backend
    // 3. Call Packer
    const packer = getPacker(this.config.platform);
    await packer.pack(binaryPath, this.config.projectRoot, {
      name    : this.config.appName,
      slug    : this.config.appSlug,
      options : this.config.targetOptions
    });
  }
}
