'use strict'

const StockItem = use('App/Models/StockItem')
const Product = use('App/Models/Product')
const Order = use('App/Models/Order')
const Manufacturer = use('App/Models/Manufacturer')
const Database = use('Database')

class StockController {

  async fetch({response, view, auth}) {

    let items;
    try {
      items = await StockItem.fetch()
      return await response.json({status: 'success', data: items})
    } catch(e){
      return response.status(500).json({status: 'error', message: "server error" + e})
    }
  }


  async fetchGroupBy({ request, response, params, auth}) {

       try {
         const query =  await StockItem.fetchGroupBy(params.R)
         return await {status: 'success', data: query}
       } catch (e) {
         if (e == "not found")
          return response.status(404).json({status: 'error', message: e})
         else
          return response.status(500).json({status: 'error', message: e})
       }
  }

  static jsonToSQL(json) {
    let strJSON = JSON.stringify(json)
    let query = strJSON.replace(/({|})/g,'').split(',').map((item) => item.split(':').map((item, index) => (index == 0)?item.replace(/"/g, '') + '=': item.replace(/"/g,"'")).join('')).join(' and ')
    return query
  }

  async update({ request, response }) {
    let params =  request.get()
    const updateObject = request.post()
    const productParams= await Product.findBy('R', params.R)
    const productUpdate = await Product.findOrCreate(
      {R: updateObject.R},
      {R: updateObject.R, price: updateObject.price, manufacturer_id: updateObject.manufacturer_id}
    )
    params.R = productParams.id;
    updateObject.R = rUpdate.id;
    delete params.price;
    delete params.manufacturer_id;
    const quantity = updateObject.quantity;
    delete updateObject.quantity

    if(params.size)
      params.size = Number(params.size)
  //  Update R related values
    if(updateObject.manufacturer_id || updateObject.price) {
      let updateObjectClone = Object.assign({}, updateObject)
      Object.keys(updateObjectClone).forEach((key) => { // remove manufacturer_id and price from updateObject and keep them only in case of the clone (to update the R attrs)
        (key != 'manufacturer_id' && key != 'price')?delete updateObjectClone[key]:delete updateObject[key]
      })
    const product = await Product
        .query()
        .where({id: updateObject.R})
        .update(updateObjectClone)
    }

    console.log(params);
  //  Update stock
    const updates= await StockItem
      .query()
      .where(params)
      .update(updateObject)

    console.log(updateObject);
  // add or delete items from stock
    const count = await StockItem
      .query()
      .where(updateObject)
      .count()
      console.log(count[0]['count(*)']);
    const diff = (quantity)?quantity - count[0]['count(*)']: null
    console.log(diff);
    if(diff && diff != 0) {
      if(diff > 0) {
        let objects = [1]
        updateObject.order_id = -1
        objects.fill(updateObject,0,diff)
        console.log(objects);
        const items = await StockItem.createMany(objects)
        console.log(items);
      }
      else {
        console.log('hello');

        await Database.raw(`DELETE FROM stock where ${StockController.jsonToSQL(updateObject)} limit ${Math.abs(diff)}`)
      }
    }

    return response.send();
  }
}

module.exports = StockController
