// @skullface/core/types.ts

// :::::: TYPES

export type Platform = 'linux' | 'mac' | 'windows';

// :::::: INTERFACES

export interface SkullfaceConfig {
  plugins? : string[];
  window?  : {
    title?  : string;
    url?    : string;
    width?  : number;
    height? : number;
  };
}
