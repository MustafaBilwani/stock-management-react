import React, {useState} from "react";
import {
  ChakraProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Input,
  Select,
  Button,
  Text,
  useColorMode,
  Link,
} from "@chakra-ui/react";
import ProductsTab from "./ProductsTab";
import StockTab from "./StockTab";
import HistoryTab from "./HistoryTab";
import ActionsTab from "./ActionsTab";
import { IoMoon, IoSunny } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";

function App() {

  const [products, setProducts] = React.useState([]);
  const [productStockTotal, setProductStockTotal] = React.useState({});
  const [productStockDetail, setProductStockDetail] = React.useState({});
  const [currentProductDetail, setCurrentProductDetail] = React.useState('');

  const props = {
    products, setProducts, productStockTotal, setProductStockTotal, productStockDetail, setProductStockDetail, currentProductDetail, setCurrentProductDetail
  }

  const {colorMode, toggleColorMode} = useColorMode()

  return (
    <>
      <Tabs m={1} isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Actions</Tab>
          <Tab>Stock</Tab>
          <Tab>History</Tab>
          <Tab>Products | Warehouse</Tab>
          <Button onClick={toggleColorMode} bg={"transparent"} >{colorMode === 'light' ? <IoMoon size={25} /> : <IoSunny size={25} />}</Button>
          <Link href="https://github.com/MustafaBilwani/stock-management-react" bg={"transparent"} isExternal>
            <Button bg={"transparent"}><FaGithub size={25} /></Button>
          </Link>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ActionsTab {...props} />
          </TabPanel>
          
          <TabPanel>
            <StockTab {...props} />
          </TabPanel>

          <TabPanel>
            <HistoryTab {...props} />
          </TabPanel>

          <TabPanel>
            <ProductsTab {...props} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default App;
