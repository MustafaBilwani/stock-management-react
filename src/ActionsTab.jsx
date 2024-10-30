import { Button, HStack, Input, Select, Text, VStack } from "@chakra-ui/react";
import React from "react";

function ActionsTab ({products, productStockDetail, productStockTotal, setCurrentProductDetail, currentProductDetail, setProductStockDetail, setProductStockTotal}){
  const [index, setIndex] = React.useState(0)

  function coming(){
    var comingQty = document.getElementById('comingQty').value;
    var comingPrice = document.getElementById('comingPrice').value;
    var comingNote = document.getElementById('comingNote').value;
    var comingProduct = document.getElementById('comingProduct').value;
    var comingDate = document.getElementById('comingDate').value;
    
    if (!comingProduct || !comingQty || !comingPrice || !comingDate) {
      alert('Incomplete details'); return false; 
    }
    if (comingQty < 1 || comingPrice < 1 || comingQty != Math.trunc(comingQty)) {
      alert('Incorrect details'); return false; 
    }
    
    var newDetail = {
      coming: parseInt(comingQty),
      price: parseFloat(comingPrice),
      date: comingDate,
      notes: comingNote,
      qty: comingQty,
      id: index
    }
    
    document.getElementById('comingForm').reset();
    setIndex(prev => prev + 1);

    reRunDetails(comingProduct, newDetail); // pass newDetail to reRunDetails to sort and check stock according to date
  }

  function going(){
    var goingQty = document.getElementById('goingQty').value;
    var goingPrice = document.getElementById('goingPrice').value;
    var goingNote = document.getElementById('goingNote').value;
    var goingProduct = document.getElementById('goingProduct').value;
    var goingDate = document.getElementById('goingDate').value;
    
    if (!goingProduct || !goingPrice || !goingQty || !goingDate) {
      alert('Incomplete details'); 
      return false;
    }

    if (goingQty < 1 || goingPrice < 1 || goingQty != Math.trunc(goingQty)) {
      alert('Incorrect details'); 
      return false;
    }

    if (goingQty > productStockTotal[goingProduct].total) {
      alert('Not enough stock'); 
      return false;
    }

    var newDetail = {
      going: parseInt(goingQty),
      price: goingPrice,
      date: goingDate,
      notes: goingNote,
    }

    document.getElementById('goingForm').reset();

    reRunDetails(goingProduct, newDetail); // pass newDetail to reRunDetails to sort and check stock according to date

  }

  function reRunDetails(product, newDetail){
    
    // pass Product Stock Detail and New Detail to variable to process it
    // new variable to keep old value reserve 
    var update = [...productStockDetail[product], newDetail].sort(function(a, b){return new Date(a.date) - new Date(b.date)})
    var purchasingAmountArray = []
    
    var stock = {total: 0, current: 0, pendingPurchase: 0, pendingSale: 0}
    debugger
    
    for (let element of update) {
      stock.total += element.coming > 0 ? element.coming : -element.going; // add quantity if detail is of coming and substract if detail is of going

      if (stock.total < 0){
        alert('not enough stock at that time')
        return; // Stop processing if stock is insufficient at that time
      }

      if (element.coming > 0){
        element.qty = element.coming; // element.qty should be restored to default in case qty is subtracted before
        purchasingAmountArray.push(element.id); // push id of detail to use for purchasing amount

        var date = document.getElementById('stockSortingInput').value ? new Date(document.getElementById('stockSortingInput').value) : new Date() 
        if (new Date(element.date) > date){
          element.status = 'pending purchase'
          stock.pendingPurchase += element.coming
        } else {
          element.status = 'received'
          stock.current += element.coming
        }
      } else {
        var remainingQty = element.going
        var totalPrice = 0
        element.purchasingAmount = []

        if (new Date(element.date) > date){
          element.status = 'pending sale'
          stock.pendingSale += remainingQty
        } else {
          element.status = 'sold'
          stock.current -= remainingQty
        } 
        
        // run while loop to add purchasing amount if it is taking purchasing amount from more than 1 details
        while(remainingQty > 0){
          let currIndex = update.findIndex(x => x.id == purchasingAmountArray[0]) // find index in update array (stock detail array)
          let currDetail = update[currIndex]
          let currQty =  Math.min(currDetail.qty, remainingQty) // get least value for purchasing amount

          var purchasingAmountIndex = element.purchasingAmount.findIndex(x => x.price == currDetail.price)
          if (purchasingAmountIndex == -1){
            element.purchasingAmount.push({
              qty: currQty,
              price: currDetail.price
            })
          }else{
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

  const renderForm = (type, title, handleAction) => (
    <VStack
      as="form"
      id={`${type}Form`}
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
            <option value={x.id} >{x.name}</option> 
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

  return(
    
    <HStack spacing={10} justify="center">
      {renderForm("coming", "Coming", coming)}
      {renderForm("going", "Going", going)}
    </HStack>
  )
}

export default ActionsTab