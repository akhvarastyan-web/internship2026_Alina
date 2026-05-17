export interface HeaderButtonConfig {
  text: string;
  link?: string;
}

export interface HeaderState {
  title: string;
  buttonConfig: HeaderButtonConfig | null;
}
