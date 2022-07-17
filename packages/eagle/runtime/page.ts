export interface Page {
  default: () => JSX.Element;
  PageProps?: () => Record<string, any> | undefined | null;
}
