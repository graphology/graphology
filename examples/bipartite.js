/**
 * Bipartite Graph Generation
 * ===========================
 *
 * @Yomguithereal
 *
 * Script generating a bipartite graph of students working on projects using
 * scraped data.
 */
import {SimpleDirectedGraph} from 'graph';

// Scraped data here, it's a collection of projects having the following
// properties:
//   * title
//   * id
//   * date
//   * team (list of students:)
//     * name
//     * isProjectManager
const PROJECTS;

const graph = new SimpleDirectedGraph();

// Iterating through projects
PROJECTS.forEach(project => {

  // Creating a project node
  graph.addNode(project.id, {
    type: 'project',
    title: project.title,
    date: project.date
  });

  // Iterating through the team
  project.team.forEach(student => {

    // Adding a node if relevant
    let node = graph.getNode(student.name);

    if (!node)
      node = graph.addNode(student.name, {
        type: 'student',
        name: student.name,
        isProjectManager: false
      });

    // Updating project manager, meaning that if the student is at least
    // once a project manager, we will flag its node as so.
    if (student.isProjectManager)
      graph.setNodeAttribute(node, 'isProjectManager', true);

    // Adding an edge between the student & the project
    graph.addEdge(node, project.id, {
      predicate: 'WORKED_ON'
    });
  });
});

console.log(graph);
