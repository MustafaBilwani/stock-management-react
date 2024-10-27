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
} from "@chakra-ui/react";
import ProductsTab from "./ProductsTab";
import StockTab from "./StockTab";
import HistoryTab from "./HistoryTab";
import ActionsTab from "./ActionsTab";

function App() {

  const [products, setProducts] = React.useState([]);
  const [productStockTotal, setProductStockTotal] = React.useState({});
  const [productStockDetail, setProductStockDetail] = React.useState({});
  const [currentProductDetail, setCurrentProductDetail] = React.useState('');

  

  return (
    <ChakraProvider>
      <Tabs m={1} isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Actions</Tab>
          <Tab>Stock</Tab>
          <Tab>History</Tab>
          <Tab>Products | Warehouse</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ActionsTab setCurrentProductDetail={setCurrentProductDetail} currentProductDetail={currentProductDetail} products={products} setProducts={setProducts} productStockTotal={productStockTotal} setProductStockTotal={setProductStockTotal} productStockDetail={productStockDetail} setProductStockDetail={setProductStockDetail} />
          </TabPanel>
          
          <TabPanel>
            <StockTab products={products} setProducts={setProducts} productStockTotal={productStockTotal} setProductStockTotal={setProductStockTotal} />
          </TabPanel>

          <TabPanel>
            <HistoryTab setCurrentProductDetail={setCurrentProductDetail} currentProductDetail={currentProductDetail} products={products} setProducts={setProducts} productStockTotal={productStockTotal} setProductStockTotal={setProductStockTotal} productStockDetail={productStockDetail} setProductStockDetail={setProductStockDetail} />
          </TabPanel>

          <TabPanel>
            <ProductsTab setCurrentProductDetail={setCurrentProductDetail} currentProductDetail={currentProductDetail} products={products} setProducts={setProducts} productStockTotal={productStockTotal} setProductStockTotal={setProductStockTotal} productStockDetail={productStockDetail} setProductStockDetail={setProductStockDetail} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}

export default App;
