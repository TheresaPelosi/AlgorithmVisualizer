import {Algorithm} from './algorithm';

export class Dijkstra extends Algorithm {
    constructor() {
        super();
        this.executeAlgorithm = this.executeAlgorithm.bind(this);
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
}