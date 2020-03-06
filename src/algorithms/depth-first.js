import {Algorithm} from './algorithm';

export class DepthFirst extends Algorithm {
    constructor() {
        super();
        this.executeAlgorithm = this.executeAlgorithm.bind(this);
    }

    executeAlgorithm(grid, start, end) {
      let visitedCells = [];
      let stack = [start];

      while (!!stack.length) {
        let head = stack.shift();

        if (!head.isVisited) {
          head.isVisited = true;
          visitedCells.push(head);
          if (head === end) {
            return visitedCells;
          }

          this.updateUnvisitedNeighbors(head, grid);
          for (let neighbor of this.getUnvisitedNeighbors(head, grid)) {
            stack.unshift(neighbor);
          }
        }
      }

      return visitedCells;
    }
}