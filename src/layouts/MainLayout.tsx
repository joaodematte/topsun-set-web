import { Box, Flex } from "@chakra-ui/react";
import MobileSidebar from "../components/MobileSidebar";
import Sidebar from "../components/Sidebar";

const MainLayout: React.FC = ({ children }) => {
  return (
    <Flex w="full" flexDirection={{ base: "column", md: "row" }}>
      <Sidebar />
      <MobileSidebar />
      <Box
        minH="100vh"
        w="100%"
        px={5}
        py={10}
        bg="gray.100"
        ml={{ base: 0, md: 72 }}
      >
        <Box w={{ base: "100%" }} position="relative">
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default MainLayout;
