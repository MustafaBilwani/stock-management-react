import { Box, Button, Input, Text } from "@chakra-ui/react";
import { FiCheck, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

export const CreateColumns = ({
  editDetail,
  setEditDetail,
  setEditDetailProduct,
  saveEditDetail,
  deleteDetail,
  setProps,
  onOpen,
  warehouses
}) => [
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
    },
    meta: {
      filterVariant: 'date',
    },
    filterFn: (row, columnId, filterValues) => {
      const rowValue = row.getValue(columnId)
      const { startDate, endDate } = filterValues;

      if (!startDate && !endDate) {
        return true;
      }

      if (startDate && !endDate) {
        return rowValue >= startDate;
      }

      if (endDate && !startDate) {
        return rowValue <= endDate;
      }

      return rowValue >= startDate && rowValue <= endDate;
    }
  },
  {
    id: 'notes',
    header: 'Notes',
    accessorKey: 'notes',
    cell: (info) => {
      const row = info.row.original
      
      return row.id == editDetail ? (
        <Text id="editingNotes" contentEditable outline="2px solid" outlineColor={'blue.300'} pl={1} borderRadius="4px" suppressContentEditableWarning >
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
        return <Text id="editingComing" contentEditable outline="2px solid" outlineColor={'blue.300'} pl={1} borderRadius="4px" suppressContentEditableWarning>{row.coming}</Text>
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

      if(!row.going) return ''

      return row.id == editDetail ? (
        <Text id="editingGoing" contentEditable outline="2px solid" outlineColor={'blue.300'} pl={1} borderRadius="4px" suppressContentEditableWarning>{row.going}</Text>
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

      if(!row.price) return ''

      return row.id == editDetail ? (
        <Text contentEditable id="editingPrice" outline="2px solid" outlineColor={'blue.300'} pl={1} borderRadius="4px" suppressContentEditableWarning>{row.price}</Text>
      ) : (
        <span>{row.price}</span>
      )
    }
  },
  {
    id: 'warehouse',
    header: 'Warehouse',
    accessorKey: 'warehouse',
    meta: {
      filterVariant: 'warehouse',
    },
    cell: ({ row }) => {
      const warehouse = row.getValue('warehouse')
      const name = warehouses.find(w => w.id === warehouse)?.name
      return name
    },
    filterFn: (row, columnId, filterValues) => {
      if (!filterValues[0]) return true;
      const rowValue = row.getValue(columnId)
      return filterValues.includes(rowValue);
    }
  },
  {
    id: 'status',
    header: 'Status',
    accessorFn: (row) => {
      if (row.coming > 0 && new Date(row.date) > new Date()){
        return 'pending purchase'
      } else if (row.coming > 0) {
        return 'received'
      } else if (row.going > 0 && new Date(row.date) > new Date()) {
        return 'pending sale'
      } else if (row.going > 0) {
        return 'sold'
      } else if (row.transferQty > 0 && new Date(row.date) > new Date()) {
        return 'pending transfer'
      } else if (row.transferQty > 0) {
        return 'transfered'
      }
    },
    meta: {
      filterVariant: 'status',
    },
    filterFn: (row, columnId, filterValues) => {
      if (!filterValues[0]) return true;
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
    accessorKey: 'currentStock',
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
          <Button size="sm" variant="outline" colorScheme="red"
            onClick={() => {
              setProps({
                onConfirm: () => {deleteDetail(info.row.original.id); onOpen()},
                onClose: onOpen,
                type: "confirmation",
                alertHeading: "Delete entry",
                alertText: "Are you sure? You can't undo this action afterwards.",
              });
              onOpen()
            }}><FiTrash2/></Button>
        </>
      )
    }
  },
];