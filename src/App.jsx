import React from "react";
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
// import WarehouseTab from "./WarehouseTab";

function App() {

  const [products, setProducts] = React.useState([]);
  const [warehouses, setWarehouses] = React.useState([{id: 'warehouse1', name: 'Warehouse 1'}]);
  const [productStockTotal, setProductStockTotal] = React.useState({});
  const [productStockDetail, setProductStockDetail] = React.useState({});
  const [currentProductDetail, setCurrentProductDetail] = React.useState('');

  function reRunDetails(product, update){
    
    var purchasingAmountArray = []
    
    var stock = {total: 0, current: 0, pendingPurchase: 0, pendingSale: 0}

    // take date selected by user or take current date if user hasnt selected
    var date = document.getElementById('stockSortingInput').value ? new Date(document.getElementById('stockSortingInput').value) : new Date() 
          
    for (let element of update) {
      stock.total += element.coming > 0 ? element.coming : -element.going; // add quantity if detail is of coming and substract if detail is of going

      if (stock.total < 0){
        // var update = [...productStockDetail[product]]
        // reRunDetails(product, update)
        return false; // Stop processing if stock is insufficient at that time
      }
      
      element.currentStock = stock.total

      if (element.coming > 0){
        element.qty = element.coming; // element.qty should be restored to default in case qty is subtracted before
        purchasingAmountArray.push(element.id); // push id of detail to use for purchasing amount

        element.status = new Date(element.date) > new Date ? 'pending purchase' : 'received'

        if (new Date(element.date) > date){
          stock.pendingPurchase += element.coming
        } else {
          stock.current += element.coming
        }
        
      } else {
        var remainingQty = element.going
        var totalPrice = 0
        element.purchasingAmount = []

        element.status = new Date(element.date) > new Date ? 'pending sale' : 'sold'

        if (new Date(element.date) > date){
          stock.pendingSale += remainingQty
        } else {
          stock.current -= remainingQty
        } 
        
        // run while loop to add purchasing amount if it is taking purchasing amount from more than 1 details
        while(remainingQty > 0){
          let currIndex = update.findIndex(x => x.id == purchasingAmountArray[0]) // find index in update array (stock detail array)
          let currDetail = update[currIndex]
          let currQty =  Math.min(currDetail.qty, remainingQty) // get least value for purchasing amount

          var purchasingAmountIndex = element.purchasingAmount.findIndex(x => x.price == currDetail.price)
          // add quantity to purchasing amount if that price is present else make new purchasing amount 
          if (purchasingAmountIndex == -1) {
            element.purchasingAmount.push({
              qty: currQty,
              price: currDetail.price
            })
          } else {
            element.purchasingAmount[purchasingAmountIndex].qty += currQty
          }
          
          totalPrice += currQty * currDetail.price
          element.profit = (  element.price - totalPrice / element.going ).toFixed(2)

          currDetail.qty -= currQty
          remainingQty -= currQty

          if(currDetail.qty == 0){
            purchasingAmountArray.shift() // delete id from purchasingAmountArray if its quantity is used
          }
        
        }
      }
    }

    // update data if there was no error
    setProductStockDetail(prev => ({
      ...prev,
      [product]: [...update]
    }))

    setProductStockTotal(prevState => ({
      ...prevState,
      [product]: {...stock}
    }));
      
  };

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
            <ActionsTab {...props} reRunDetails={reRunDetails} />
          </TabPanel>
          
          <TabPanel>
            <StockTab {...props} />
          </TabPanel>

          <TabPanel>
            <HistoryTab {...props} reRunDetails={reRunDetails} />
          </TabPanel>

          <TabPanel>
            <Flex>
              <ProductsTab {...props} />
              {/* <WarehouseTab {...props} /> */}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default App;
