export default function stockSorting(products, productStockDetail, setProductStockTotal) {
  var stockTempObject = {}
  
  var selectedDate = document.getElementById('stockSortingInput')?.value || ''

  var date = selectedDate ? new Date(selectedDate) : new Date
  products.forEach(product => {

    var stock = {
      all:{
        total: 0,
        current: 0,
        pendingSale: 0,
        pendingPurchase: 0
      },
    }
    
    productStockDetail[product.id].forEach(detail => {
      const detailDate = new Date(detail.date);

      let currWarehouse = detail.warehouse
      stock[currWarehouse] ??= {
        total: 0,
        current: 0,
        pendingPurchase: 0,
        pendingSale: 0,
      }
      
      if (detail.coming > 0 && detailDate > date) {
        stock.all.total += detail.coming;
        stock.all.pendingPurchase += detail.coming;
        stock[currWarehouse].pendingPurchase += detail.coming;
      } else if (detail.coming > 0) {
        stock.all.total += detail.coming;
        stock.all.current += detail.coming;
        stock[currWarehouse].current += detail.coming;
      } else if (detail.going > 0 && detailDate > date) {
        stock.all.total += detail.going;
        stock.all.pendingSale += detail.going;
        stock[currWarehouse].pendingSale += detail.going;
      } else if (detail.going > 0) {
        stock.all.total -= detail.going;
        stock.all.current -= detail.going;
        stock[currWarehouse].current -= detail.going;
      }
    })
    stockTempObject[product.id] = {...stock}
  });
  setProductStockTotal(stockTempObject)
}