import { Center, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect } from "react";

function HistoryTab({products, productStockDetail, productStockTotal, setCurrentProductDetail, currentProductDetail}){
  return(
    <>    
      <Select onChange={(e) => {setCurrentProductDetail(e.target.value)}} value={currentProductDetail} mb={1}>
        <option value='' disabled hidden>Select an option</option>
        {products.map((x, index) => {
          return(
            <option key={index} value={x.id} >{x.name}</option> 
          )
        })}
      </Select>
      {products.length == 0 ?(
        <Center>No Products yet</Center>
      ): currentProductDetail == '' ?(
        <Center>Select Product to view Details</Center>
      ):(
        <>
          <Center fontWeight={'bold'} fontSize={24} marginBottom={1.5} marginTop={0}> {products[products.findIndex(x => x.id == currentProductDetail)].name} </Center>
          <TableContainer
            border="1px"
            borderColor="gray.300"
            borderRadius="md"
            p={4}
            shadow="sm"
          >
            <Table variant="simple" size="md">
              <Thead>
                <Tr borderBottom="2px solid" borderColor="gray.300">
                  <Th>Date</Th>
                  <Th>Notes</Th>
                  <Th>Coming</Th>
                  <Th>Going</Th>
                  <Th>Price</Th>
                  <Th>Status</Th>
                  <Th>Purchasing Amount</Th>
                  <Th>Profit</Th>
                </Tr>
              </Thead>
              <Tbody>
                {productStockDetail[currentProductDetail].map((x, index) => (
                  <Tr key={index} borderBottom="2px solid" borderColor="gray.300">
                    <Td fontWeight="medium">{x.date}</Td>
                    <Td>{x.notes}</Td>
                    <Td>
                      <Text display={ x.coming > x.qty ? "inline" : 'none'} decoration={"line-through"}>{x.coming}</Text>
                      <span> {x.qty}</span>
                    </Td>
                    <Td>{x.going}</Td>
                    <Td>{x.price}</Td>
                    <Td>{x.status}</Td>
                    <Td>{x.purchasingAmount ? x.purchasingAmount.map(element => (
                          <Text key={element.price}>{element.price} PKR for {element.qty} pieces</Text>
                        )) : ''}
                    </Td>
                    <Td>{x.profit}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )
      }
    </>
  )
}

export default HistoryTab;