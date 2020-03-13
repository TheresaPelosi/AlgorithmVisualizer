import React, {Component} from 'react';
import SplitButton from 'react-bootstrap/SplitButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button';

import Cell from './Cell';
import {Dijkstra} from '../algorithms/dijkstras';
import {BreadthFirst} from '../algorithms/breadth-first';
import {DepthFirst} from '../algorithms/depth-first';

import './AlgorithmVisualizer.css';

export const cellType = {
    START: 'start',
    END: 'end',
    WALL: 'wall',
    NORMAL: 'normal'
};

let START_CELL_ROW = -1;
let START_CELL_COL = -1;
let END_CELL_ROW = -1;
let END_CELL_COL = -1;

export default class AlgorithmVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      movingStart:  false,
      movingEnd: false,
      width: 0,
      height: 0,
      animating: false,
      algorithm: new Dijkstra(),
      algorithmName: "Dijkstra's",
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

  updateWindowDimensions(oldGrid=null) {
    const {animating, width, height} = this.state;
    const newWidth = Math.floor(Math.max(window.innerWidth - 15, 0) / 25);
    const newHeight = Math.floor(Math.max(window.innerHeight - 125, 0) / 25);

    if (END_CELL_ROW === START_CELL_ROW && START_CELL_COL === END_CELL_COL && START_CELL_COL === -1) {
        END_CELL_ROW = START_CELL_ROW = Math.floor(newHeight / 2);
        START_CELL_COL = Math.floor(newWidth / 3);
        END_CELL_COL = Math.floor(newWidth / 3) * 2;
    }

    if (!animating && width !== newWidth && height !== newWidth) {
      const grid = generateGrid(Math.max(START_CELL_COL+1, END_CELL_COL+1, newWidth),
          Math.max(START_CELL_ROW, END_CELL_ROW, newHeight), oldGrid);
      this.setState({ width: newWidth, height: newHeight, grid });
    }
  }

  handleMouseDown(row, col) {
    const { grid } = this.state;
    let newGrid = toggleCellWall(grid, row, col);
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
    this.resetBoard();
    let {grid, algorithm} = this.state;
    this.updateWindowDimensions(grid);
    const startCell = grid[START_CELL_ROW][START_CELL_COL];
    const endCell = grid[END_CELL_ROW][END_CELL_COL];
    const visitedCells = algorithm.executeAlgorithm(grid, startCell, endCell);
    const path = algorithm.getPath(endCell);
    this.animateAlgorithm(visitedCells, path);
  }

  animateAlgorithm(visitedCells, shortestPath) {
    this.setState({ animating: true })
    for (let i = 0; i <= visitedCells.length; i++) {
      if (i === visitedCells.length) {
        setTimeout(() => {
          this.animateShortestPath(shortestPath);
        }, 1000 + 10 * i);
        return;
      }
      setTimeout(() => {
        const cell = visitedCells[i];
        document.getElementById(`cell-${cell.row}-${cell.col}`).className =
          `cell normal ${cell.type} visited`;
      }, 10 * i);
    }
  }

  animateShortestPath(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const cell = shortestPath[i];
        document.getElementById(`cell-${cell.row}-${cell.col}`).className =
          `cell normal ${cell.type} shortest-path`;
      }, 50 * i);
    }
    this.setState({ animating: false })
  }

  swapAlgorithm(event) {
    event.preventDefault();
    var anchor = event.currentTarget;
    var text = anchor.text;
    var button = document.getElementById("visualize");
    button.text = text;
    //button.on('click', this.visualize());
  }

  distributeWeights() {
    const { grid } = this.state
    grid.forEach((row) => {
      row.forEach((cell) => {
        cell.weight = Math.floor(Math.random() * 10) + 1;
      })
    })
  }

  resetBoard(resetWalls=false) {
    let {grid} = this.state;
    grid.forEach((row) => {
        row.forEach((cell) => {
          document.getElementById(`cell-${cell.row}-${cell.col}`).className = `cell normal ${cell.type}`;
          cell.isVisited = false;
          if (resetWalls) {
            if (cell.type === cellType.WALL) {
              cell.className = `cell normal`;
              cell.type = cellType.NORMAL;
            }
          }
        })
    });

    this.setState({ grid })
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
        <>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <SplitButton onClick={() => this.visualize()} id="dropdown-item-button" title={`Visualize ${this.state.algorithmName}`}>
            <Dropdown.Item onClick={() => this.setState({algorithm: new Dijkstra(), algorithmName: "Dijkstra's"})} as="button">Dijkstra's</Dropdown.Item>
            <Dropdown.Item onClick={() => this.setState({algorithm: new BreadthFirst(), algorithmName: "Breadth-First Search"})} as="button">Breadth-First Search</Dropdown.Item>
            <Dropdown.Item onClick={() => this.setState({algorithm: new DepthFirst(), algorithmName: "Depth-First Search"})} as="button">Depth-First Search</Dropdown.Item>
          </SplitButton>
          <div style={{padding: '4px'}}/>
          <Button onClick={() => this.resetBoard(true)}>
            Reset
          </Button>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((cell, cellIdx) => {
                  const {row, col, type, weight} = cell;
                  return (
                    <Cell
                      key={cellIdx}
                      col={col}
                      row={row}
                      type={type}
                      weight={weight}
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

const generateGrid = (width, height, oldGrid=null) => {
  const grid = [];
  for (let row = 0; row < height; row++) {
    const currentRow = [];
    for (let col = 0; col < width; col++) {
      if (oldGrid && col <= oldGrid[0].length && row <= oldGrid.length) {
        currentRow.push(oldGrid[row][col]);
      } else if (col === START_CELL_COL && row === START_CELL_ROW) {
        currentRow.push(createCell(col, row, cellType.START));
      } else if (col === END_CELL_COL && row === END_CELL_ROW) {
        currentRow.push(createCell(col, row, cellType.END));
      } else {
        currentRow.push(createCell(col, row, cellType.NORMAL));
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
    weight: 1,
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
    type: (cell.type === cellType.NORMAL ? cellType.WALL: cell.type) ||
    (cell.type === cellType.WALL ? cellType.NORMAL : cell.type),
  };
  newGrid[row][col] = newCell;
  return newGrid;
};