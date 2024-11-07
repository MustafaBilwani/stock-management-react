import { Box, Button, Center, Input, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorMode, useDisclosure, useOutsideClick, useToast } from "@chakra-ui/react";
import React, { useRef } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { FiCheck, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { MultiSelect } from "react-multi-select-component";
import './select.css'
import CustomAlert from "./CustomAlert";

function HistoryTab({products, productStockDetail, setCurrentProductDetail, currentProductDetail, reRunDetails}){
 
  const editRow = useRef();
  const toast = useToast()

  useOutsideClick({
    ref: editRow,
    handler: () => {
      if (editDetail && !pendingEdit) { // check if any entry is being edited and no pendingEdit is currently stored
        const editingDate = document.getElementById('editingDate')?.value || '';
        const editingNotes = document.getElementById('editingNotes')?.textContent || '';
        const editingComing = document.getElementById('editingComing')?.textContent || '';
        const editingGoing = document.getElementById('editingGoing')?.textContent || '';
        const editingPrice = document.getElementById('editingPrice')?.textContent || '';
        
        setPendingEdit({
          editingDate: editingDate,
          editingNotes: editingNotes,
          editingComing: editingComing,
          editingGoing: editingGoing,
          editingPrice: editingPrice
        });
        
        onBlurAlertOpen();
      }
    },
  });

  const [editDetail, setEditDetail] = React.useState(null)
  const [editDetailProduct, setEditDetailProduct] = React.useState(null)
  const [detailToDelete, setDetailToDelete] = React.useState('')
  const [pendingEdit, setPendingEdit] = React.useState(null);

  function deleteDetail (id) {
    var update = [...productStockDetail[currentProductDetail]]
    var deleteDetailIndex =  update.findIndex(detail => detail.id == id)
    update.splice(deleteDetailIndex, 1)
    var result = reRunDetails(currentProductDetail, update)

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
    debugger

    // take saved details if there or get from inputs 
    const editingDate = pendingEdit?.editingDate || document.getElementById('editingDate')?.value || '';
    const editingNotes = pendingEdit?.editingNotes || document.getElementById('editingNotes')?.textContent || '';
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
      product: currDetail.product
    }
    
    var update = [...productStockDetail[currDetail.product]]
    update[currDetailIndex] = newDetail
    update.sort(function(a, b){return new Date(a.date) - new Date(b.date)})
    
    var result = reRunDetails(currDetail.product, update);
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
    
  const columns = React.useMemo(() => [
    {
      id: 'date',
      header: 'Date',
      accessorKey: 'date',
      cell: (info) => {
        const row = info.row.original

        return row.id == editDetail ? (
          <Input id="editingDate" type='date' defaultValue={row.date} width={40} autoFocus />
        ): (
          <Input type='date' defaultValue={row.date} readOnly width={40} />
        )
      }
    },
    {
      id: 'notes',
      header: 'Notes',
      accessorKey: 'notes',
      cell: (info) => {
        const row = info.row.original
        
        return row.id == editDetail ? (
          <Text id="editingNotes" contentEditable outline="2px solid" outlineColor={'blue.300'} pl={1} borderRadius="4px" >
            {row.notes}
          </Text>
        ) : (
          <span>{row.notes}</span>
        )
      }    
    },
    {
      id: 'coming',
      header: 'Coming',
      accessorKey: 'coming',
      cell: (info) => {
        const row = info.row.original

        if(!row.coming) return '' // dont apply filter if entry is of sale
        
        if (row.id == editDetail) {
          return <Text id="editingComing" contentEditable outline="2px solid" outlineColor={'blue.300'} pl={1} borderRadius="4px">{row.coming}</Text>
        }
        
        return row.coming > row.qty ? (
          <>        
            <Box as={'span'} textDecoration={'line-through'}>{row.coming}</Box> {row.qty}
          </>
        ) : (
          <>
            {row.coming}
          </>
        );
      }
    },
    {
      id: 'going',
      header: 'Going',
      accessorKey: 'going',
      cell: (info) => {
        const row = info.row.original

        if(!row.going) return '' // dont apply filter if entry is of purchasing

        return row.id == editDetail ? (
          <Text id="editingGoing" contentEditable outline="2px solid" outlineColor={'blue.300'} pl={1} borderRadius="4px">{row.going}</Text>
        ) : (
          <span>{row.going}</span>
        )
      }
    },
    {
      id: 'price',
      header: 'Price',
      accessorKey: 'price',
      cell: (info) => {
        const row = info.row.original

        return row.id == editDetail ? (
          <Text contentEditable id="editingPrice" outline="2px solid" outlineColor={'blue.300'} pl={1} borderRadius="4px" >{row.price}</Text>
        ) : (
          <span>{row.price}</span>
        )
      }
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      meta: {
        filterVariant: 'status',
      },
      filterFn: (row, columnId, filterValues) => {
        const rowValue = row.getValue(columnId)
        return filterValues.includes(rowValue);
      }
    },
    {
      id: 'purchasingAmount',
      header: 'Purchasing Amount',
      accessorKey: 'purchasingAmount',
      cell: (info) => {
        const purchasingAmount = info.getValue();
        if (!purchasingAmount) return '';
        
        return (
          <>
            {purchasingAmount.map(element => (
              <Text key={element.price}>
                {element.price} PKR for {element.qty} pieces
              </Text>
            ))}
          </>
        );
      }
    },
    {
      id: 'profit',
      header: 'Profit',
      accessorKey: 'profit'
    },
    {
      id: 'currentStock',
      header: 'Stock at time',
      accessorKey: 'currentStock'
    },
    {
      header: 'Actions',
      cell: (info) => {
        return info.row.original.id == editDetail ? (
          <>
            <Button size="sm" variant="outline" colorScheme="blue" onClick={() => {setEditDetail(null); setEditDetailProduct(null)}} ><FiX /></Button>
            <Button size="sm" variant="outline" colorScheme="blue" ml={2} onClick={() => {saveEditDetail(info.row.original)}} ><FiCheck /></Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" colorScheme="blue" mr={2} onClick={() => {setEditDetail(info.row.original.id); setEditDetailProduct(info.row.original.product)}} ><FiEdit2/></Button>
            <Button size="sm" variant="outline" colorScheme="red" onClick={() => {setDetailToDelete(info.row.original.id); onDeleteAlertOpen();}}><FiTrash2/></Button>
          </>
        )
      }
    },
  ])

  const { 
    isOpen: isDeleteAlertOpen, 
    onOpen: onDeleteAlertOpen, 
    onClose: onDeleteAlertClose 
  } = useDisclosure();

  const { 
    isOpen: isBlurAlertOpen, 
    onOpen: onBlurAlertOpen, 
    onClose: onBlurAlertClose 
  } = useDisclosure();

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
        isOpen={isBlurAlertOpen}
        onConfirm={() => {saveEditDetail(); onBlurAlertClose()}}
        onClose={() => { onBlurAlertClose(); setEditDetail(null); setEditDetailProduct(null); setPendingEdit(null); }}
        type='saveOrDiscard'
        alertHeading='Edit entry'
        alertText="Do you want to edit this entry?"
      />
      <CustomAlert
        isOpen={isDeleteAlertOpen}
        onConfirm={() => {deleteDetail(detailToDelete); onDeleteAlertClose()}}
        onClose={onDeleteAlertClose}
        type='confirmation'
        alertHeading='Delete entry'
        alertText="Are you sure? You can't undo this action afterwards."
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
          <TableContainer border="1px" borderColor="gray.300" borderRadius="md" p={4} shadow="sm" >
            <Table variant="simple" size="md">
              <Thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <Tr key={headerGroup.id} borderBottom="2px solid" borderColor="gray.300">
                    {headerGroup.headers.map(header => (
                      <Th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())
                        }
                        {header.column.getCanFilter() && (
                          <Filter column={header.column} />
                        )}
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

function Filter({column}){
  const { colorMode } = useColorMode();
  
  const { filterVariant } = column.columnDef.meta ?? {}

  const options = [
    { label: "sold", value: "sold" },
    { label: "received", value: "received" },
    { label: "pending purchase", value: "pending purchase" },
    { label: "pending sale", value: "pending sale" },
  ];

  const [selected, setSelected] = React.useState([...options]);

  const isFilterActive = selected.length != options.length

  return filterVariant == 'status' ? (
    <>
      <Box as='span' display="inline-block" pl={2}>
        <div data-theme={colorMode}>
          <div className={`custom-multiselect ${isFilterActive ? 'has-selected' : ''}`}>
            <MultiSelect
              options={options}
              value={selected}
              onChange={setFilterValue}
              disableSearch
              hasSelectAll={false}
              className="custom-multiselect"
            />
          </div>
        </div>
      </Box>
    </>
  ) : (null)

  function setFilterValue(selectedValueDropDown) {
    setSelected(selectedValueDropDown)
    const selectedValuesArray = selectedValueDropDown.map(option => option.value);
    column.setFilterValue(selectedValuesArray);
  }
}

export default HistoryTab;