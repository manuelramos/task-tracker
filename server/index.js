const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database/tasks.json');
var cors = require('cors');

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(cors()) // Enable CORS

var tasks = db.tasks;
var states = db.taskStates;

function getMaximunId(tasks) {
	if (tasks.length > 0) {
		let max = Math.max.apply(Math, tasks.map(function(f){
			return f.id;
		}));
		return max;
	} else {
		return 0;
	}
}

app.get('/api/tasks/all', function(request, response) {
	console.log('Requested all tasks. Sended %d tasks', tasks.length);
	tasks.forEach(element => {
		console.log(console.log(element));
	});
	response.send(tasks);
});

app.get('/api/tasks/states', function(request, response) {
	console.log('All task states requested.');
	response.send(states);
});

app.post('/api/tasks/create', function(request, response) {
	let id = getMaximunId(tasks) + 1;
	let new_task = {
		"id": id, 
		"name": request.body.name, 
		"description": request.body.description,
		"estimate": request.body.estimate,
		"state": request.body.state
	};
	tasks.push(new_task);
	console.log('task created: ' + JSON.stringify(new_task));
	response.send(new_task);
});

app.put('/api/tasks/update', function(request, response) {
	console.log('Task id %d', request.body.id);
	console.log('State id %d', request.body.state);

	let taskId = request.body.id;
	let newStateId = request.body.state;
	
	let task = tasks.find(t => t.id == taskId);
	console.log('the task to be updated', task);

	let index = tasks.indexOf(task);
	console.log('The index of the task that is going to be updated is %d', index);
	if (index > -1) {		
		tasks[index].state = newStateId;
	}
	console.log('Task updated: ' + JSON.stringify(tasks[index]));
	response.send(tasks);
});

app.delete('/api/tasks/delete/:id', function(request, response) {
	console.log('Requested delete task with id: %d', request.params.id);
	let id = parseInt(request.params.id);
	tasks = tasks.filter(t => t.id != id);
	console.log('New tasks');
	tasks.forEach(t => console.log(t));
	response.send({msg: 'deleted'});
});

app.listen(8080, function() {
	console.log('Server listening on port 8080')
});

module.exports = app;
