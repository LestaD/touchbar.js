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

  render() {
    return [
      TB.create('button', { label: 'Example', click: () => console.log('Example clicked') }),
      TB.create('spacer', { size: 'large' }),
      TB.create('label', { label: 'Some label' }),
      TB.create('popover', { label: 'Popover' }, [
        TB.create('label', { label: 'Popover content' }),
        TB.create('spacer', { size: 'large' }),
        TB.create('slider', { value: 5, minValue: 0, maxValue: 10 }),
      ]),
    ]
  }
}


TB.render(TB.create(TouchBarComponent))
