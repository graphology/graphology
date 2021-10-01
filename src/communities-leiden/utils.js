/**
 * Graphology Leiden Utils
 * ========================
 *
 * Miscellaneous utilities used by the Leiden algorithm.
 */
var SparseMap = require('mnemonist/sparse-map');
var createRandom = require('pandemonium/random').createRandom;

function addWeightToCommunity(map, community, weight) {
  var currentWeight = map.get(community);

  if (typeof currentWeight === 'undefined')
    currentWeight = 0;

  currentWeight += weight;

  map.set(community, currentWeight);
}

function UndirectedLeidenAddenda(index, options) {
  options = options || {};

  var rng = options.rng || Math.random;
  var randomness = 'randomness' in options ? options.randomness : 0.01;

  this.index = index;
  this.random = createRandom(rng);
  this.randomness = randomness;
  this.rng = rng;

  var NodesPointerArray = index.counts.constructor;
  var WeightsArray = index.weights.constructor;

  var order = index.C;
  this.resolution = index.resolution;

  // Used to group nodes by communities
  this.B = index.C;
  this.C = 0;
  this.communitiesOffsets = new NodesPointerArray(order);
  this.nodesSortedByCommunities = new NodesPointerArray(order);
  this.communitiesBounds = new NodesPointerArray(order + 1);

  // Used to merge nodes subsets
  this.communityWeights = new WeightsArray(order);
  this.degrees = new WeightsArray(order);
  this.nonSingleton = new Uint8Array(order);
  this.externalEdgeWeightPerCommunity = new WeightsArray(order);
  this.belongings = new NodesPointerArray(order);
  this.neighboringCommunities = new SparseMap(WeightsArray, order);
  this.cumulativeIncrement = new Float64Array(order);
  this.macroCommunities = null;
}

UndirectedLeidenAddenda.prototype.groupByCommunities = function() {
  var index = this.index;

  var n, i, c, b, o;

  n = 0;
  o = 0;

  for (i = 0; i < index.C; i++) {
    c = index.counts[i];

    if (c !== 0) {
      this.communitiesBounds[o++] = n;
      n += c;
      this.communitiesOffsets[i] = n;
    }
  }

  this.communitiesBounds[o] = n;

  o = 0;

  for (i = 0; i < index.C; i++) {
    b = index.belongings[i];
    o = --this.communitiesOffsets[b];
    this.nodesSortedByCommunities[o] = i;
  }

  this.B = index.C - index.U;
  this.C = index.C;
};

UndirectedLeidenAddenda.prototype.communities = function() {
  var communities = new Array(this.B);

  var i, j, community, start, stop;

  for (i = 0; i < this.B; i++) {
    start = this.communitiesBounds[i];
    stop = this.communitiesBounds[i + 1];
    community = []; // NOTE: size can be given

    for (j = start; j < stop; j++) {
      community.push(j);
    }

    communities[i] = community;
  }

  return communities;
};

