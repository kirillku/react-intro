
// Loading react related libraries
var React = require('react');
var ReactDOM = require('react-dom');

import {TodoData} from './model/todomodel';
import {Editable} from './editable';
var appstate = new TodoData();

var Task = React.createClass({

	change: function(event) {
		appstate.toggleTask(this.props.content.id);
	},

	remove: function(event) {
		appstate.removeTask(this.props.content.id);
	},

	edit: function(event) {
		appstate.updateTask(this.props.content.id, event);
	},

	render: function() {
		var status = this.props.content.done ? "done" : "undone";
		return (<div className={"task " + status}>
							<div className="task-main">
								<span><strong><Editable value={this.props.content.task} onSave={this.edit}/></strong></span>
							</div>
							<div className="task-actions">
									<button className="task-btn remove-btn" onClick={this.remove}>
										<i className="fa fa-times-circle-o"></i>
									</button>
									<button className="task-btn" onClick={this.change}>
										<i className={status + " fa fa-check-circle-o"}></i>
									</button>
							</div>
						</div>);
	}
});

var TaskList = function(props) {
	var tasks = props.tasks.map((task) => <Task content={task} key={task.id} />);
	return (<div className="tasks not-ready-tasks">{tasks}</div>);
};

var AddTaskInput = React.createClass({

	getInitialState: function() {
		// the input field is empty when we start
		return {task: ""}
	},

	update: function(event) {
		this.setState({task: event.target.value});
	},

	keydown: function(event) {
		if (event.key === 'Enter') {
			appstate.addTask(this.state.task);
			this.setState({task: ""});
		}
	},
	
	render: function() {
		return (<div className="add-task-container">
							<input 
								type="text" 
								value={this.state.task} 
								onChange={this.update} 
								onKeyPress={this.keydown} 
								placeholder="Add task..." />
						</div>);
	}
});

var ProgressBar = function(props) {
	return (<div id="myProgress" className="progress-container">
						<progress className="progress" value={props.done} max={props.done + props.undone}></progress>
					</div>);
};

var TodoApp = React.createClass({

	getInitialState: function() {
		return appstate.getState();
	},

	componentDidMount: function() {
		var that = this;
		appstate.subscribe(function(state) {
			that.setState(state);
		});
	},

	render: function() {
		var tasks = this.state.tasks;
		var done_tasks = tasks.filter((task) => task.done);
		var undone_tasks = tasks.filter((task) => !task.done);

		return (<div className="todo-app">
							<AddTaskInput />
							<ProgressBar done={done_tasks.length} undone={undone_tasks.length} />
							<TaskList tasks={undone_tasks} />
							<TaskList tasks={done_tasks} />
						</div>);
	}
});


ReactDOM.render(
	<TodoApp></TodoApp>,
	document.getElementById('app-container')
);
