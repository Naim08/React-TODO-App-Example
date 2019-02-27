import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOff from '@material-ui/icons/HighlightOff';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import './App.css';
import {sortBy, toInteger, isArray, isEmpty, isNull, isNumber, last, nth, toNumber} from 'lodash';

class App extends Component {
    state = Object.assign({
        taskName: '',
        tasks: [],
    }, this.props.initialState);

    componentWillUpdate = this.props.onState || undefined;

    handleChange = key => event => {
        this.setState({
            [key]: event.target.value,
        });
    };

    parseTextInput = str => {
        const regex = /[^\d]+|\d+/g;
        const strArr = str.match(regex);
        if (!isArray(strArr) || isEmpty(strArr) || isNull(strArr))
            return false;

        if (last(strArr) !== "pts")
            return false;

        if (!isNumber(toNumber(nth(strArr, -2))))
            return false;

        return {taskName: strArr.slice(0, -2).join(''), taskPriorityValue: toNumber(nth(strArr, -2)), isEditing: false};
    };

    handleSubmit = event => {
        event.preventDefault();
        let newArr = this.state.tasks;
        const taskObj = this.parseTextInput(this.state.taskName);
        if (taskObj === false)
            return false;

        newArr.push({name: taskObj.taskName, taskPriorityValue: taskObj.taskPriorityValue});
        newArr = sortBy(newArr, [o => toInteger(o.taskPriorityValue)]).reverse();

        this.setState({
            tasks: newArr,
            taskName: '',
        });
    };

    handleCancel = index => event => {
        const newArr = this.state.tasks;
        newArr[index]['isEditing'] = false;
        this.setState({
            tasks: newArr,
        })
    };

    deleteItem = index => event => {
        const newArr = this.state.tasks;
        newArr.splice(index, 1);
        this.setState({
            tasks: newArr,
        });
    };

    editTask = index => event => {
        const newArr = this.state.tasks;
        newArr[index]['isEditing'] = true;
        this.setState({
            tasks: newArr,
            ['taskPriorityValue' + index]: newArr[index].taskPriorityValue
        });
    };

    updateTask = index => event => {
        event.preventDefault();

        if (!isNumber(toNumber(this.state['taskPriorityValue' + index])))
            return false;
        let newArr = this.state.tasks;

        newArr[index]['isEditing'] = false;
        newArr[index]['taskPriorityValue'] = toNumber(this.state['taskPriorityValue' + index]);
        newArr = sortBy(newArr, [o => toInteger(o.taskPriorityValue)]).reverse();

        this.setState({
            tasks: newArr,
        });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">TODO</h1>
                </header>
                <form onSubmit={this.handleSubmit} id="addtask">
                    <TextField
                        id="taskName"
                        label="Task Name"
                        value={this.state.taskName}
                        onChange={this.handleChange('taskName')}
                    />
                    <Button type="submit" aria-label="Add" variant="fab" color="primary">
                        <AddIcon/>
                    </Button>
                </form>
                <Grid container spacing={16}>
                    <Grid item xs={3}>
                    </Grid>
                    <Grid item xs={6}>
                        <List component="nav">
                            {this.state.tasks.map((task, i) =>
                                    <div key={i} className={task.taskPriorityValue > 9 ? "critical" : "normal"}>
                                        <ListItem button>
                                            <ListItemText primary={task.name} style={{flex: "1 1"}}/>
                                            {task.isEditing ? (
                                                <span className="editTask">
                                                    <TextField
                                                        id="editTask"
                                                        label="Priority Value"
                                                        value={this.state['taskPriorityValue' + i]}
                                                        onChange={this.handleChange('taskPriorityValue' + i)}
                                                        className="maxWidth"
                                                    />
                                                      <ListItemSecondaryAction>
                                                          <IconButton
                                                              aria-label="HighlightOff"
                                                              onClick={this.handleCancel(i)}
                                                              className="iconHeight"
                                                          >
                                                            <HighlightOff nativeColor="#FF4900"/>
                                                          </IconButton>
                                                          <IconButton
                                                              aria-label="CheckCircleOutline"
                                                              className="iconHeight"
                                                              onClick={this.updateTask(i)}
                                                          >
                                                                <CheckCircleOutline nativeColor="#37AA00"/>
                                                          </IconButton>
                                                      </ListItemSecondaryAction>
                                                  </span>

                                            ) : (
                                                <React.Fragment>
                                                    <ListItemText primary={task.taskPriorityValue}/>
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            aria-label="Edit"
                                                            onClick={this.editTask(i)}
                                                            className="iconHeight"
                                                        >
                                                            <EditIcon nativeColor="#075CE2"/>
                                                        </IconButton>
                                                        <IconButton
                                                            aria-label="Delete"
                                                            onClick={this.deleteItem(i)}
                                                            className="iconHeight"
                                                        >
                                                            <DeleteIcon nativeColor="#8A97AA"/>
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </React.Fragment>
                                            )}
                                        </ListItem>
                                    </div>
                            )}
                        </List>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default App;
