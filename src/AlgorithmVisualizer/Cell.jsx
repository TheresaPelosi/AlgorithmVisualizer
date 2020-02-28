import React, {Component} from 'react';
import { cellType } from '../AlgorithmVisualizer/AlgorithmVisualizer.jsx'

import './Cell.css';

export default class Cell extends Component {
  constructor() {
    super();

    this.allowDrop = this.allowDrop.bind(this);
    this.drag = this.drag.bind(this);
    this.drop = this.drop.bind(this);
  }

  allowDrop(event) {
    event.preventDefault();
  }

  drag = (event) => {
    event.dataTransfer.setData("text", event.target.id)
  }

  drop = (event) => {
    if (event.target.id) {
      console.log(event.dataTransfer.getData("text"))
      console.log(event.dataTransfer)
      event.target = document.getElementById(event.dataTransfer.getData("text"))
      event.dataTransfer.clearData()
    }
    this.props.onMouseUp();
  }

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
        onDrop={this.drop}
        onDrag={this.drag}
        onDragOver={this.allowDrop}
        id={`cell-${row}-${col}`}
        className={`cell normal ${type}`}
        draggable={(type === cellType.START || type === cellType.END)}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}