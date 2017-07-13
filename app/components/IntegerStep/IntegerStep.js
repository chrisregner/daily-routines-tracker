import React from 'react'
import PropTypes from 'prop-types'
import { Slider, InputNumber, Row, Col } from 'antd'

class IntegerStep extends React.Component {
  static propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    initialValue: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
  }

  static defaultProps = {
    isDisabled: false
  }

  state = {
    inputValue: null,
    isInitial: true,
  }

  onChange = (value) => {
    this.props.onChange(value)
    this.setState({
      inputValue: value,
    })

    if (this.state.isInitial)
      this.setState({ isInitial: false })
  }

  render() {
    const { min, max, initialValue, isDisabled } = this.props
    const { isInitial, inputValue } = this.state
    const currentVal = isInitial ? (initialValue || min) : inputValue

    return (
      <div>
        <Slider
          min={min}
          max={max}
          onChange={this.onChange}
          value={currentVal}
          disabled={isDisabled} />
        <InputNumber
          min={min}
          max={max}
          style={{ marginLeft: 16 }}
          value={currentVal}
          onChange={this.onChange}
          disabled={isDisabled} />
      </div>
    )
  }
}

export default IntegerStep