import { Box, Flex, Heading } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { Editor } from "./layout/Editor";

function App() {
  return (
    <>
      <Box bgColor="gray.50" boxShadow="lg">
        <Flex padding="1rem">
          <EditIcon width="3rem" height="3rem" />
          <Heading>APIWIZ</Heading>
        </Flex>
      </Box>
      <Box padding="2rem 3rem">
        <Heading color="blue.400">Multi-modal Content Writing Tool</Heading>
      </Box>
      <Editor />
    </>
  );
}

export default App;
