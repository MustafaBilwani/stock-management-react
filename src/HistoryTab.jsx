import { Box, Button, Center, Flex, Icon, IconButton, Input, Popover, PopoverBody, PopoverContent, PopoverTrigger, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorMode, useDisclosure, useOutsideClick, useToast } from "@chakra-ui/react";
import React, { forwardRef, useRef, useState } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { FiCheck, FiEdit2, FiFilter, FiTrash2, FiX } from "react-icons/fi";
import { MultiSelect } from "react-multi-select-component";
import './select.css'
import CustomAlert from "./CustomAlert";
import reRunDetails from "./reRunDetails";
import Filter from "./Filter";
import { CreateColumns } from "./historyColumn";

function HistoryTab({products, productStockDetail, setCurrentProductDetail, currentProductDetail, setProductStockDetail, setProductStockTotal, warehouses}){
 
  const editRow = useRef();
  const toast = useToast()

  const [props, setProps] = useState({})

  useOutsideClick({
    ref: editRow,
    handler: () => {
      const handlingBlur = async () => {
      if (editDetail && !pendingEdit) { // check if any entry is being edited and no pendingEdit is currently stored
        const editingDate = document.getElementById('editingDate')?.value || '';
        const editingNotes = document.getElementById('editingNotes')?.textContent || '';
        const editingComing = document.getElementById('editingComing')?.textContent || '';
        const editingGoing = document.getElementById('editingGoing')?.textContent || '';
        const editingPrice = document.getElementById('editingPrice')?.textContent || '';
        
        const newPendingEdit = {
          editingDate: document.getElementById('editingDate')?.value || '',
          editingNotes: document.getElementById('editingNotes')?.textContent || '',
          editingComing: document.getElementById('editingComing')?.textContent || '',
          editingGoing: document.getElementById('editingGoing')?.textContent || '',
          editingPrice: document.getElementById('editingPrice')?.textContent || ''
        };
    
        setPendingEdit(newPendingEdit);

      }}
      handlingBlur()
    },
  });

  const [editDetail, setEditDetail] = React.useState(null)
  const [editDetailProduct, setEditDetailProduct] = React.useState(null)
  const [pendingEdit, setPendingEdit] = React.useState(null);

  React.useEffect(() => {
    if (pendingEdit) {
      setProps({
        onConfirm: () => { saveEditDetail(); onClose(); },
        onDiscard: () => {
          onClose();
          setEditDetail(null);
          setEditDetailProduct(null);
          setPendingEdit(null);
        },
        onClose: null,
        type: 'saveOrDiscard',
        alertHeading: 'Edit entry',
        alertText: "Do you want to edit this entry?",
      });
      onOpen();
    }
  }, [pendingEdit]);

  function deleteDetail (id) {
    var update = [...productStockDetail[currentProductDetail]]
    var deleteDetailIndex =  update.findIndex(detail => detail.id == id)
    update.splice(deleteDetailIndex, 1)
    var result = reRunDetails(currentProductDetail, update, setProductStockDetail, setProductStockTotal, warehouses)

    if (result === false){
      toast({
        title: 'Unable to delete',
        description: "This stock has been sold.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }
  }

  function saveEditDetail(){

    // take saved details if there or get from inputs 
    const editingDate = pendingEdit?.editingDate || document.getElementById('editingDate')?.value || '';
    const editingNotes = pendingEdit?.editingNotes !== undefined ? pendingEdit.editingNotes : document.getElementById('editingNotes')?.textContent || '';
    const editingComing = pendingEdit?.editingComing || document.getElementById('editingComing')?.textContent || '';
    const editingGoing = pendingEdit?.editingGoing || document.getElementById('editingGoing')?.textContent || '';
    const editingPrice = pendingEdit?.editingPrice || document.getElementById('editingPrice')?.textContent || '';

    const editingQuantity = editingComing || editingGoing

    if (!editingQuantity || !editingDate || !editingPrice){
      toast({
        title: 'Incomplete details',
        description: "Fill required fields.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      
      setEditDetail(null)
      setPendingEdit(null)
      return;
    }

    if (editingQuantity < 1 || editingPrice < 1 || editingQuantity != Math.trunc(editingQuantity)) {
      toast({
        title: 'Incorrect details',
        description: "Enter valid values.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      })      
      setEditDetail(null)
      setPendingEdit(null)
      return false;
    }

    var currProduct = productStockDetail[editDetailProduct]
    let currDetail = currProduct.find(x => x.id == editDetail)
    let currDetailIndex = currProduct.findIndex(x => x.id == currDetail.id);
    
    var newDetail = {
      coming: parseInt(editingComing),
      going: parseInt(editingGoing),
      price: parseFloat(editingPrice),
      date: editingDate,
      notes: editingNotes,
      id: currDetail.id,
      product: currDetail.product,
      warehouse: currDetail.warehouse
    }
    
    var update = [...productStockDetail[currDetail.product]]
    update[currDetailIndex] = newDetail
    update.sort(function(a, b){return new Date(a.date) - new Date(b.date)})
    
    var result = reRunDetails(currDetail.product, update, setProductStockDetail, setProductStockTotal, warehouses);
    setEditDetail(null)
    setEditDetailProduct(null)
    setPendingEdit(null)

    if (result === false){
    toast({
      title: 'Unable to edit',
      description: "Details you entered are not possible.",
      status: 'error',
      duration: 6000,
      isClosable: true,
    })
    }
  }

  const { isOpen, onOpen, onClose, } = useDisclosure();
    
  const columns = React.useMemo(() => CreateColumns({
    editDetail,
    setEditDetail,
    setEditDetailProduct,
    saveEditDetail,
    deleteDetail,
    setProps,
    onOpen,
    warehouses
  }), [editDetail, warehouses]);

  const data = currentProductDetail ? productStockDetail[currentProductDetail] : [];
  const [columnFilters, setColumnFilters] = React.useState([])
  const table = useReactTable({
    columns,
    data,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    
  });

  return(
    <>
      <CustomAlert
        isOpen={isOpen}
        onConfirm={props.onConfirm}
        onClose={props.onClose}
        onDiscard={props.onDiscard}
        type={props.type}
        alertHeading={props.alertHeading}
        alertText={props.alertText}
      />

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
          <Center fontWeight={'bold'} fontSize={24} marginBottom={1.5} marginTop={0}> {products.find(x => x.id === currentProductDetail).name} </Center>
          <TableContainer border="1px" borderColor="gray.300" borderRadius="md" p={4} shadow="sm">
            <Table variant="simple" size="md">
              <Thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <Tr key={headerGroup.id} borderBottom="2px solid" borderColor="gray.300">
                    {headerGroup.headers.map(header => (
                      <Th key={header.id}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanFilter() && (
                            <Filter column={header.column} warehouses={warehouses} />
                          )}
                        </div>
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map(row => (
                  <Tr key={row.id} borderBottom="2px solid" borderColor="gray.300" ref={row.original.id == editDetail ? editRow : null} >
                    {row.getVisibleCells().map(cell => (
                      <Td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  )
}

export default HistoryTab;