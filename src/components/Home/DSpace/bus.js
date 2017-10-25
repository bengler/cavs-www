class Bus {
  constructor() {
    this.handlers = []
  }

  subscribe(handler) {
    this.handlers.push(handler)
    return () => {
      this.unsubscribe(handler)
    }
  }

  unsubscribe(handler) {
    this.handlers = this.handlers.filter(h => h !== handler)
  }

  dispatch(message) {
    //console.log('bus', JSON.stringify(message))
    this.handlers.forEach(handler => handler(message))
  }
}

export default new Bus()
