import { Center, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect } from "react";

function HistoryTab({products, productStockDetail, productStockTotal, setCurrentProductDetail, currentProductDetail}){
  return(
    <>
    
    <Select onChange={(e) => {setCurrentProductDetail(e.target.value)}} defaultValue="" mb={3}>
      <option value='' disabled hidden>Select an option</option>
      {products.map((x, index) => {
        return(
          <option key={index} value={x} >{x}</option> 
        )
      })}
    </Select>
    {products.length == 0 ?(
      <Center>No Products yet</Center>
    ): currentProductDetail == '' ?(
      <Center>Select Product to view Details</Center>
    ):(
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
              <Th borderBottom="2px solid" borderColor="gray.300">
                Profit
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {productStockDetail[currentProductDetail].map((x, index) => (
              <Tr key={index} borderBottom="2px solid" borderColor="gray.200">
                <Td fontWeight="medium">{x.date}</Td>
                <Td>{x.notes}</Td>
                <Td><Text display={ x.coming > x.qty ? "inline" : 'none'} decoration={"line-through"}>{x.coming}</Text> {x.qty}</Td>
                <Td>{x.going}</Td>
                <Td>{x.price}</Td>
                <Td dangerouslySetInnerHTML={{ __html: x.purchasingAmount }} />
                <Td>{x.profit}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    )
    }
    </>
  )
}

export default HistoryTab;