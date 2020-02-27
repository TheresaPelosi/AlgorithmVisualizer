import React, {Component} from 'react';

import './Cell.css';

export default class Cell extends Component {
  render() {
    const {
      col,
      row,
      type,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;

    return (
      <div
        id={`cell-${row}-${col}`}
        className={`cell normal ${type}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}