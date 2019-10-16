const express = require('express');

const app = express();

const projects = [];
let reqCount = 0;

app.use(express.json());
//Tells the methos called on the API and the total reqs made.
const requisitionCounter = (req, res, next) => {
  reqCount++;

  console.log(`Requisition method: ${req.method} // Total number of reqs made on this API: ${reqCount}`)

  return next();
};
//Uses requisitionCounter as a global middleware.
app.use(requisitionCounter);
//Checks if project exists, used on any method that used req.params.id
const checkProjectExists = (req, res, next) => {
  const { id } = req.params;

  const project = projects.find(project => project.id == id);

  if(!project) {
    return res.status(400).json({error: 'Project does not exist!'})
  }

  return next();
}

//Lists all projects
app.get('/projects', (req, res) => {
  return res.json(projects);
});
//Creates a new project.
app.post('/projects', (req, res) => {
  const {id,title} = req.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json(projects);
});
//Deletes a projects using the id in req.params.
app.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIdx = projects.findIndex(project => project.id === id);
  
  projects.splice(projectIdx,1);

  return res.json(projects);
});
//Adds tasks to existing projects.
app.put('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.tasks.push(title);

  return res.json(projects);
})

app.listen(3333);
