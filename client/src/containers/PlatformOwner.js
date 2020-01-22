import React from 'react';
import CustomizedTables from '../components/CustomizedTables';

import {Button, Typography,CircularProgress, TextField, Divider } from '@material-ui/core';
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

const PlatformOwner = (props) => {
    const classes = useStyles();    
    const [input, handleInput] = useForm({name:"", description:"", website:"", phone:""});
    const [ownerInput, handleOwnerInput] = useForm({owner_address:"", university_id:"",name:"", email:""});
    return (
        <>
            <Typography className={classes.spacing} variant="h6"> 
                University
            </Typography>
            <form onChange={handleInput} className={classes.root} noValidate autoComplete="off">

                <TextField
                required
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                />

                <TextField
                required
                name="description"
                id="description"
                label="Description"
                variant="outlined"
                />

                <TextField
                required
                name="website"
                id="outlined-required"
                label="Website"
                variant="outlined"
                />

                <TextField
                required
                name="phone_number"
                id="phone_number"
                label="PhoneNumber"
                variant="outlined"
                />

                <Button 
                    className={classes.button}
                    onClick={()=>props.addUniversity(input.name, input.description, input.website, input.phone_number)} 
                    variant="contained">
                    Add University
                </Button>
            <br/>
            </form>
            {
                props.listUniversities <= 0 ? 
                <div className={classes.spacing}>There are no registered universities...</div> 
                : 
                <CustomizedTables className={classes.spacing} data={props.listUniversities}/>
            }

            <br/>

            <Typography className={classes.spacing} variant="h6"> 
                University Owners
            </Typography>

             <form onChange={handleOwnerInput} className={classes.root} noValidate autoComplete="off">

                <div>
                    <TextField
                    required
                    id="name_univ_owner"
                    name="name"
                    label="Name"
                    variant="outlined"
                    />

                    <TextField
                    required
                    name="email"
                    id="email"
                    label="Email"
                    variant="outlined"
                    />

                    <TextField
                    required
                    name="university_id"
                    id="university_id"
                    label="UniversityId"
                    variant="outlined"
                    />

                    <TextField
                    required
                    name="owner_address"
                    id="owner_address"
                    label="Owner Address"
                    variant="outlined"
                    />
                </div>

                <Button
                    className={classes.button}
                    onClick={()=>props.addUniversityOwner(ownerInput.owner_address, ownerInput.university_id, ownerInput.name, ownerInput.email)} 
                    variant="contained">
                        Add Owner
                </Button>
            {
                props.listUsers <= 0 ? 
                <div className={classes.spacing}>There are no registered owners...</div>
                : 
                <CustomizedTables className={classes.root} data={props.listUsers}/>
            }

            </form>
        </>

    )
};

export default PlatformOwner;