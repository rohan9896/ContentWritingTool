export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6";

export interface Block {
  id: string;
  type: BlockType;
  content: string;
}
