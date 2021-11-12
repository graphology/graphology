# Graphology Communities Louvain

Implementation of the [Louvain algorihtm](https://en.wikipedia.org/wiki/Louvain_modularity) for community detection to be used with [`graphology`](https://graphology.github.io).

## References

> M. E. J. Newman, « Modularity and community structure in networks », Proc. Natl. Acad. Sci. USA, vol. 103, no 23, 2006, p. 8577–8582 https://dx.doi.org/10.1073%2Fpnas.0601602103

> Newman, M. E. J. « Community detection in networks: Modularity optimization and maximum likelihood are equivalent ». Physical Review E, vol. 94, no 5, novembre 2016, p. 052315. arXiv.org, doi:10.1103/PhysRevE.94.052315. https://arxiv.org/pdf/1606.02319.pdf

> Blondel, Vincent D., et al. « Fast unfolding of communities in large networks ». Journal of Statistical Mechanics: Theory and Experiment, vol. 2008, no 10, octobre 2008, p. P10008. DOI.org (Crossref), doi:10.1088/1742-5468/2008/10/P10008. https://arxiv.org/pdf/0803.0476.pdf

> Nicolas Dugué, Anthony Perez. Directed Louvain: maximizing modularity in directed networks. [Research Report] Université d’Orléans. 2015. hal-01231784 https://hal.archives-ouvertes.fr/hal-01231784

> R. Lambiotte, J.-C. Delvenne and M. Barahona. Laplacian Dynamics and Multiscale Modular Structure in Networks, doi:10.1109/TNSE.2015.2391998. https://arxiv.org/abs/0812.1770

> Traag, V. A., et al. « From Louvain to Leiden: Guaranteeing Well-Connected Communities ». Scientific Reports, vol. 9, no 1, décembre 2019, p. 5233. DOI.org (Crossref), doi:10.1038/s41598-019-41695-z. https://arxiv.org/abs/1810.08473

## Installation

```
npm install graphology-communities-louvain
```

## Usage

Runs the Louvain algorithm to detect communities in the given graph. It works both for undirected & directed graph by using the relevant modularity computations.

This function also works on multi graphs but won't work with mixed graph as it is not trivial to adapt modularity to this case. As such, if you need to process a true mixed graph (this function will correctly handle mixed graphs containing only directed or undirected edges), cast your graph as either directed or undirected using [graphology-operators](https://github.com/graphology/graphology-operators) dedicated functions.

Note also that this algorithm's run time is bounded by the number of edges in your graph. As such, it might be preferable, in some cases, to cast your multi graph as a simple one using [graphology-operators](https://github.com/graphology/graphology-operators) functions for better performance.

Note that the community labels are returned as an integer range from 0 to n.

```js
import louvain from 'graphology-communities-louvain';

// To retrieve the partition
const communities = louvain(graph);

// To directly assign communities as a node attribute
louvain.assign(graph);

// If you need to pass custom options
louvain.assign(graph, {
  attributes: {
    weight: 'myCustomWeight',
    community: 'myCustomCommunity'
  }
});

// If you want to return some details about the algorithm's execution
var details = louvain.detailed(graph);
```

_Arguments_

- **graph** _Graph_: target graph.
- **options** _?object_: options:
  - **attributes** _?object_: attributes' names:
    - **weight** _?string_ [`weight`]: name of the edges' weight attribute.
    - **community** _?string_ [`community`]: name of the community attribute.
  - **fastLocalMoves** _?boolean_ [`true`]: whether to use a well-known optimization relying on a queue set to traverse the graph more efficiently.
  - **randomWalk** _?boolean_ [`true`]: whether to traverse the graph randomly.
  - **resolution** _?number_ [`1`]: resolution parameter. An increased resolution should produce more communities.
  - **rng** _?function_ [`Math.random`]: RNG function to use for `randomWalk`. Useful if you need to seed your rng using, for instance, [seedrandom](https://www.npmjs.com/package/seedrandom).
  - **weighted** _?boolean_ [`false`]: whether to take edge weights into account.

_Detailed Output_

- **communities** [`object`]: partition of the graph.
- **count** [`number`]: number of communities in the partition.
- **deltaComputations** [`number`]: number of delta computations that were run to produce the partition.
- **dendrogram** [`array`]: array of partitions.
- **modularity** [`number`]: final modularity of the graph given the found partition.
- **moves** [`array`]: array of array of number of moves if `fastLocalMoves` was false or array of number of moves if `fastLocalMoves` was true.
- **nodesVisited** [`number`]: number of times nodes were visited.

## Benchmark

To run the benchmark:

```
npm install --no-save ngraph.louvain.native
node benchmark/comparison.js
```

```
Clustered Undirected graph with 1000 nodes and 9724 edges.

graphology undirected1000: 52.732ms
Communities 8
Modularity 0.42944314393593924

jlouvain undirected1000: 2368.053ms
Communities 8
Modularity 0.4302331134880074

ngraph.louvain undirected1000: 71.108ms
Communities 8

ngraph.louvain.native undirected1000: 39.185ms
Communities 7

---

EuroSIS Directed graph with 1285 nodes and 7524 edges.

graphology euroSis: 30.809ms
Communities 19
Modularity 0.7375260763995757

jlouvain euroSis: 1310.008ms
Communities 23
Modularity 0.7376116434498033

ngraph euroSis: 38.262ms
Communities 16

ngraph.native euroSis: 20.018ms
Communities 16

---

Big Undirected graph with 50000 nodes and 994713 edges.

graphology bigGraph: 937.942ms
Communities 43
Modularity 0.481431448861252

jLouvain is too slow...

ngraph bigGraph: 7783.050ms
Communities 44

ngraph.native bigGraph: 8415.692ms
Communities 1
```
