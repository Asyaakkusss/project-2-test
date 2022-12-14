//imports
//Asya Akkus final project react. We do edit this
import React, { Component } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
//import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DoNotDisturbAltRoundedIcon from '@mui/icons-material/DoNotDisturbAltRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import 'toastr/build/toastr.min.css';

//js libraries
import moment from 'moment';
import toastr from 'toastr';

//renders the pages and controls the addition or deletion of tasks
export default function App() {
  let [title, setTitle] = React.useState('');
  let [description, setDescription] = React.useState('');
  let [deadline, setDeadline] = React.useState('');
  let [priority, setPriority] = React.useState('');
  let [isComplete, setIsComplete] = React.useState(false);
  let [taskArray, setTaskArray] = React.useState([]);
  let [adding, setAdding] = React.useState(false);
  let [rows, setRows] = React.useState([]);
  let [index, setIndex] = React.useState(0);
  let [open, setOpen] = React.useState(false);
  let [updateOpen, setUpdateOpen] = React.useState(false);
  let [isDescriptionError, setDescriptionError] = React.useState(false);
  let [deleteButtonIndex, setDeleteButtonIndex] = React.useState(0);
  const [error, setError] = React.useState(false);
  let [titleValidator, setTitleValidator] = React.useState('');
  let [descriptionValidator, setDescriptionValidator] = React.useState('');
  let [updateButton, showButton] = React.useState(true);
  let [date, setDate] = React.useState('');
  let [isEditing, setIsEditing] = React.useState(false);

  //opens dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  //closes dialog
  const handleClickClosed = () => {
    setOpen(false);
  };

  //change title on dialog
  let changeTitle = (value) => {
    setTitle(value);
    validateTitle(value);
  };

  //change description on dialog
  let changeDescription = (value) => {
    setDescription(value);
    validateDescription(value);
  };

  //change deadline on dialog
  function changeDeadline(value) {
    setDeadline(value);
  }

  //allows checkbox to check and uncheck at specific index
  let changeCheckbox = (index) => {
    // figure out which data/ task has the index
    let desiredTaskArrayId = -1;
    for (let i = 0; i < taskArray.length && desiredTaskArrayId === -1; i++) {
      if (taskArray[i].index === index) {
        // taskArray[i] is the task that you want to update isComplete
        desiredTaskArrayId = i;
      }
    }
    // at this point, desiredTaskArrayId is the position of task in taskArray
    // taskArray[desiredTaskArrayId].isComplete = true;
    setTaskArray((array) => {
      let newTaskArray = [...array];
      newTaskArray[desiredTaskArrayId].isComplete =
        !array[desiredTaskArrayId].isComplete;
      return newTaskArray;
    });
  };

  //submit for add function
  let submit = () => {
    if (validateTitle(title) || validateDescription(description)) {
      toastr.error(`Could not submit form!`, ``, {
        positionClass: 'toast-bottom-right',
      });
      return;
    }
    addTasks();
    handleClickClosed();
    //thingie();
  };

  //submit for update function
  let updateSubmit = () => {
    if (validateDescription(description)) {
      toastr.error(`Could not submit form!`, ``, {
        positionClass: 'toast-bottom-right',
      });
      return;
    }
    addTasks();
    handleClickClosed();
  };

  function addTask() {
    setIndex(taskArray.length);
    setAdding(true);
  }

  //update a task
  function updateTasks(index) {
    let desiredTaskArrayId = -1;
    for (let i = 0; i < taskArray.length && desiredTaskArrayId === -1; i++) {
      if (taskArray[i].index === index) {
        // taskArray[i] is the task that you want to update
        desiredTaskArrayId = i;
      }
    }
    index = desiredTaskArrayId;
    let daData = taskArray[index];
    setAdding(false);
    setDescription(daData.description);
    setTitle(daData.title);
    setPriority(daData.priority);
    setDeadline(daData.deadline);
    setIndex(daData.index);

    toastr.success(`Task updated successfully!`, ``, {
      positionClass: 'toast-bottom-right',
    });
  }

  //clears the dialog if the user puts something in but then hits cancel
  const clearCancel = () => {
    let data = {
      title,
      description,
      deadline,
      priority,
      isComplete: false,
      index,
    };
    setDescription('');
    setTitle('');
    setPriority('');
    setDeadline('');
  };

  //deletes a take at a specific index
  const deleteTasks = (index) => {
    let desiredTaskArrayId = -1;
    for (let i = 0; i < taskArray.length && desiredTaskArrayId === -1; i++) {
      if (taskArray[i].index === index) {
        // taskArray[i] is the task that you want to delete
        desiredTaskArrayId = i;
      }
    }
    setTaskArray((array) => {
      let newTaskArray = [...array];
      newTaskArray.splice(desiredTaskArrayId, 1);
      setTaskArray([...newTaskArray]);
      return newTaskArray;
    });
    toastr.success(`Task deleted successfully!`, ``, {
      positionClass: 'toast-bottom-right',
    });
  };

  //function that adds tasks
  function addTasks() {
    let data = {
      title,
      description,
      deadline,
      priority,
      isComplete: false,
      index,
    };

    if (adding) {
      taskArray.push(data);
    } else {
      taskArray[index] = data;
    }
    setIndex(taskArray.length);
    setDescription('');
    setTitle('');
    setPriority('');
    setDeadline('');
    toastr.success(`Task added successfully!`, ``, {
      positionClass: 'toast-bottom-right',
    });
  }

  //validates title and makes sure it is unique and present
  let validateTitle = (value) => {
    setError(false);
    let errors = [];
    if (!value) {
      errors.push('Title is Required!');
      setError(true);
    }
    for (let i = 0; i < taskArray.length; i++) {
      if (taskArray[i].title === value) {
        errors.push('Title is not unique!');
        setError(true);
      }
    }
    let results = errors.join();
    setTitleValidator(results);
    return results;
  };

  //validates description and makes sure it is present
  let validateDescription = (value) => {
    setError(false);
    let errors = [];
    if (!value) {
      errors.push('Description is Required!');
      setError(true);
    }
    let results = errors.join();
    setDescriptionValidator(results);
    return results;
  };

  //return function that creates the grid and tasks
  return (
    <>
      <Dialog open={open} onClose={handleClickClosed}>
        {isEditing ? (
          <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
            <EditRoundedIcon />
            Edit Task
          </DialogTitle>
        ) : (
          <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
            <AddCircleIcon />
            Add Task
          </DialogTitle>
        )}
        <br />
        {isEditing ? (
          <DialogContent>
            <br />
            <br />
            <TextField
              error={error}
              sx={{ width: 1 }}
              id="descriptioninput"
              label="Description"
              placeholder="Type description..."
              helperText={descriptionValidator}
              value={description}
              onChange={(e) => changeDescription(e.target.value)}
            />
            <br />
            <br />
            <TextField
              type="date"
              defaultValue="01/01/2022"
              id="dateInput"
              value={deadline}
              onChange={(e) => changeDeadline(e.target.value)}
              label="Deadline"
              style={{ display: 'block' }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            <br />
            <br />
            Priority
            <br />
            <RadioGroup
              row
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <FormControlLabel value="low" control={<Radio />} label="Low" />
              <FormControlLabel
                value="med"
                control={<Radio />}
                label="Medium"
              />
              <FormControlLabel value="high" control={<Radio />} label="High" />
            </RadioGroup>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Deadline"
                value={deadline}
                onChange={(e) => {}}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </DialogContent>
        ) : (
          <DialogContent>
            <TextField
              error={error}
              sx={{ width: 1 }}
              id="titleinput"
              label="Title"
              placeholder="Type title..."
              helperText={titleValidator}
              value={title}
              onChange={(e) => changeTitle(e.target.value)}
            />
            <br />
            <br />
            <TextField
              error={error}
              sx={{ width: 1 }}
              id="descriptioninput"
              label="Description"
              placeholder="Type description..."
              helperText={descriptionValidator}
              value={description}
              onChange={(e) => changeDescription(e.target.value)}
            />
            <br />
            <br />
            <TextField
              type="date"
              defaultValue="01/01/2022"
              id="dateInput"
              value={deadline}
              onChange={(e) => changeDeadline(e.target.value)}
              label="Deadline"
              style={{ display: 'block' }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            <br />
            <br />
            Priority
            <br />
            <RadioGroup
              row
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <FormControlLabel value="low" control={<Radio />} label="Low" />
              <FormControlLabel
                value="med"
                control={<Radio />}
                label="Medium"
              />
              <FormControlLabel value="high" control={<Radio />} label="High" />
            </RadioGroup>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Deadline"
                value={deadline}
                onChange={(e) => {}}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </DialogContent>
        )}
        {isEditing ? (
          <DialogActions sx={{ bgcolor: 'white' }}>
            <Button
              onClick={() => {
                updateSubmit();
              }}
              variant="contained"
              sx={{ width: 100 }}
              autoFocus
            >
              <EditRoundedIcon />
              Edit
            </Button>

            <Button
              onClick={handleClickClosed}
              onClick={() => {
                handleClickClosed();
              }}
              variant="contained"
              sx={{ bgcolor: 'red', width: 100 }}
              autoFocus
            >
              <DoNotDisturbAltRoundedIcon fontSize="small" />
              CANCEL
            </Button>
          </DialogActions>
        ) : (
          <DialogActions sx={{ bgcolor: 'white' }}>
            <Button
              onClick={() => {
                submit();
              }}
              variant="contained"
              sx={{ width: 100 }}
              autoFocus
            >
              <AddCircleIcon />
              Add
            </Button>

            <Button
              onClick={() => {
                clearCancel();
                handleClickClosed();
              }}
              variant="contained"
              sx={{ bgcolor: 'red', width: 100 }}
              autoFocus
            >
              <DoNotDisturbAltRoundedIcon fontSize="small" />
              CANCEL
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <Card sx={{ margin: '-8px' }}>
        <CardHeader
          sx={{ bgcolor: 'primary.dark', color: 'white' }}
          title={
            <>
              <MenuIcon />
              FRAMEWORKS
            </>
          }
          style={{ textAlign: 'center' }}
          action={
            <>
              <Button
                variant="contained"
                onClick={() => {
                  handleClickOpen();
                  setIsEditing(false);
                }}
                sx={{ width: 100, marginRight: '7px' }}
              >
                <AddCircleIcon />
                &nbsp; ADD
              </Button>
            </>
          }
        ></CardHeader>
        <CardContent sx={{ bgcolor: 'white' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ color: 'gray' }}>
                    Title
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'gray' }}>
                    Description
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'gray' }}>
                    Deadline
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'gray' }}>
                    Priority
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'gray' }}>
                    Is Complete
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'gray' }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {' '}
                {taskArray.map((data) => (
                  <TableRow key={data.index}>
                    <TableCell align="center">{data.title}</TableCell>
                    <TableCell align="center">{data.description}</TableCell>
                    <TableCell align="center">
                      {moment(data.deadline).format('MM/DD/YY')}
                    </TableCell>
                    <TableCell align="center">{data.priority}</TableCell>
                    <TableCell align="center">
                      <div>
                        {/*update button*/}
                        {data.isComplete ? (
                          <div>
                            <Checkbox
                              defaultChecked
                              onClick={() => changeCheckbox(data.index)}
                            />
                          </div>
                        ) : (
                          <div>
                            <Checkbox
                              onClick={() => changeCheckbox(data.index)}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div>
                        {/*update button*/}
                        {!data.isComplete ? (
                          <div>
                            <Button
                              variant="contained"
                              onClick={() => {
                                updateTasks(data.index);
                                handleClickOpen();
                                setIsEditing(true);
                              }}
                              sx={{ width: 100 }}
                              id="update"
                            >
                              <EditRoundedIcon />
                              &nbsp;Update
                            </Button>
                          </div>
                        ) : (
                          <></>
                        )}
                        {/*delete button*/}
                        <div>
                          <Button
                            color="error"
                            variant="contained"
                            onClick={() => deleteTasks(data.index)}
                            sx={{ bgcolor: '#f44336', width: 100 }}
                          >
                            <DoNotDisturbAltRoundedIcon />
                            &nbsp;Delete
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}
