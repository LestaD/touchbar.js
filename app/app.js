const R = require('ramda')
const win = require('electron').remote.getCurrentWindow()
const TouchBar = require('electron').remote.TouchBar

const touchbar = R.pipe(
  R.filter(e => !!e),
  R.flatten,
  R.constructN(1, TouchBar)
)

const namingMap = {
  button: TouchBar.TouchBarButton,
  spacer: TouchBar.TouchBarSpacer,
  label: TouchBar.TouchBarLabel,
  slider: TouchBar.TouchBarSlider,
  popover: TouchBar.TouchBarPopover,
}

const it = R.pipe(
  R.keys,
  R.reduce((acc, type) => R.merge(acc, { [type]: props => new (namingMap[type])(props) }), {})
)(namingMap)

const update = R.curry((wn, tb) => wn.setTouchBar(tb))

// ------------------- //

class TB {
  static create(element, props, child) {
  }

  render(root) {
  }
}

class Component {
  constructor() {
    this.state = {}
    Object.assign(this, it)
  }

  setState(newState, quiet) {
    this.state = Object.assign({}, this.state, newState)
    if (!quiet) {
      this.applyComponent()
    }
  }

  applyComponent() {
    update(win, touchbar(this.render()))
  }
}

class TouchBarComponent extends Component {
  constructor() {
    super()
    this.state = {
      opened: false,
      page: 'main',
    }
  }

  changePage(page) {
    return () => this.setState({ page })
  }

  renderMainPage() {
    return [
      this.label({ label: this.state.opened ? 'State: opened' : 'State: closed' }),
      this.button({ label: 'Another page', click: this.changePage('another') }),
      this.button({ label: 'Wrong page', click: this.changePage('fofofofofo') }),
    ]
  }

  renderAnotherPage() {
    return [
      this.label({ label: 'Another page' }),
      this.button({ label: 'Go back', click: this.changePage('main') })
    ]
  }

  renderNotFound() {
    return [
      this.label({ label: 'Page not found' }),
      this.spacer({ size: 'large' }),
      this.button({ label: 'Go to home', click: this.changePage('main') })
    ]
  }

  render() {
    console.log(this.state)
    switch (this.state.page) {
      case 'main': return this.renderMainPage()
      case 'another': return this.renderAnotherPage()
      default: return this.renderNotFound()
    }
  }
}


new TouchBarComponent().applyComponent()
