// Kiểu dữ liệu tối thiểu mà engine.ts (port từ ziwei-doushu, MIT) cần.
export type SiHua = '禄' | '权' | '科' | '忌';

export interface Star {
  name: string;
  type: 'major' | 'minor' | 'lucky' | 'sha';
  siHua?: SiHua;
  brightness?: 'bright' | 'normal' | 'dim';
}

export interface Palace {
  branch: number;
  name: string;
  stars: Star[];
}

export interface ZiweiChart {
  palaces: Palace[];
  mingGongBranch: number;
  shenGongBranch: number;
}