UndirectedLeidenAddenda.prototype.mergeNodesSubset = function(start, stop) {
  var index = this.index;
  // console.log()
  var currentMacroCommunity = index.belongings[this.nodesSortedByCommunities[start]];
  var neighboringCommunities = this.neighboringCommunities;

  var totalNodeWeight = 0;

  var i, j, w;
  var ei, el, et;

  // Initializing singletons
  for (j = start; j < stop; j++) {
    i = this.nodesSortedByCommunities[j];

    // Placing node in singleton
    this.belongings[i] = i;
    this.nonSingleton[i] = 0;
    this.degrees[i] = 0;
    totalNodeWeight += index.loops[i] / 2;

    this.communityWeights[i] = index.loops[i];
    this.externalEdgeWeightPerCommunity[i] = 0; // TODO: loops or not?

    ei = index.starts[i];
    el = index.starts[i + 1];

    for (; ei < el; ei++) {
      et = index.neighborhood[ei];
      w = index.weights[ei];

      this.degrees[i] += w;

      // Only considering links inside of macro community
      if (index.belongings[et] !== currentMacroCommunity)
        continue;

      totalNodeWeight += w;
      this.externalEdgeWeightPerCommunity[i] += w;
      this.communityWeights[i] += w;
    }
  }

  // TODO: this is hardly performant
  var microDegrees = this.externalEdgeWeightPerCommunity.slice();
  // console.log(microDegrees)

  // totalNodeWeight /= 2;

  // Random iteration over nodes
  var s, ri, ci;
  var order = stop - start;

  var degree,
      bestCommunity,
      qualityValueIncrement,
      maxQualityValueIncrement,
      totalTransformedQualityValueIncrement,
      targetCommunity,
      targetCommunityDegree,
      targetCommunityWeight;

  var r,
      lo,
      hi,
      mid,
      chosenCommunity;

  ri = this.random(start, stop - 1);

  for (s = start; s < stop; s++, ri++) {
    j = start + (ri % order);

    i = this.nodesSortedByCommunities[j];

    // console.warn();
    // console.warn('processing ' + i)

    // If node is not in a singleton anymore, we can skip it
    if (this.nonSingleton[i] === 1) {
      // console.warn('skipping ' + i + ' because not in singleton')
      continue;
    }

    // If connectivity constraint is not satisfied, we can skip the node
    // console.log(i, totalNodeWeight, this.externalEdgeWeightPerCommunity[i], this.communityWeights[i])
    // console.log(i, this.externalEdgeWeightPerCommunity[i], (this.communityWeights[i] * (totalNodeWeight / 2 - this.communityWeights[i]) * this.resolution))
    if (
      this.externalEdgeWeightPerCommunity[i] <
      (this.communityWeights[i] * (totalNodeWeight / 2 - this.communityWeights[i]) * this.resolution)
    ) {
      // console.warn('skipping ' + i + ' because of constraint')
      continue;
    }

    // Removing node from its current community
    this.communityWeights[i] = 0;
    this.externalEdgeWeightPerCommunity[i] = 0;

    // Finding neighboring communities (including the current singleton one)
    neighboringCommunities.clear();
    neighboringCommunities.set(i, 0);

    degree = 0;

    ei = index.starts[i];
    el = index.starts[i + 1];

    for (; ei < el; ei++) {
      et = index.neighborhood[ei];

      // NOTE: we could index not to repeat this, but I have a feeling this
      // would not justify the spent memory
      if (index.belongings[et] !== currentMacroCommunity)
        continue;

      w = index.weights[ei];

      degree += w;

      addWeightToCommunity(
        neighboringCommunities,
        this.belongings[et],
        w
      );
    }

    // console.warn('Neighboring ' + i, neighboringCommunities)

    // Checking neighboring communitys
    bestCommunity = i;
    maxQualityValueIncrement = 0;
    totalTransformedQualityValueIncrement = 0;

    for (ci = 0; ci < neighboringCommunities.size; ci++) {
      targetCommunity = neighboringCommunities.dense[ci];
      targetCommunityDegree = neighboringCommunities.vals[ci];
      targetCommunityWeight = this.communityWeights[targetCommunity];

      // Connectivity constraint
      if (
        this.externalEdgeWeightPerCommunity[targetCommunity] >=
        (targetCommunityWeight * (totalNodeWeight / 2 - targetCommunityWeight) * this.resolution)
      ) {
        qualityValueIncrement = (
          targetCommunityDegree -
          (degree + index.loops[i]) * targetCommunityWeight * this.resolution / totalNodeWeight
        );

        // console.warn('inc', qualityValueIncrement, 'for', targetCommunity, targetCommunityDegree, targetCommunityWeights);

        if (qualityValueIncrement > maxQualityValueIncrement) {
          bestCommunity = targetCommunity;
          maxQualityValueIncrement = qualityValueIncrement;
        }

        if (qualityValueIncrement >= 0)
          totalTransformedQualityValueIncrement += Math.exp(qualityValueIncrement / this.randomness);
      }
      else {
        // console.warn('inc skip', targetCommunity, this.externalEdgeWeightPerCommunity[targetCommunity], targetCommunityDegree, targetCommunityWeights, totalNodeWeight, targetCommunityWeights * (totalNodeWeight - targetCommunityWeights) * this.resolution);
      }

      this.cumulativeIncrement[ci] = totalTransformedQualityValueIncrement;
    }
    // console.warn('cumsum', this.cumulativeIncrement.slice(0, neighboringCommunities.size))
    // Chosing the community in which to move the node
    if (
      totalTransformedQualityValueIncrement < Number.MAX_VALUE &&
      totalTransformedQualityValueIncrement < Infinity
    ) {
      r = totalTransformedQualityValueIncrement * this.rng();
      lo = -1;
      hi = neighboringCommunities.size + 1; // TODO: adjust binary search?

      while (lo < hi - 1) {
        mid = (lo + hi) >>> 1;

        if (this.cumulativeIncrement[mid] >= r)
          hi = mid;
        else
          lo = mid;
      }

      chosenCommunity = neighboringCommunities.dense[hi];
    }
    else {
      chosenCommunity = bestCommunity;
    }

    // Moving the node to its new community
    this.communityWeights[chosenCommunity] += degree + index.loops[i];

    ei = index.starts[i];
    el = index.starts[i + 1];
    // console.log('bef', this.externalEdgeWeightPerCommunity)
    for (; ei < el; ei++) {
      et = index.neighborhood[ei];
      // console.log('MACRO', i, et, currentMacroCommunity)
      // NOTE: we could index not to repeat this, but I have a feeling this
      // would not justify the spent memory
      if (index.belongings[et] !== currentMacroCommunity)
        continue;
      // console.log('micro', targetCommunity === chosenCommunity, microDegrees[et]);

      targetCommunity = this.belongings[et];

      if (targetCommunity === chosenCommunity) {
        this.externalEdgeWeightPerCommunity[chosenCommunity] -= microDegrees[et];
      }
      else {
        this.externalEdgeWeightPerCommunity[chosenCommunity] += microDegrees[et];
      }
    }
    // console.log('aft', this.externalEdgeWeightPerCommunity)

    // for (ci = 0; ci < neighboringCommunities.size; ci++) {
    //   targetCommunity = neighboringCommunities.dense[ci];
    //   targetCommunityDegree = neighboringCommunities.vals[ci];

    //   if (targetCommunity === chosenCommunity) {
    //     this.externalEdgeWeightPerCommunity[chosenCommunity] -= targetCommunityDegree;
    //   }
    //   else {
    //     this.externalEdgeWeightPerCommunity[chosenCommunity] += targetCommunityDegree;
    //   }
    // }

    if (chosenCommunity !== i) {
      // console.warn(`merging ${i} with ${chosenCommunity}`);
      this.belongings[i] = chosenCommunity;
      this.nonSingleton[chosenCommunity] = 1;
      this.C--;
    }
    else {
      // console.warn('keeping ' + i + ' in singleton');
    }
  }

  var microCommunities = this.neighboringCommunities;
  microCommunities.clear();

  for (j = start; j < stop; j++) {
    i = this.nodesSortedByCommunities[j];
    microCommunities.set(this.belongings[i], 1);
  }

  return microCommunities.dense.slice(0, microCommunities.size);
};

