import { Box, Button, Flex, HStack, Popover, PopoverBody, PopoverContent, PopoverTrigger, Text, useColorMode, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";


export default function Filter({column, warehouses}){
  const { colorMode } = useColorMode();
  
  const { filterVariant } = column.columnDef.meta ?? {}

  if (filterVariant == 'warehouse') {

    const options = warehouses.map((x, index) => {
      return { label: x.name, value: x.id }
    });

    const [warehouseSelected, setWarehouseSelected] = React.useState([]);

    const isFilterActive = warehouseSelected.length != options.length && warehouseSelected.length

    return (
      <Box as='span' display="inline-block" pl={2}>
        <div data-theme={colorMode}>
          <div className={`custom-multiselect ${isFilterActive ? 'has-selected' : ''}`}>
            <MultiSelect
              options={options}
              value={warehouseSelected}
              onChange={setFilterValue}
              disableSearch
              hasSelectAll={false}
              className="custom-multiselect"
            />
          </div>
        </div>
      </Box>
    )

    function setFilterValue(selectedValueDropDown) {
      setWarehouseSelected(selectedValueDropDown)
      const selectedValuesArray = selectedValueDropDown.map(option => option.value);
      column.setFilterValue(selectedValuesArray);
    }
    
  } else if (filterVariant == 'status') {

    const options = [
      { label: "sold", value: "sold" },
      { label: "received", value: "received" },
      { label: "pending purchase", value: "pending purchase" },
      { label: "pending sale", value: "pending sale" },
    ];

    const [selected, setSelected] = React.useState([]);

    const isFilterActive = selected.length != options.length && selected.length

    return (
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
    )

    function setFilterValue(selectedValueDropDown) {
      setSelected(selectedValueDropDown)
      const selectedValuesArray = selectedValueDropDown.map(option => option.value);
      column.setFilterValue(selectedValuesArray);
    }
  } else if (filterVariant == 'date') {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const handleStartDateChange = (e) => {
      const newStartDate = e.target.value
      
      if ( newStartDate && endDate && newStartDate > endDate) {
        setStartDate(endDate)
        setEndDate(newStartDate)
        column.setFilterValue({startDate: endDate, endDate: newStartDate})
      } else {
        setStartDate(newStartDate)
        column.setFilterValue((prev) => ({ ...prev, startDate: newStartDate }));
      }
    }

    const handleEndDateChange = (e) => {
      const newEndDate = e.target.value
      
      if (newEndDate && startDate && newEndDate < startDate) {
        setEndDate(startDate)
        setStartDate(newEndDate)
        column.setFilterValue({startDate: newEndDate, endDate: startDate})
      } else {
        setEndDate(newEndDate)
        column.setFilterValue((prev) => ({ ...prev, endDate: newEndDate }));
      }
    }

    const isFilterActive = startDate || endDate;

    const { isOpen, onToggle, onClose } = useDisclosure();

    function manage30DayClick() {
      setEndDate(new Date().toISOString().split('T')[0])

      var dateOffset = (24*60*60*1000) * 30;
      var myDate = new Date();
      myDate.setTime(myDate.getTime() - dateOffset);

      setStartDate(myDate.toISOString().split('T')[0]);
    }

    function manageThisMonthClick() {
      let month = new Date().getMonth();
      let year = new Date().getFullYear();
      let myDate = new Date(year + '-' + (month+1))
      setStartDate(myDate.toISOString().split('T')[0]);

      myDate = new Date(year, (month + 1))
      myDate.setTime(myDate.getTime() - 1)

      setEndDate(myDate.toISOString().split('T')[0]);

    }

    return (
      <Popover 
        isOpen={isOpen} 
        onClose={onClose}
      >
        <PopoverTrigger >
          <Box as='span' display="inline-block" pl={2}>
            <div data-theme={colorMode}>
              <div className={`custom-multiselect ${isFilterActive ? 'has-selected' : ''}`}>
                <div 
                  className="dropdown-container"
                  onClick={onToggle}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="dropdown-heading"></div>
                </div>
              </div>
            </div>
          </Box>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            {startDate && endDate ? <>{`${startDate} - ${endDate}`}</> : startDate ? <>after {startDate}</> :
              endDate ? <>before {endDate} </> : <>Select Both Dates to Filter</>}
            <Flex gap={4} mt={2}>
              <Box flex={1}>
                <Text mb={2}>Start Date</Text>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={handleStartDateChange}
                  style={{
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px'
                  }}
                />
              </Box>
              <Box flex={1}>
                <Text mb={2}>End Date</Text>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={handleEndDateChange}
                  style={{
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px'
                  }}
                />
              </Box>
            </Flex>
            <HStack>
              <Button colorScheme={"blue"} onClick={manage30DayClick} mt={2} size={"sm"}>Last 30 days</Button>
              <Button colorScheme={"blue"} onClick={manageThisMonthClick} mt={2} size={"sm"}>This Month</Button>
              <Button colorScheme="blue" mt={2} size={"sm"} 
                onClick={() => {setEndDate(''); setStartDate(''); column.setFilterValue({});} }
              >Remove Filter</Button>
            </HStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    )
  }
}