import React from "react";
import { Center, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";

function StockTab({products, productStockTotal, ...rest}){
  return(
    <>
    {products.length > 0 ?(
      <TableContainer
      border="1px"
      borderColor="gray.300"
      borderRadius="md"
      p={4}
      shadow="sm"
      bg="white"
    >
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th borderBottom="2px solid" borderColor="gray.300">
              Product
            </Th>
            <Th borderBottom="2px solid" borderColor="gray.300">
              Stock
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((x, index) => (
            <Tr key={index} borderBottom="2px solid" borderColor="gray.200">
              <Td fontWeight="medium">{x.name}</Td>
              <Td>{productStockTotal[x.id]}</Td>
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