UndirectedLeidenAddenda.prototype.refinePartition = function() {
  this.groupByCommunities();

  this.macroCommunities = new Array(this.B);

  var i, start, stop, mapping;

  var bounds = this.communitiesBounds;

  for (i = 0; i < this.B; i++) {
    start = bounds[i];
    stop = bounds[i + 1];

    mapping = this.mergeNodesSubset(start, stop);
    this.macroCommunities[i] = mapping;
  }

  // console.log(this.macroCommunities)
};

UndirectedLeidenAddenda.prototype.split = function() {
  var index = this.index;
  var isolates = this.neighboringCommunities;

  isolates.clear();

  var i, community, isolated;

  // First we isolate "leaders" in their own communities
  for (i = 0; i < index.C; i++) {
    community = this.belongings[i];

    if (i !== community)
      continue;

    isolated = index.isolate(i, this.degrees[i]);
    isolates.set(community, isolated);
  }

  // Then we move the "followers"
  for (i = 0; i < index.C; i++) {
    community = this.belongings[i];

    if (i === community)
      continue;

    isolated = isolates.get(community);
    index.move(i, this.degrees[i], isolated);
  }

  // Then we adjust the macro communities mapping accordingly
  var j, macro;

  for (i = 0; i < this.macroCommunities.length; i++) {
    macro = this.macroCommunities[i];

    for (j = 0; j < macro.length; j++)
      macro[j] = isolates.get(macro[j]);
  }
};

UndirectedLeidenAddenda.prototype.zoomOut = function() {
  var index = this.index;
  this.refinePartition();
  // throw 'stop';
  this.split();

  var newLabels = index.zoomOut();

  var macro, leader, follower;

  var i, j;

  // var moves = {};

  for (i = 0; i < this.macroCommunities.length; i++) {
    macro = this.macroCommunities[i];
    leader = newLabels[macro[0]];

    for (j = 1; j < macro.length; j++) {
      follower = newLabels[macro[j]];
      index.expensiveMove(follower, leader);
      // moves[follower] = leader;
    }
  }

  // var mapping = index.keepDendrogram ?
  //   index.dendrogram[index.dendrogram.length - 1] :
  //   index.mapping;

  // var v;

  // for (i = 0; i < mapping.length; i++) {
  //   v = moves[mapping[i]];

  //   if (typeof v !== 'undefined')
  //     mapping[i] = v;
  // }
};

UndirectedLeidenAddenda.prototype.onlySingletons = function() {
  var index = this.index;

  var i;

  for (i = 0; i < index.C; i++) {
    if (index.counts[i] > 1)
      return false;
  }

  return true;
};

exports.addWeightToCommunity = addWeightToCommunity;
exports.UndirectedLeidenAddenda = UndirectedLeidenAddenda;
