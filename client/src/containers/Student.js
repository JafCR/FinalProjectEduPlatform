import React from 'react';
import StudentTable from './../components/StudentTable';
import {Typography, CircularProgress} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: 150,
      },
    },
    button:{
      margin: theme.spacing(1),   
      },
      spacing:{
          margin: theme.spacing(1),   
      }
  }));

const Student = (props) => {
    const classes = useStyles();    
    return (
        <>
            <Typography className={classes.spacing} variant="h5"> 
                Courses
            </Typography>

            <StudentTable data={props.fullCourseList} buyCourse={props.buyCourse}/>
        </>
    )
};

export default Student;