import {Algorithm} from './algorithm';

export class BreadthFirst extends Algorithm {
    constructor() {
        super();
        this.executeAlgorithm = this.executeAlgorithm.bind(this);
    }

    executeAlgorithm(grid, start, end) {
        let visitedCells = [];
        start.isVisited = true;
        let queue = [start];

        while (!!queue.length) {
            const head = queue.shift()

            //document.getElementById(`cell-${neighbor.row}-${neighbor.col}`).className =
              //`cell normal ${neighbor.type} visited`;
            visitedCells.push(head);
            if (head === end) {
                return visitedCells;
            }

            this.updateUnvisitedNeighbors(head, grid);
            for (let neighbor of this.getUnvisitedNeighbors(head, grid)) {
              neighbor.isVisited = true;
              queue.push(neighbor);
            }
        }

        return visitedCells;
    }
}