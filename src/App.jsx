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

function App() {

  function coming(){
    var comingQty = document.getElementById('comingQty').value;
    var comingPrice = document.getElementById('comingPrice').value;
    var comingNote = document.getElementById('comingNote').value;
    var comingProduct = document.getElementById('comingProduct').value;
    var comingDate = document.getElementById('comingDate').value;
    
    var isDecimal = comingQty != Math.trunc(comingQty);
    if (comingProduct === '' || comingQty === '' || comingPrice === '') {
        alert('Incomplete details'); return false; 
    }
    if (isDecimal || comingPrice < 1 || comingQty < 1) {
        alert('Incorrect details'); return false; 
    }

    
    setProductStockTotal(prevState => ({
      ...prevState,
      [comingProduct]: (parseInt(prevState[comingProduct]) + parseInt(comingQty))
    }));


  }

  function going(){
    var goingQty = document.getElementById('goingQty').value;
    var goingPrice = document.getElementById('goingPrice').value;
    var goingNote = document.getElementById('goingNote').value;
    var goingProduct = document.getElementById('goingProduct').value;
    var goingDate = document.getElementById('goingDate').value;

    var isDecimal = goingQty != Math.trunc(goingQty);
    
    if (goingProduct === '' || goingQty === '') {
        alert('Incomplete details'); 
        return false;
    }
    if (isDecimal || goingQty < 1) {
        alert('Incorrect details'); 
        return false;
    }
    if (goingQty > productStockTotal[goingProduct]) {
        alert('Not enough stock'); 
        return false;
    }

    setProductStockTotal(prevState => ({
      ...prevState,
      [goingProduct]: (parseInt(prevState[goingProduct]) - parseInt(goingQty))
    }));

  }

  const [products, setProducts] = React.useState([]);
  const [productStockTotal, setProductStockTotal] = React.useState({});

  const renderForm = (type, title, handleAction) => (
    <VStack
      spacing={2}
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      alignItems="flex-start"
      w="100%"
      maxW="600px"
    >
      <Text fontWeight="bold" fontSize="lg">{title}</Text>

      <Text>Quantity:</Text>
      <Input type="number" id={`${type}Qty`} />

      <Text>Price:</Text>
      <Input type="number" id={`${type}Price`} />

      <Text>Product:</Text>
      <Select id={`${type}Product`} defaultValue="">
        <option value='' disabled hidden>Select an option</option>
        {products.map((x, index) => {
          return(
            <option value={x} >{x}</option> 
          )
        })}
      </Select>

      <Text>Note:</Text>
      <Input type="text" id={`${type}Note`} />

      <Text>Date:</Text>
      <Input type="date" id={`${type}Date`} defaultValue={new Date().toISOString().split('T')[0]}/>

      <Button colorScheme="blue" onClick={handleAction}>
        Submit
      </Button>
    </VStack>
  );

  return (
    <ChakraProvider>
      <Tabs m={1} isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Actions</Tab>
          <Tab>Stock</Tab>
          <Tab>History</Tab>
          <Tab>Products</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <HStack spacing={10} justify="center">
              {renderForm("coming", "Coming", coming)}
              {renderForm("going", "Going", going)}
            </HStack>
          </TabPanel>
          
          <TabPanel>
            <StockTab products={products} setProducts={setProducts} productStockTotal={productStockTotal} setProductStockTotal={setProductStockTotal} />
          </TabPanel>

          <TabPanel>
            
          </TabPanel>

          <TabPanel>
            <ProductsTab products={products} setProducts={setProducts} productStockTotal={productStockTotal} setProductStockTotal={setProductStockTotal} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}

export default App;
