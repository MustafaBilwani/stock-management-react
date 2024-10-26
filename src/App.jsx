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

var index = -1
function App() {

  function coming(){
    var comingQty = document.getElementById('comingQty').value;
    var comingPrice = document.getElementById('comingPrice').value;
    var comingNote = document.getElementById('comingNote').value;
    var comingProduct = document.getElementById('comingProduct').value;
    var comingDate = document.getElementById('comingDate').value;
    
    var isDecimal = comingQty != Math.trunc(comingQty);
    if (comingProduct === '' || comingQty === '' || comingPrice === '' || comingDate == '') {
      alert('Incomplete details'); return false; 
    }
    if (isDecimal || comingPrice < 0 || comingQty < 1) {
      alert('Incorrect details'); return false; 
    }
    index +=1

    var newDetail = {
      coming: parseInt(comingQty),
      price: parseFloat(comingPrice),
      date: comingDate,
      notes: comingNote,
      qty: comingQty,
      id: index
    }
    console.log('index: ' + newDetail.id)

    reRunDetails(comingProduct, newDetail);
  }

  function going(){
    var goingQty = document.getElementById('goingQty').value;
    var goingPrice = document.getElementById('goingPrice').value;
    var goingNote = document.getElementById('goingNote').value;
    var goingProduct = document.getElementById('goingProduct').value;
    var goingDate = document.getElementById('goingDate').value;

    var isDecimal = goingQty != Math.trunc(goingQty);
    
    if (goingProduct === '' || goingPrice === '' || goingQty === '' || goingDate === '') {
      alert('Incomplete details'); 
      return false;
    }
    if (isDecimal || goingQty < 1 || goingPrice < 0) {
      alert('Incorrect details'); 
      return false;
    }
    if (goingQty > productStockTotal[goingProduct]) {
      alert('Not enough stock'); 
      return false;
    }

    var newDetail = {
      going: parseInt(goingQty),
      price: goingPrice,
      date: goingDate,
      notes: goingNote,
      purchasingAmount: '',
    }

    reRunDetails(goingProduct, newDetail);

  }

  function reRunDetails(product, newDetail){
    
    
    var update = [...productStockDetail[product], newDetail]
    var purchasingAmountArray = []

    update.sort(function(a, b){return new Date(a.date) - new Date(b.date)})
    
    var stock = 0
    var status = true
    for (let element of update) {
      stock += element.coming > 0 ? element.coming : -element.going

      if (stock < 0){
        status = false
        alert('not enough stock at that time')
        break;
      }

      if (element.coming > 0){
        debugger;
        element.qty = element.coming
        purchasingAmountArray.push(element.id)
        console.log(purchasingAmountArray)
      } else {
        debugger;
        var remainingQty = element.going
        var totalPrice = 0
        element.purchasingAmount = ''
        
        while(remainingQty > 0){
          let currIndex = update.findIndex(x => x.id == purchasingAmountArray[0])
          let currDetail = update[currIndex]
          let currQty =  Math.min(currDetail.qty, remainingQty)

          element.purchasingAmount += `${currDetail.price} PKR for ${currQty} pieces <br/>`;
          totalPrice += currQty * currDetail.price
          element.profit = (totalPrice / element.going - element.price).toFixed(2)

          currDetail.qty -= currQty
          remainingQty -= currQty

          if(currDetail.qty == 0){
            purchasingAmountArray.splice(0,1)
          }
        
        }
      }
    }

    if(status != false){
      setProductStockDetail(prev => ({
        ...prev,
        [product]: [...update]
      }))

      setProductStockTotal(prevState => ({
        ...prevState,
        [product]: stock
      }));
    }
      
    };

  const [products, setProducts] = React.useState([]);
  const [productStockTotal, setProductStockTotal] = React.useState({});
  const [productStockDetail, setProductStockDetail] = React.useState({});
  const [currentProductDetail, setCurrentProductDetail] = React.useState('');

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
