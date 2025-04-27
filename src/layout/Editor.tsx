import { useState } from "react";
import { Block, BlockType } from "../types";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { EditorBlock } from "./EditorBlock";

const initialBlocks: Block[] = [
  { id: crypto.randomUUID(), type: "paragraph", content: "" },
];

export const Editor = () => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(
    null
  );

  //   const addBlock = (index: number) => {
  //     const newBlocks = [...blocks];
  //     newBlocks.splice(index + 1, 0, {
  //       id: index,
  //       type: "p",
  //       content: "",
  //     });
  //     setBlocks(newBlocks);
  //   };

  const addBlock = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, {
      id: crypto.randomUUID(),
      type: "paragraph",
      content: "",
    });
    setBlocks(newBlocks);
  };

  const changeSelectedBlockType = (type: BlockType) => {
    if (selectedBlockIndex !== null) {
      const updatedBlocks = [...blocks];
      const block = updatedBlocks[selectedBlockIndex];
      updatedBlocks[selectedBlockIndex] = { ...block, type };
      setBlocks(updatedBlocks);
    }
  };

  const blockTypes: { type: BlockType; label: string }[] = [
    { type: "heading1", label: "H1" },
    { type: "heading2", label: "H2" },
    { type: "heading3", label: "H3" },
    { type: "heading4", label: "H4" },
    { type: "heading5", label: "H5" },
    { type: "heading6", label: "H6" },
    { type: "paragraph", label: "P" },
  ];

  const formattingText = [
    { format: "B", shortcut: "Ctrl + B" },
    { format: "I", shortcut: "Ctrl + I" },
    { format: "U", shortcut: "Ctrl + U" },
  ];

  return (
    <Box p={4}>
      <Flex gap={2} mb={4} wrap="wrap" alignItems="center">
        {blockTypes.map(({ type, label }) => (
          <Button
            key={type}
            size="sm"
            variant={
              selectedBlockIndex && blocks[selectedBlockIndex]?.type === type
                ? "solid"
                : "outline"
            }
            onClick={() => changeSelectedBlockType(type)}
            isDisabled={selectedBlockIndex === null}
          >
            {label}
          </Button>
        ))}
        <Center height="50px">
          <Divider orientation="vertical" />
        </Center>
        <Flex gap="1.5rem">
          {formattingText.map(({ format, shortcut }) => (
            <Tooltip key={format} label={shortcut} placement="top">
              <Text fontWeight="bold" padding="0.5rem">
                {format}
              </Text>
            </Tooltip>
          ))}
        </Flex>
      </Flex>

      {blocks.map((block, index) => (
        <EditorBlock
          key={block.id}
          block={block}
          onUpdate={(updatedBlock) => {
            const newBlocks = [...blocks];
            newBlocks[index] = updatedBlock;
            setBlocks(newBlocks);
          }}
          onAddBlock={() => addBlock(index)}
          onFocus={() => setSelectedBlockIndex(index)}
        />
      ))}
    </Box>
  );
};
