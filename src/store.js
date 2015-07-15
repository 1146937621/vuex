function Store (options, owner) {
  this.name = options.name
  this.owner = owner
  Object.defineProperty(this, 'state', {
    get: function () {
      return options.state
    },
    set: function () {
      console.warn('You should never change a store\'s state reference.')
    }
  })
  this.actions = {}
  // register actions
  var self = this
  Object.keys(options.actions).forEach(function (action) {
    if (self.actions[action]) {
      console.warn('action already defined: ' + action)
      return
    }
    self.actions[action] = options.actions[action]
    owner.registerAction(action)
  })
}

Store.prototype.handleAction = function (action, args, debug) {
  var handler = this.actions[action]
  if (handler) {
    var record
    if (debug) {
      record = {
        name: this.name,
        beforeState: JSON.parse(JSON.stringify(this.state))
      }
      var history = this.owner.history
      history[history.length - 1].affectedStores.push(record)
    }
    // actually apply the handler
    handler.apply(this, args)
    if (debug) {
      record.afterState = JSON.parse(JSON.stringify(this.state))
    }
  }
}

module.exports = Store
