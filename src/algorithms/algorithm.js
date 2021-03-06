import { cellType } from '../AlgorithmVisualizer/AlgorithmVisualizer.jsx'

export class Algorithm {
    constructor() {
        this.getAllCells = this.getAllCells.bind(this);
        this.sortCellsByDistance = this.sortCellsByDistance.bind(this);
        this.updateUnvisitedNeighbors = this.updateUnvisitedNeighbors.bind(this);
        this.getUnvisitedNeighbors = this.getUnvisitedNeighbors.bind(this);
    }

    sortCellsByDistance(unvisitedCells) {
        unvisitedCells.sort((left, right) => left.distance - right.distance);
    }

    updateUnvisitedNeighbors(cell, grid) {
        const unvisitedNeighbors = this.getUnvisitedNeighbors(cell, grid);
        for (const neighbor of unvisitedNeighbors) {
            neighbor.distance = cell.distance + neighbor.weight;
            neighbor.previousCell = cell;
        }
    }

    getUnvisitedNeighbors(cell, grid) {
      let neighbors = [];
      const {col, row} = cell;
      if (row > 0) neighbors.push(grid[row - 1][col]);
      if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
      if (col > 0) neighbors.push(grid[row][col - 1]);
      if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

      return neighbors.filter(neighbor => !neighbor.isVisited && !(neighbor.type === cellType.WALL));
    }

    getAllCells(grid) {
        const cells = [];
        for (const row of grid) {
            for (const cell of row) {
                cells.push(cell);
            }
        }
        return cells;
    }

    getPath(end) {
        const path = [];
        let current = end;
        while (current !== null) {
            path.unshift(current);
            current = current.previousCell;
        }
        return path;
    }
}