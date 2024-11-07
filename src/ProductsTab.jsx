import React, { useState } from "react";
import { Box, Button, Center, Flex, FormControl, Heading, HStack, Input, List, ListItem, Text, useDisclosure, useOutsideClick, useToast } from "@chakra-ui/react";
import { FiCheck, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { useRef } from "react";
import CustomAlert from "./CustomAlert";

function ProductsTab({products, setProducts, setProductStockTotal, currentProductDetail, setCurrentProductDetail, productStockTotal, productStockDetail, setProductStockDetail }){

  const { 
    isOpen: isDeleteAlertOpen, 
    onOpen: onDeleteAlertOpen, 
    onClose: onDeleteAlertClose 
  } = useDisclosure();
  const { 
    isOpen: isBlurAlertOpen, 
    onOpen: onBlurAlertOpen, 
    onClose: onBlurAlertClose 
  } = useDisclosure();

  const formRef = useRef(); // Reference for the form
  const toast = useToast()

  // Use Chakra's `useOutsideClick` hook
  useOutsideClick({
    ref: formRef,
    handler: () => {if (editingProduct.id) onBlurAlertOpen()}, // Save when clicking outside the form
  });
  
  const [proIndex, setProIndex] = React.useState(1)
  const [editingProduct, setEditingProduct] = React.useState({id: null})
  const [productName, setProductName] = useState("");
  const [editProductName, setEditProductName] = useState("");
  const [productToDelete, setProductToDelete] = useState("");
   
  function addProduct(){
    const value = productName.trim().replace(/\s+/g, " "); // remove white spaces
    setProductName(""); // reset input field
    if (value == '') { return false; } // stop empty values
    if (products.some((x) => x.name.toLowerCase() === value.toLowerCase())) {
      toast({
        title: 'Duplicate Name',
        description: "This product already exist.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return false;
    }

    setProducts([
      ...products,
      {
        name: value,
        id: 'product'+proIndex,
      }
    ]);

    setProductStockTotal((prev) => {return {
      ...prev,
      ['product'+proIndex]:{
          total: 0,
          current: 0,
          pendingPurchase: 0,
          pendingSale: 0,
        }
    }}) // declare stock to 0
    setProductStockDetail((prev) => {return {...prev, ['product'+proIndex]:[]}}) // add an array to be used to store details

    setProIndex(prev => prev + 1);
  }

  function deleteProduct(id){
    const updatedProducts = products.filter((x) => x.id !== id);
    setProducts(updatedProducts);
    delete productStockTotal[id]
    delete productStockDetail[id]

    if (currentProductDetail == id){
      setCurrentProductDetail('')
    }
  }

  function editProduct(product){
    setEditingProduct(product)
    setEditProductName(product.name)
  }

  function cancelEdit(){
    setEditingProduct({id: null}); // reset editing product id
  }

  function saveEdit(){
    var newName = editProductName.trim().replace(/\s+/g, " "); // get editing products name
    if (newName == '') {
      setEditingProduct({id: null}); 
      toast({
        title: 'Missing product name',
        description: "Product name cannot be empty.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      }) 
      return false;
    }

    if(newName == editingProduct.name){
      setEditingProduct({id: null}); 
      return false; // exit editing and return if name is same
    }
    
    if (products.some((x) => x.name === newName)) {
      setEditingProduct({id: null}); 
      toast({
        title: 'Duplicate Name',
        description: "This product already exist.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return false;
    }

    var editProIndex = products.findIndex((x) => {return x.id == editingProduct.id})
    products[editProIndex].name = newName // replace oldname with new name
    setProducts(prev => ([...prev,])) // trigger rerender
    
    setEditingProduct({id: null}); // reset editing product id
  }


  return(
    <>
      {/* Products Section */}
      <Box width="100%" padding="4" boxShadow="md">
        <Heading size="lg" mb={4}>Products</Heading>
        
        <HStack spacing={2} mb={4}>
          <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Enter product name" onKeyDown={(e) => {if (e.key === 'Enter') {addProduct()}}} />
          <Button colorScheme="green" onClick={() => { addProduct(); }}>Add Product</Button>
        </HStack>
        
        <Text fontWeight="bold" fontSize="lg" mb={2}>Product List</Text>
        
        <List spacing={2} border="1px" borderRadius="md" p={2}>
          {products.length > 0 ? (
            products.map((x, index) => {
              return(
              <ListItem key={index} borderBottom="1px" p={1} display="flex" justifyContent="space-between" alignItems="center">
                {editingProduct.id == x.id ? (
                  <>
                    <FormControl ref={formRef} as="form" display="flex" justifyContent="space-between" alignItems="center">
                      <input id="editField" onChange={(e) => {setEditProductName(e.target.value)}} autoFocus defaultValue={x.name} onKeyDown={(e) => {if (e.key === 'Enter') {saveEdit()}}} />
                      <Flex>
                        <Button size="sm" variant="outline" colorScheme="gray" ml={2} onMouseDown={cancelEdit}><FiX /></Button>
                        <Button size="sm" variant="outline" colorScheme="gray" ml={2} onMouseDown={()=> {saveEdit()}}><FiCheck /></Button>
                      </Flex>
                    </FormControl>
                  </>
                ) : (
                  <>
                    {x.name}
                    <Flex>                  
                      <Button size="sm" variant="outline" colorScheme="blue" ml={2} onClick={() => {editProduct(x)}}><FiEdit2 /></Button>                 
                      <Button size="sm" variant="outline" colorScheme="red" ml={2} onClick={() => {onDeleteAlertOpen(); setProductToDelete(x.id)}}><FiTrash2 /></Button>
                    </Flex>
                  </>
                )}
              </ListItem>
            )})
          ) : (
            <Center>No Products yet</Center>
          )}
        </List>
      </Box>
      <CustomAlert 
        isOpen={isDeleteAlertOpen}
        onConfirm={() => {deleteProduct(productToDelete); onDeleteAlertClose()}}
        onClose={onDeleteAlertClose}
        type='confirmation'
        alertHeading='Delete Product'
        alertText="Are you sure? You can't undo this action afterwards."
      />
      <CustomAlert 
        isOpen={isBlurAlertOpen}
        onConfirm={() => {saveEdit(); onBlurAlertClose()}}
        onClose={() => {onBlurAlertClose(); cancelEdit()}}
        type='saveOrDiscard'
        alertHeading='Change Product Name'
        alertText="Do you want to change product name?"
      />
    </>
  )
}

export default ProductsTab;