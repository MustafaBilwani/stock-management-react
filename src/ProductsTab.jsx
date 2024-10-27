import React, { useEffect, useState } from "react";
import { Box, Button, Center, Flex, FormControl, Heading, HStack, Input, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Popover, Text, useDisclosure, useOutsideClick, VStack } from "@chakra-ui/react";
import { FiCheck, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { useRef } from "react";

function ProductsTab({products, setProducts, setProductStockTotal, productStockTotal, productStockDetail, setProductStockDetail, ...rest}){

  const formRef = useRef(); // Reference for the form

  // Use Chakra's `useOutsideClick` hook
  useOutsideClick({
    ref: formRef,
    handler: () => {if (editingProduct.id) saveEdit(editingProduct)}, // Save when clicking outside the form
  });
  
  const [proIndex, setProIndex] = React.useState(1)
  const [editingProduct, setEditingProduct] = React.useState({id: null})
  const [productName, setProductName] = useState("");
  const [editProductName, setEditProductName] = useState("");
   
  function addProduct(){
    const value = productName.trim().replace(/\s+/g, " "); // remove white spaces
    setProductName(""); // reset input field
    if (value == '') { return false; } // stop empty values
    if (products.some((x) => x.name === value)) {
      alert('Product already exists');
      return false;
    }

    setProducts([
      ...products,
      {
        name: value,
        id: 'product'+proIndex,
      }
    ]);

    setProductStockTotal((prev) => {return {...prev, ['product'+proIndex]:0}}) // declare stock to 0
    setProductStockDetail((prev) => {return {...prev, ['product'+proIndex]:[]}}) // add an array to be used to store details

    setProIndex(prev => prev + 1);
  }

  function deleteProduct(id){
    const updatedProducts = products.filter((x, index) => x.id !== id);
    setProducts(updatedProducts);
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
      alert('Product Name cannot be empty');
      return false;
    }

    if(newName == editingProduct.name){
      setEditingProduct({id: null}); 
      return false; // exit editing and return if name is same
    }
    
    if (products.some((x) => x.name === newName)) {
      setEditingProduct({id: null}); 
      alert('Product Name canot be same');
      return false;
    }

    var editProIndex = products.findIndex((x) => {return x.id == editingProduct.id})
    products[editProIndex].name = newName // replace oldname with new name
    setProducts(prev => ([...prev,])) // trigger rerender
    
    setEditingProduct({id: null}); // reset editing product id
  }


  return(
    <Flex>
      {/* Products Section */}
      <Box width="50%" padding="4" boxShadow="md" ml={4}>
        <Heading size="lg" mb={4}>Products</Heading>
        
        <HStack spacing={2} mb={4}>
          <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Enter product name" />
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
                    <FormControl ref={formRef} as="form" tabIndex={-1} display="flex" justifyContent="space-between" alignItems="center">
                      <input id="editField" onChange={(e) => {setEditProductName(e.target.value)}} autoFocus defaultValue={x.name}/>
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
                      <Button size="sm" variant="outline" colorScheme="red" ml={2} onClick={() => {deleteProduct(x.id)}}><FiTrash2 /></Button>                  
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

      {/* Warehouse Section */}
      <Box width="50%" padding="4" boxShadow="md" ml={4}>
        <Heading size="lg" mb={4}>Warehouse</Heading>
        
        <HStack spacing={2} mb={4}>
          <Input placeholder="Enter warehouse name" />
          <Button colorScheme="green">Add Warehouse</Button>
        </HStack>
        
        <Text fontWeight="bold" fontSize="lg" mb={2}>Warehouse List</Text>
        
        <List spacing={2} border="1px" borderRadius="md" p={2}>
          <ListItem borderBottom="1px" p={1} display="flex" justifyContent="space-between" alignItems="center">
            Warehouse 1 
            <Flex>
              <Button size="sm" variant="outline" colorScheme="blue" ml={2}><FiEdit2 /></Button> 
              <Button size="sm" variant="outline" colorScheme="red" ml={2}><FiTrash2 /></Button>
            </Flex>
          </ListItem>
        </List>
      </Box>
    </Flex>
  )
}

export default ProductsTab;