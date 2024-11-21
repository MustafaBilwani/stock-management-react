
export default function reRunDetails(product, update, setProductStockDetail, setProductStockTotal){
    
  var purchasingAmountArray = {}
  
  var stock = {
    all:{
      total: 0,
      current: 0,
      pendingPurchase: 0,
      pendingSale: 0,
    },
  }

  // take date selected by user or take current date if user hasnt selected
  var date = document.getElementById('stockSortingInput').value ? new Date(document.getElementById('stockSortingInput').value) : new Date() 
        
  for (let element of update) {

    debugger

    let currWarehouse = element.warehouse

    stock[currWarehouse] ??= {
      total: 0,
      current: 0,
      pendingPurchase: 0,
      pendingSale: 0,
    }

    if (stock.all.total < 0 || stock[currWarehouse].total < 0){
      // var update = [...productStockDetail[product]]
      // reRunDetails(product, update)
      return false; // Stop processing if stock is insufficient at that time
    }
    

    if (element.coming > 0){
      stock.all.total += element.coming
      stock[currWarehouse].total += element.coming
      element.currentStock = stock.all.total
      element.qty = element.coming; // element.qty should be restored to default in case qty is subtracted before
      purchasingAmountArray[currWarehouse] ??= [] // create array if it doesnt exist
      purchasingAmountArray[currWarehouse].push(element.id); // push id of detail to use for purchasing amount

      if (new Date(element.date) > date){
        stock.all.pendingPurchase += element.coming
        stock[currWarehouse].pendingPurchase += element.coming
      } else {
        stock.all.current += element.coming
        stock[currWarehouse].current += element.coming
      }
      
    }

    if (element.going > 0) {
      stock.all.total -= element.going
      stock[currWarehouse].total -= element.going;
      element.currentStock = stock.all.total
      var remainingQty = element.going
      var totalPrice = 0
      element.purchasingAmount = []

      if (new Date(element.date) > date){
        stock.all.pendingSale += remainingQty
        stock[currWarehouse].pendingSale += remainingQty
      } else {
        stock.all.current -= remainingQty
        stock[currWarehouse].current -= remainingQty
      } 
      
      // run while loop to add purchasing amount if it is taking purchasing amount from more than 1 details
      while(remainingQty > 0){
        let currIndex = update.findIndex(x => x.id == purchasingAmountArray[currWarehouse][0]) // find index in update array (stock detail array)
        let currDetail = update[currIndex]
        let currQty =  Math.min(currDetail.qty, remainingQty) // get least value for purchasing amount

        var purchasingAmountIndex = element.purchasingAmount.findIndex(x => x.price == currDetail.price)
        // add quantity to purchasing amount if that price is present else make new purchasing amount 
        if (purchasingAmountIndex == -1) {
          element.purchasingAmount.push({
            qty: currQty,
            price: currDetail.price
          })
        } else {
          element.purchasingAmount[purchasingAmountIndex].qty += currQty
        }
        
        totalPrice += currQty * currDetail.price
        element.profit = (  element.price - totalPrice / element.going ).toFixed(2)

        currDetail.qty -= currQty
        remainingQty -= currQty

        if(currDetail.qty == 0){
          purchasingAmountArray[currWarehouse].shift() // delete id from purchasingAmountArray if its quantity is used
        }
      
      }
    }
  }

  // update data if there was no error
  setProductStockDetail(prev => ({
    ...prev,
    [product]: [...update]
  }))

  setProductStockTotal(prevState => ({
    ...prevState,
    [product]: {...stock}
  }));
    
};