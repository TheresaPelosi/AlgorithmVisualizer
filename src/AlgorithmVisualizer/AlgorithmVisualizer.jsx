import React, {Component} from 'react';
import Cell from './Cell';
import {Dijkstra} from '../algorithms/dijkstras';

import './AlgorithmVisualizer.css';

class CellType {
    static START = 'start';
    static END = 'end';
    static WALL = 'wall';
    static NORMAL = 'normal';
}

let START_CELL_ROW = -1;
let START_CELL_COL = -1;
let END_CELL_ROW = -1;
let END_CELL_COL = -1;
let algorithm = new Dijkstra();

export default class AlgorithmVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      width: 0,
      height: 0,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    const { width, height} = this.state;
    const newWidth = Math.max(window.innerWidth - 100, 0) / 25;
    const newHeight = Math.max(window.innerHeight - 150, 0) / 25;

    if (END_CELL_ROW === START_CELL_ROW && START_CELL_COL === END_CELL_COL && START_CELL_COL === -1) {
        END_CELL_ROW = START_CELL_ROW = Math.floor(newHeight / 2);
        START_CELL_COL = Math.floor(newWidth / 3);
        END_CELL_COL = Math.floor(newWidth / 3) * 2;
    } else {
        const widthRatio = newWidth / width;
        const heightRatio = newHeight / height;

        START_CELL_ROW = Math.floor(START_CELL_ROW * heightRatio);
        START_CELL_COL = Math.floor(START_CELL_COL * widthRatio);
        END_CELL_ROW = Math.floor(END_CELL_ROW * heightRatio);
        END_CELL_COL = Math.floor(END_CELL_COL * widthRatio);
    }
    const grid = generateGrid(newWidth, newHeight);
    this.setState({ width: newWidth, height: newHeight, grid });
  }

  handleMouseDown(row, col) {
    const newGrid = toggleCellWall(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = toggleCellWall(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  visualize() {
    let {grid} = this.state;
    grid.forEach((row) => {
        row.forEach((cell) => {
          document.getElementById(`cell-${cell.row}-${cell.col}`).className = document
              .getElementById(`cell-${cell.row}-${cell.col}`).className.replace(' visited', '')
              .replace(' shortest-path', '');
        })
    });
    const startCell = grid[START_CELL_ROW][START_CELL_COL];
    const endCell = grid[END_CELL_ROW][END_CELL_COL];
    const visitedCells = algorithm.executeAlgorithm(grid, startCell, endCell);
    const path = algorithm.getPath(endCell);
    this.animate(visitedCells, path);
  }

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`cell-${node.row}-${node.col}`).className +=
          ' visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`cell-${node.row}-${node.col}`).className +=
          ' shortest-path';
      }, 50 * i);
    }
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
        <>
        <button onClick={() => this.visualize()}>
          Visualize Dijkstra's Algorithm
        </button>
        <div className="grid centered">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((cell, cellIdx) => {
                  const {row, col, type} = cell;
                  return (
                    <Cell
                      key={cellIdx}
                      col={col}
                      row={row}
                      type={type}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}>
                    </Cell>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const generateGrid = (width, height) => {
  const grid = [];
  for (let row = 0; row < height; row++) {
    const currentRow = [];
    for (let col = 0; col < width; col++) {
      if (col === START_CELL_COL && row === START_CELL_ROW) {
          currentRow.push(createCell(col, row, CellType.START));
      } else if (col === END_CELL_COL && row === END_CELL_ROW) {
          currentRow.push(createCell(col, row, CellType.END));
      } else {
          currentRow.push(createCell(col, row, CellType.NORMAL));
      }
    }
    grid.push(currentRow);
  }
  return grid;
};

const createCell = (col, row, type) => {
  return {
    col,
    row,
    type: type,
    distance: Infinity,
    isVisited: false,
    previousCell: null,
  };
};

const toggleCellWall = (grid, row, col) => {
  const newGrid = grid.slice();
  const cell = newGrid[row][col];
  const newCell = {
    ...cell,
    type: cell.type === CellType.WALL ? CellType.NORMAL : CellType.WALL,
  };
  newGrid[row][col] = newCell;
  return newGrid;
};