import {Algorithm} from './algorithm';

export class BreadthFirst extends Algorithm {
    constructor() {
        super();
        this.executeAlgorithm = this.executeAlgorithm.bind(this);
        this.getPath = this.getPath.bind(this);
    }

    executeAlgorithm(grid, start, end) {
        let visitedCells = [];
        let queue = this.getUnvisitedNeighbors(start, grid);

        while (!!queue.length) {
            console.log(queue.length)
            const neighbor = queue.shift()
            console.log(queue.length)
            console.log("Should be one smaller")

            neighbor.isVisited = true;
            visitedCells.push(neighbor);
            if (neighbor === end) {
                return visitedCells;
            }

            console.log(queue.length)
            queue = queue.concat(this.getUnvisitedNeighbors(neighbor, grid));
            console.log(queue.length)
            console.log("Should be a max of four more")
            this.updateUnvisitedNeighbors(neighbor, grid);
        }
        return visitedCells;
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