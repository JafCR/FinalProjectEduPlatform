import React from 'react';
import UniversityOwnerTable from '../components/UniversityOwnerTable';

import {Button, Typography,CircularProgress, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useForm from '../hooks/useForm';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 180,
    },
  },
  button:{
    margin: theme.spacing(1),   
    },
    spacing:{
        margin: theme.spacing(1),   
    }
}));

const UniversityOwner = (props) => {
    const classes = useStyles();    
    const [input, handleInput] = useForm({university_id:"", course_name:"", cost:"", seats_available:""});
    return (
        <>
            <Typography className={classes.spacing} variant="h5"> 
                Courses
            </Typography>
            <form onChange={handleInput} className={classes.root} noValidate autoComplete="off">
                <div>
                    <TextField
                    required
                    id="university_id_owner"
                    name="university_id"
                    label="UniversityId"
                    variant="outlined"
                    />

                    <TextField
                    required
                    name="course_name"
                    id="course_name"
                    label="Course Name"
                    variant="outlined"
                    />

                    <TextField
                    required
                    name="cost"
                    id="cost"
                    label="Cost"
                    variant="outlined"
                    />

                    <TextField
                    required
                    name="seats_available"
                    id="seats_available"
                    label="Seats Available"
                    variant="outlined"
                    />

                </div>

                <Button 
                    className={classes.button}
                    onClick={()=>props.addCourse(input.university_id, input.course_name, input.cost, input.seats_available)} 
                    variant="contained">
                    Add Course
                </Button>
            <br/>
            {
                props.courseList <= 0 ? 
                <div className={classes.spacing}> There are no registered Courses...</div> 
                : 
                <UniversityOwnerTable 
                    data={props.courseList} 
                    toggleActiveCourse={props.toggleActiveCourse}
                    withdrawCourseFunds={props.withdrawCourseFunds}
                    web3={props.web3}
                />
            }

            </form>  </>
    )
};

export default UniversityOwner;