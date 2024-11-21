import React, { useCallback, useEffect } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  useColorMode,
  Link,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import ProductsTab from "./ProductsTab";
import StockTab from "./StockTab";
import HistoryTab from "./HistoryTab";
import ActionsTab from "./ActionsTab";
import CustomAlert from "./CustomAlert";
import { IoMoon, IoSunny } from "react-icons/io5";
import { FaGithub } from "react-icons/fa";
import WarehouseTab from "./WarehouseTab";
import reRunDetails from "./reRunDetails";

function App() {

  const [products, setProducts] = React.useState(JSON.parse(localStorage.getItem('products')) || []);
  const [warehouses, setWarehouses] = React.useState(JSON.parse(localStorage.getItem('warehouses')) || [{id: 'warehouse1', name: 'Warehouse 1'}]);
  const [productStockTotal, setProductStockTotal] = React.useState(JSON.parse(localStorage.getItem('productStockTotal')) || {});
  const [productStockDetail, setProductStockDetail] = React.useState(JSON.parse(localStorage.getItem('productStockDetail')) || {});
  const [currentProductDetail, setCurrentProductDetail] = React.useState('');
  
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('warehouses', JSON.stringify(warehouses));
    localStorage.setItem('productStockTotal', JSON.stringify(productStockTotal));
    localStorage.setItem('productStockDetail', JSON.stringify(productStockDetail));
  }, [products, warehouses, productStockTotal, productStockDetail]);

  const props = {
    products, setProducts,
    warehouses, setWarehouses,
    productStockTotal, setProductStockTotal,
    productStockDetail, setProductStockDetail,
    currentProductDetail, setCurrentProductDetail,
    CustomAlert,
  }

  const {colorMode, toggleColorMode} = useColorMode()
  const tabListBg = useColorModeValue("rgb(255, 255, 255)", "rgb(26, 32, 44)");

  return (
    <>
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em" position={'sticky'} top={0} bg={tabListBg} pt={1} zIndex={1}>
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
            <Flex>
              <ProductsTab {...props} />
              <WarehouseTab {...props} />
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default App;
