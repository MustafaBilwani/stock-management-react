import React from "react";
import { Center, Input, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";

function StockTab({products, productStockTotal, productStockDetail, setProductStockTotal, ...rest}){

  function stockSorting(selectedDate){
    debugger
    var array = {}
    
    var date = selectedDate ? new Date(selectedDate) : new Date
    products.forEach(product => {
      
      debugger

      var stock = {
        total: productStockTotal[product.id].total,
        current: 0,
        pendingSale: 0,
        pendingPurchase: 0
      }
      productStockDetail[product.id].forEach(detail => {
        debugger;
        const detailDate = new Date(detail.date);
        
        if (detail.coming > 0 && detailDate > date) {
          stock.pendingPurchase += detail.coming;
        } else if (detail.coming > 0) {
          stock.current += detail.coming;
        } else if (detail.going > 0 && detailDate > date) {
          stock.pendingSale += detail.going;
        } else if (detail.going > 0) {
          stock.current -= detail.going;
        }
      })
      array[product.id] = {...stock}
    });
    setProductStockTotal(array)
    console.log(array)
  }
  
  return(
    <>

    <Text fontSize={20} ml={2}>Select Date to view stock at that Date</Text>
    <Input type="date" mb={2} id="stockSortingInput" onChange={(e) => {stockSorting(e.target.value)}} />

    {document.getElementById('stockSortingInput')?.value ? (
      <Center fontSize={24} mb={2} >Viewing stock at {document.getElementById('stockSortingInput').value}</Center>
    ) : ('')}

    {products.length > 0 ?(
      <TableContainer
        border="1px"
        borderColor="gray.300"
        borderRadius="md"
        p={4}
        shadow="sm"
      >
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th borderBottom="2px solid" borderColor="gray.300">
                Product
              </Th>
              <Th borderBottom="2px solid" borderColor="gray.300">
                Total
              </Th>
              <Th borderBottom="2px solid" borderColor="gray.300">
                Current
              </Th>
              <Th borderBottom="2px solid" borderColor="gray.300">
                Pending Purchase
              </Th>
              <Th borderBottom="2px solid" borderColor="gray.300">
                Pending Sale
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((x, index) => (
              <Tr key={index} borderBottom="2px solid" borderColor="gray.200">
                <Td fontWeight="medium">{x.name}</Td>
                <Td>{productStockTotal[x.id].total}</Td>
                <Td>{productStockTotal[x.id].current}</Td>
                <Td>{productStockTotal[x.id].pendingPurchase}</Td>
                <Td>{productStockTotal[x.id].pendingSale}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    ):(
      <Center>No Products yet</Center>
    )
    }
    </>
  )
}

export default StockTab;