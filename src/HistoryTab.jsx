import { Center, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect } from "react";

function HistoryTab({products, productStockDetail, productStockTotal, setCurrentProductDetail, currentProductDetail}){
  return(
    <>
    
    <Select onChange={(e) => {setCurrentProductDetail(productStockDetail[e.target.value])}} defaultValue="">
      <option value='' disabled hidden>Select an option</option>
      {products.map((x, index) => {
        return(
          <option value={x} >{x}</option> 
        )
      })}
    </Select>
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
              Date
            </Th>
            <Th borderBottom="2px solid" borderColor="gray.300">
              Notes
            </Th>
            <Th borderBottom="2px solid" borderColor="gray.300">
              Coming
            </Th>
            <Th borderBottom="2px solid" borderColor="gray.300">
              Going
            </Th>
            <Th borderBottom="2px solid" borderColor="gray.300">
              Price
            </Th>
            <Th borderBottom="2px solid" borderColor="gray.300">
              Purchasing Amount
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentProductDetail.map((x, index) => (
            <Tr key={index} borderBottom="2px solid" borderColor="gray.200">
              <Td fontWeight="medium">{x.date}</Td>
              <Td>{x.notes}</Td>
              <Td>{x.coming}</Td>
              <Td>{x.going || ''}</Td>
              <Td>{x.price}</Td>
              <Td>{x.purchasingAmount}</Td>
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

export default HistoryTab;