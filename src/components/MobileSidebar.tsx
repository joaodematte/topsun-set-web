import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  useDisclosure,
  VStack,
  Text,
  Link as ChakraLink,
  Grid,
  DrawerFooter,
  Avatar,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { HiMenu } from "react-icons/hi";
import { UserContext } from "../context/UserContext";
import { sidebarLinks } from "../utils/sidebarLinks";

const MobileSidebar = () => {
  const { user, signOut } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <>
      <Flex
        display={{ base: "flex", md: "none" }}
        w="full"
        borderBottom="2px"
        borderColor="gray.200"
        p={5}
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading fontWeight="extrabold">SET</Heading>
        <Button colorScheme="gray" onClick={onOpen}>
          <HiMenu size={20} />
        </Button>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading fontWeight="extrabold">SET</Heading>
          </DrawerHeader>

          <DrawerBody>
            <Grid gap={5}>
              {sidebarLinks.map((item, index) => (
                <VStack w="full" key={index}>
                  <Text
                    w="full"
                    fontSize="sm"
                    textTransform="uppercase"
                    fontWeight={600}
                    color="gray.500"
                  >
                    {item.title}
                  </Text>
                  {item.links.map((item, index) =>
                    item.isLogout ? (
                      <Button
                        key={index}
                        w="full"
                        borderRadius={5}
                        px={4}
                        py={2}
                        _hover={{ bg: "red.100", color: "red.600" }}
                        fontWeight={500}
                        color="gray.600"
                        onClick={() => signOut()}
                        justifyContent="flex-start"
                        disabled={item.isDisabled}
                      >
                        <Flex alignItems="center">
                          {item.icon} <Text ml={4}>{item.title}</Text>
                        </Flex>
                      </Button>
                    ) : (
                      <Link href={{ pathname: item.path }} passHref key={index}>
                        <Button
                          w="full"
                          borderRadius={5}
                          px={4}
                          py={2}
                          _hover={{ bg: "gray.200" }}
                          fontWeight={500}
                          color="gray.600"
                          bg={
                            router.pathname === item.path ? "gray.200" : "white"
                          }
                          justifyContent="flex-start"
                          disabled={item.isDisabled}
                        >
                          <Flex alignItems="center">
                            {item.icon} <Text ml={4}>{item.title}</Text>
                          </Flex>
                        </Button>
                      </Link>
                    )
                  )}
                </VStack>
              ))}
            </Grid>
          </DrawerBody>
          <DrawerFooter>
            <Flex w="full" alignItems="center" justifyContent="center">
              <Avatar size="md" name="Dan Abrahmov" src={user?.avatarUrl} />
              <Flex flexDirection="column" ml={5}>
                <Text fontWeight={500} color="gray.400" fontSize="sm">
                  Bem-vindo,
                </Text>
                <Text fontWeight={500} color="gray.600">
                  {user?.fullName}!
                </Text>
              </Flex>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileSidebar;
