import React, { useState } from "react";
import { Box, Button, Flex, Heading, HStack, Input, List, ListItem, Text, useToast, FormControl, useOutsideClick, useDisclosure } from "@chakra-ui/react";
import { FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import CustomAlert from "./CustomAlert";
import stockSorting from "./stockSorting";
import reRunDetails from "./reRunDetails";

export default function WarehouseTab ({warehouses, setWarehouses, productStockDetail, setProductStockDetail, products, setProductStockTotal, productStockTotal}) {
  const [warehouseName, setWarehouseName] = useState('')
  const [warehouseIndex, setWarehouseIndex] = useState( JSON.parse(localStorage.getItem('warehouseIndex')) || 2)
  const [editWarehouseName, setEditWarehouseName] = useState('')
  const [editWarehouse, setEditWarehouse] = useState({id: null})

  const [props, setProps] = useState({})
  
  const formRef = React.useRef(); // Reference for the form
  const {onOpen, onClose, isOpen} = useDisclosure()
  const toast = useToast()

  useOutsideClick({
    ref: formRef,
    handler: () => {if (editWarehouse.id){
      if (editWarehouseName == editWarehouse.name) {cancelEdit(); return false};
      setProps({
      onConfirm:() => {saveEdit(); onClose()},
      onDiscard:() => {onClose(); cancelEdit()},
      onClose: null,
      type:'saveOrDiscard',
      alertHeading:'Change Warehouse Name',
      alertText:"Do you want to change warehouse name?",
    }); onOpen()}} // Save when clicking outside the form
  });

  function startEdit(warehouse){
    setEditWarehouse(warehouse)
    setEditWarehouseName(warehouse.name)
  }

  function cancelEdit(){
    setEditWarehouse({id: null}); // reset editing warehouse id
  }

  function saveEdit(){
    var newName = editWarehouseName.trim().replace(/\s+/g, " "); // get editing warehouse name
    if (newName == '') {
      setEditWarehouse({id: null});
      toast({
        title: 'Missing warehouse name',
        description: "Warehouse name cannot be empty.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      }) 
      return false;
    }
    if (warehouses.some((x) => x.name === newName)) {
      setEditWarehouse({id: null}); 
      toast({
        title: 'Duplicate Name',
        description: "This warehouse already exist.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return false;
    }
    
    var editWarIndex = warehouses.findIndex((x) => {return x.id == editWarehouse.id})
    warehouses[editWarIndex].name = newName // replace oldname with new name
    setWarehouses(prev => ([...prev,])) // trigger rerender
    
    setEditWarehouse({id: null}); // reset editing warehouse id
  }

  function addWarehouse(){
    const value = warehouseName.trim().replace(/\s+/g, " "); // remove white spaces
    setWarehouseName(""); // reset input field
    if (value == '') { return false; } // stop empty values
    if (warehouses.some((x) => x.name.toLowerCase() === value.toLowerCase())) {
      toast({
        title: 'Duplicate Name',
        description: "This warehouse already exist.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return false;
    }

    setWarehouses([
      ...warehouses,
      {
        name: value,
        id: 'warehouse'+ warehouseIndex,
      }
    ]);

    localStorage.setItem('warehouseIndex', JSON.stringify(warehouseIndex + 1));
    setWarehouseIndex(prev => prev + 1);
  }

  function deleteWarehouse(id){

    if(warehouses.length == 1){
      toast({
        title: 'Unable to delete',
        description: "Can't delete all warehouse.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return
    }

    const updatedWarehouses = warehouses.filter((x, index) => x.id !== id);
    setWarehouses(updatedWarehouses);

    let reserveDetail = {...productStockDetail}
    let reserveStock = {...productStockTotal}

    var updatedProductDetail = {}

    
    for (let product of products) {
      let detail = productStockDetail[product.id]
      updatedProductDetail[product.id] = detail.filter(x => x.warehouse !== id)
      let result = reRunDetails(product.id, updatedProductDetail[product.id], setProductStockDetail, setProductStockTotal)
      if (result === false) {
        toast({
          title: "Cannot delete warehouse",
          description: "Cannot delete warehouse as there is some stock transfer",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
        setProductStockDetail(reserveDetail)
        setProductStockTotal(reserveStock)
        return
      }
    };

    setProductStockDetail(updatedProductDetail)
    stockSorting(products, updatedProductDetail, setProductStockTotal)
  }
  
  return(       

    <Box width="50%" padding="4" boxShadow="md" ml={4}>
      <Heading size="lg" mb={4}>Warehouse</Heading>
      
      <HStack spacing={2} mb={4}>
        <Input value={warehouseName} onChange={(e) => setWarehouseName(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') {addWarehouse()}}} placeholder="Enter warehouse name" />
        <Button colorScheme="green" onClick={() => { addWarehouse(); }}>Add Warehouse</Button>
      </HStack>
      
      <Text fontWeight="bold" fontSize="lg" mb={2}>Warehouse List</Text>
      <List spacing={2} border="1px" borderRadius="md" p={2}>
        {warehouses.map((x, index) => (
          <ListItem borderBottom="1px" p={1} display="flex" justifyContent="space-between" alignItems="center">
            {editWarehouse.id == x.id ? (
              <>
                <FormControl ref={formRef} as="form" display="flex" justifyContent="space-between" alignItems="center">
                  <input id="editField" onChange={(e) => {setEditWarehouseName(e.target.value)}} autoFocus defaultValue={x.name} onKeyDown={(e) => {if (e.key === 'Enter') {saveEdit()}}} />
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
                  <Button size="sm" variant="outline" colorScheme="blue" ml={2} onClick={() => {startEdit(x)}}><FiEdit2 /></Button> 
                  <Button 
                    onClick={() => {
                      setProps({
                        onConfirm: () => {
                          deleteWarehouse(x.id);
                          onClose();
                        },
                        onClose: onClose,
                        type: "confirmation",
                        alertHeading: "Delete Warehouse",
                        alertText: "Are you sure? You can't undo this action afterwards.",
                      });
                      onOpen()
                    }} size="sm" variant="outline" colorScheme="red" ml={2}><FiTrash2 /></Button>
                </Flex>
              </>
            )}
          </ListItem>
        ))}
      </List>
      <CustomAlert
        isOpen={isOpen}
        onConfirm={props.onConfirm}
        onClose={props.onClose}
        onDiscard={props.onDiscard}
        type={props.type}
        alertHeading={props.alertHeading}
        alertText={props.alertText}
      />
    </Box>
  )
}