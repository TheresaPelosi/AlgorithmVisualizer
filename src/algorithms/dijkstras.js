export class Dijkstra {
    constructor() {
        this.executeAlgorithm = this.executeAlgorithm.bind(this);
        this.getAllCells = this.getAllCells.bind(this);
        this.sortCellsByDistance = this.sortCellsByDistance.bind(this);
        this.updateUnvisitedNeighbors = this.updateUnvisitedNeighbors.bind(this);
        this.getUnvisitedNeighbors = this.getUnvisitedNeighbors.bind(this);
        this.getPath = this.getPath.bind(this);
    }

    executeAlgorithm(grid, start, end) {
        let visitedCells = [];
        start.distance = 0;
        const unvisitedCells = this.getAllCells(grid);
        while (!!unvisitedCells.length) {
            this.sortCellsByDistance(unvisitedCells);
            const neighbor = unvisitedCells.shift();
            if (neighbor.distance === Infinity) {
                return visitedCells;
            }
            neighbor.isVisited = true;
            visitedCells.push(neighbor);
            if (neighbor === end) {
                return visitedCells;
            }
            this.updateUnvisitedNeighbors(neighbor, grid);
        }
    }

    sortCellsByDistance(unvisitedCells) {
        unvisitedCells.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    }

    updateUnvisitedNeighbors(cell, grid) {
        const unvisitedNeighbors = this.getUnvisitedNeighbors(cell, grid);
        for (const neighbor of unvisitedNeighbors) {
            neighbor.distance = cell.distance + 1;
            neighbor.previousCell = cell;
        }
    }

    getUnvisitedNeighbors(cell, grid) {
      const neighbors = [];
      const {col, row} = cell;
      if (row > 0) neighbors.push(grid[row - 1][col]);
      if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
      if (col > 0) neighbors.push(grid[row][col - 1]);
      if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
      return neighbors.filter(neighbor => !neighbor.isVisited);
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