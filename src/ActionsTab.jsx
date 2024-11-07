import { Button, HStack, Input, Select, Text, useToast, VStack } from "@chakra-ui/react";
import React from "react";

function ActionsTab ({products, productStockDetail, productStockTotal, reRunDetails}){
  const [index, setIndex] = React.useState(1)
  const toast = useToast()

  function coming(){
    var comingQty = document.getElementById('comingQty').value;
    var comingPrice = document.getElementById('comingPrice').value;
    var comingNote = document.getElementById('comingNote').value;
    var comingProduct = document.getElementById('comingProduct').value;
    var comingDate = document.getElementById('comingDate').value;
    
    if (!comingProduct || !comingQty || !comingPrice || !comingDate) {
      toast({
        title: 'Incomplete details',
        description: "Fill required fields.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return false; 
    }
    if (comingQty < 1 || comingPrice < 1 || comingQty != Math.trunc(comingQty)) {
      toast({
        title: 'Incorrect details',
        description: "Enter valid values.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return false; 
    }
    
    var newDetail = {
      coming: parseInt(comingQty),
      price: parseFloat(comingPrice),
      date: comingDate,
      notes: comingNote,
      qty: comingQty,
      id: index,
      product: comingProduct
    }
    
    var update = [...productStockDetail[comingProduct], newDetail].sort(function(a, b){return new Date(a.date) - new Date(b.date)})
    
    document.getElementById('comingForm').reset();
    setIndex(prev => prev + 1);

    reRunDetails(comingProduct, update);
  }

  function going(){
    var goingQty = document.getElementById('goingQty').value;
    var goingPrice = document.getElementById('goingPrice').value;
    var goingNote = document.getElementById('goingNote').value;
    var goingProduct = document.getElementById('goingProduct').value;
    var goingDate = document.getElementById('goingDate').value;
    
    if (!goingProduct || !goingPrice || !goingQty || !goingDate) {
      toast({
        title: 'Incomplete details',
        description: "Fill required fields.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      }) 
      return false;
    }

    if (goingQty < 1 || goingPrice < 1 || goingQty != Math.trunc(goingQty)) {
      toast({
        title: 'Incorrect details',
        description: "Enter valid values.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return false;
    }

    if (goingQty > productStockTotal[goingProduct].total) {
      toast({
        title: 'Invalid Quantity',
        description: "Not enough stock.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return false;
    }

    var newDetail = {
      going: parseInt(goingQty),
      price: goingPrice,
      date: goingDate,
      notes: goingNote,
      id: index,
      product: goingProduct
    }

    var update = [...productStockDetail[goingProduct], newDetail].sort(function(a, b){return new Date(a.date) - new Date(b.date)})
    
    document.getElementById('goingForm').reset();
    setIndex(prev => prev + 1);

    var result = reRunDetails(goingProduct, update);

    if (result === false){
      toast({
        title: 'Incorrect details',
        description: "Enter valid values.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }
  } 

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
            <option value={x.id} key={index} >{x.name}</option> 
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
