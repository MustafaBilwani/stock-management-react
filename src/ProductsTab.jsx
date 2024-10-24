import React, { useEffect } from "react";
import { Button, Center, HStack, Input, List, ListItem, Text, VStack } from "@chakra-ui/react";

function ProductsTab({products, setProducts, setProductStockTotal, productStockTotal, ...rest}){
  function addProduct(){
    var value = document.getElementById('addProductInput').value.trim().replace(/\s+/g, ' ');
    document.getElementById('addProductInput').value = '';
    if (value == '') { return false; }
    if (products.includes(value)) {
      alert('Product already exists');
      return false;
    }

    setProducts([...products, value]);
    setProductStockTotal((prev) => {return {...prev, [value]:0}})
  }
  useEffect(() => {
    console.log("Updated Products:", products);
    console.log("Updated Product Stock Total:", productStockTotal);
  }, [products]);

  return(
    <VStack spacing={4} align="stretch">
      <form onSubmit={() => {addProduct(); event.preventDefault();}}>
        <HStack>
          <Input id="addProductInput" placeholder="Enter product name" />
          <Button colorScheme="green" onClick={() => {addProduct();}}>Add Product</Button>
        </HStack>
      </form>

      {products.length > 0 ? 
        (
          <>
            <Text fontWeight="bold" fontSize="lg" mt={4}>
              Product List
            </Text>

            <List spacing={2} border="1px" borderRadius="md" p={2}>
              {products.map((x, index) => {
                return(
                  <ListItem key={index} borderBottom="1px" p={1}>
                    {x}
                  </ListItem> 
                )
              })}
            </List>
          </>
        ):(
          <Center>
            No Products yet
          </Center>
        )
      }
        
    </VStack>
  )
}

export default ProductsTab;