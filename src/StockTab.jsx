import React, { useEffect, useState } from "react";
import { Box, Center, Divider, Input, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import stockSorting from "./stockSorting";

function StockTab({products, productStockTotal, productStockDetail, setProductStockTotal, warehouses }){

  const [selectedWarehouse, setSelectedWarehouse] = useState('all')

  useEffect(() => {
    stockSorting(products, productStockDetail, setProductStockTotal)
  }, [])
  
  return(
    <>
    {products.length > 0 ? (
      <>
        <Box display={"flex"} justifyContent={"center"} gap={5} alignItems={'center'}>
          <Text fontSize={30} ml={2}>Select Date to view stock at that Date</Text>
          <Input type="date" id="stockSortingInput" onChange={() => {stockSorting(products, productStockDetail, setProductStockTotal)}} width={'170px'}/>
          <Text fontSize={30} ml={5}>Warehouse:</Text>
          <Select width={'170px'} value={selectedWarehouse} onChange={(e) => {setSelectedWarehouse(e.target.value)}}>
            <option value="all">All Warehouses</option>
            {warehouses.map((x, index) => {
              return <option value={x.id} key={index}>{x.name}</option>
            })}
          </Select>
        </Box>
    
        {document.getElementById('stockSortingInput')?.value ? (
          <Center fontSize={24} mb={2} mt={2} >Viewing stock at {document.getElementById('stockSortingInput').value}</Center>
        ) : ('')}

        <Divider my={4} borderColor="gray.400" />

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
                  <Td>{productStockTotal[x.id][selectedWarehouse]?.total || 0}</Td>
                  <Td>{productStockTotal[x.id][selectedWarehouse]?.current || 0}</Td>
                  <Td>{productStockTotal[x.id][selectedWarehouse]?.pendingPurchase || 0}</Td>
                  <Td>{productStockTotal[x.id][selectedWarehouse]?.pendingSale || 0}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    ):(
      <Center>No Products yet</Center>
    )
    }
    </>
  )
}

export default StockTab;