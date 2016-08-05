/**
 * Co-occurence Graph Generation
 * ==============================
 *
 * @Yomguithereal
 *
 * Script generating a graph of students co-occurrence based on the results
 * of a cypher query.
 */
import {SimpleUndirectedGraph} from 'graph';
import {GraphDatabase} from 'neo4j';
import drop from 'lodash/drop';
import fs from 'fs';

const QUERY = 'MATCH (p:Project)<-[:WORKED_ON]-(s:Student) RETURN p AS project, collect(s) AS students;';

const DB = new GraphDatabase('http://localhost:7474');

const graph = new SimpleUndirectedGraph();

db.cypher(QUERY, (err, rows) => {
  if (err) return console.error(err);

  // Each rows contains a list of students having worked on the same project
  rows.students.forEach(function({properties: student}, i, students) {

    // If the student is not yet in the graph, we add him/her
    if (!graph.hasNode(student.id))
      graph.addNode(student.id);

    // Linking the students to its colleagues
    drop(students, i + 1).forEach(function({properties: colleague}) {

      let edge = graph.getEdge(student.id, colleague.id);

      if (!edge) {

        // If the edge does not yet exist, we create it
        edge = graph.addEdge(student.id, colleague.id, {weight: 0});
      }

      // Weighting the edge
      graph.updateEdgeAttribute(edge, 'weight', x => x + 1);
    });
  });
});

console.log(graph);
