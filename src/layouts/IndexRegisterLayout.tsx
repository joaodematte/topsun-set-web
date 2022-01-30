import { Flex } from "@chakra-ui/react";

const IndexRegisterLayout: React.FC = ({ children }) => {
  return (
    <Flex h="100vh" w="full" justifyContent="center" alignItems="center" p={5}>
      {children}
    </Flex>
  );
};

export default IndexRegisterLayout;
