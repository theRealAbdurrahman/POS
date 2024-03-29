'use strict'

const Order = use('App/Models/Order')
const Manufacturer = use('App/Models/Manufacturer')
const {validateItems} = use('App/Helpers')
const Validator = use('Validator')
const Product = use('App/Models/Product')
const StockItem = use('App/Models/StockItem')

class OrderController {

  async fetch({response, view, auth}) {

    let orders =
    await Order
      .query()
      .select('orders.*', 'manufacturers.name as manufacturer')
      .innerJoin('manufacturers', 'manufacturers.id', 'orders.manufacturer_id')

    orders = orders.map((order) => {
          order.items = undefined;
          return order
    })
    return orders
  }

  async fetchByID({ response, request, params}) {
    const order = await Order
      .query()
      .with('manufacturer')
      .where('orders.id', '=', params.id)
      .fetch()

    const stock = await StockItem.fetchGroupByGen({order_id: params.id})
      response.json({status: "success", data: {order: order, items: stock}})
  }

  async addOrder({ request, response, auth}) {

    const requestObject = request.all()

    const rules = {
      manufacturer_id: 'required|integer',
      cost: 'required',
      items: 'required|array',
    }

    const validation = await Validator.validate(request.post(), rules)

    if (validation.fails()){
      return response.status(400).json({status: "error", type: "validation", validation_error: validation.messages()})
    }

    const manufacturer_id = requestObject.manufacturer_id;
    const cost = requestObject.cost;
    const items = requestObject.items;
    const date = requestObject.date


    let notValid = await validateItems(items, response)

    if(notValid)
       return response.status(400).json(notValid)

    const order = new Order()
    order.manufacturer_id = manufacturer_id, order.cost = cost
    await order.save()

    let itemsArr = []
    for (let item of items) {
      for (var i = 0; i < item.quantity; i++) {
        const product = await Product.findOrCreate({R: item.R}, {R: item.R, manufacturer_id: order.manufacturer_id, price: item.price})  // add R. if it doesn't exist
        const sizes = item.sizes
        for (let size of sizes) {
          itemsArr.push({color: item.color, R: 6, size: size, order_id: order.id})
        }
      }
    }
    await StockItem.createMany(itemsArr)
    return  response.json({status: "success"})
  }

  async update({ request, response, params }) {
    await Order
      .query()
      .where(params.id)
      .update(request.post().order)
    await StockItem
        .query()
        .where('order_id', '=', params.id)
        .delete()

    const requestOrderObject = request.post().order
    const manufacturer_id = requestObject.manufacturer_id;
    const cost = requestObject.cost;
    const items = request.post().items

    let notValid = await validateItems(items, response)

    if(notValid)
       return response.status(400).json(notValid)

    for (let item of items) {
      for (var i = 0; i < item.quantity; i++) {
        const product = await Product.
          query()
          .where({R: item.R})
          .update({R: item.R, manufacturer_id: order.manufacturer_id, price: item.price})

        const sizes = item.sizes
        for (let size of sizes) {
          const stockItem = await StockItem.create({color: item.color, R: product.id, size: size, order_id: order.id})
        }
      }
    }
    return  response.json({status: "success"})
  }

  async delete ({request, response, params}) {
    const rules = {
      id: 'required|string'
    }

    const validation = await Validator.validate(params, rules)
    if (validation.fails()){
      return response.status(400).json({status: "error", message: "id required"})
    }
    try {
      const order = await Order.findOrFail(params.id)
      await order.delete()
      return response.json({status: "success"})
    } catch (e) {
      if(e.name =='ModelNotFoundException')
        return response.json({status: "error", message: "item not found"})
      return response.status(500).json({status: 'error', message: 'server error'})
      }
  }
}

module.exports = OrderController
