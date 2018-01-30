'use strict'

const Model = use('Model')

class Order extends Model {

  static boot () {
    super.boot()
    this.addHook('afterCreate', 'OrderHook.updateStock')
  }

  static get table() {
    return 'orders'
  }

  manufacturers () {
    return this.hasOne('App/Models/Manufacturer')
  }


}

module.exports = Order
