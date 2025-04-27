import { useState, useRef, useEffect } from "react";
import { Box, Flex, Portal, Text } from "@chakra-ui/react";
import { Block, BlockType } from "../types";

const getBlockStyles = (blockType: BlockType) => {
  const styles = {
    paragraph: { fontSize: "md", fontWeight: "normal" },
    heading1: { fontSize: "2xl", fontWeight: "bold" },
    heading2: { fontSize: "xl", fontWeight: "bold" },
    heading3: { fontSize: "lg", fontWeight: "bold" },
    heading4: { fontSize: "md", fontWeight: "bold" },
    heading5: { fontSize: "sm", fontWeight: "bold" },
    heading6: { fontSize: "xs", fontWeight: "bold" },
  };
  return styles[blockType];
};

const EditorBlock = ({
  block,
  onUpdate,
  onAddBlock,
  onFocus,
}: {
  block: Block;
  onUpdate: (updatedBlock: Block) => void;
  onAddBlock: () => void;
  onFocus: () => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
  const savedSelection = useRef<Range | null>(null);

  const handleInput = () => {
    const content = contentRef.current?.innerHTML || "";
    const isEmpty = !content.replace(/<br>|/g, "").trim();
    setIsPlaceholderVisible(isEmpty);
    onUpdate({ ...block, content });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAddBlock();
    }
    if (
      (e.ctrlKey || e.metaKey) &&
      ["b", "i", "u"].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      document.execCommand(
        e.key.toLowerCase() === "u" ? "underline" : e.key.toLowerCase()
      );
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection?.rangeCount && selection.toString().trim()) {
      savedSelection.current = selection.getRangeAt(0);
      setContextMenuPos({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
    }
  };

  const applyFormatting = (command: string) => {
    const selection = window.getSelection();
    if (savedSelection.current) {
      selection?.removeAllRanges();
      selection?.addRange(savedSelection.current);
      document.execCommand(command);
      handleInput();
      setShowContextMenu(false);
      contentRef.current?.focus();
      savedSelection.current = null;
    }
  };

  useEffect(() => {
    if (contentRef.current && !contentRef.current.innerHTML) {
      contentRef.current.innerHTML = block.content;
    }
  }, []);

  return (
    <Flex gap={2} my={2}>
      <Box position="relative" flex={1}>
        <Box
          ref={contentRef}
          contentEditable
          spellCheck="false"
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onContextMenu={handleContextMenu}
          onFocus={onFocus}
          {...getBlockStyles(block.type)}
          _focus={{ outline: "none" }}
          style={{ minHeight: "1em" }}
        />

        {isPlaceholderVisible && (
          <Text
            position="absolute"
            top={0}
            left={0}
            color="gray.500"
            pointerEvents="none"
            {...getBlockStyles(block.type)}
          >
            Type something...
          </Text>
        )}

        {showContextMenu && (
          <Portal>
            <Box
              position="fixed"
              left={contextMenuPos.x}
              top={contextMenuPos.y}
              bg="white"
              boxShadow="md"
              borderRadius="md"
              zIndex="popover"
              p={2}
              onMouseLeave={() => setShowContextMenu(false)}
            >
              <Box
                px={2}
                py={1}
                _hover={{ bg: "gray.100" }}
                cursor="pointer"
                onClick={() => applyFormatting("bold")}
              >
                Bold (Ctrl + B)
              </Box>
              <Box
                px={2}
                py={1}
                _hover={{ bg: "gray.100" }}
                cursor="pointer"
                onClick={() => applyFormatting("italic")}
              >
                Italic (Ctrl + I)
              </Box>
              <Box
                px={2}
                py={1}
                _hover={{ bg: "gray.100" }}
                cursor="pointer"
                onClick={() => applyFormatting("underline")}
              >
                Underline (Ctrl + U)
              </Box>
            </Box>
          </Portal>
        )}
      </Box>
    </Flex>
  );
};

export { EditorBlock };
