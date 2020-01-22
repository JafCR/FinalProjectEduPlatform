import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Chip from '@material-ui/core/Chip';


// Hook
import useForm from '../hooks/useForm';
import { TextField } from '@material-ui/core';


const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "#3498db",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const useStyles = makeStyles(theme =>({
  root: {
    width: '100%',
    overflowX: 'auto',
    margin: theme.spacing(1),   

  },
  table: {
    minWidth: 700,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}));

const StudentTable = (props) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [modalInput, setModalInput] = React.useState();
  const [input, handleInput] = useForm({quantity:0});

  const handleOpen = (id, universityId, courseId, price) => {    
    setModalInput({universityId: universityId, courseId: courseId, price: price});
    setOpen(true);
  }

  const handleClose = async (universityId, courseId, quantity, price) => {
    let response = await props.buyCourse(modalInput.universityId, modalInput.courseId, input.quantity, modalInput.price);
    setOpen(false);
    console.log(response);
  }

  if(props.data <= 0) return <div style={{width:"100%", textAlign: "center"}}>There are no registered courses...</div>;

  const tableData = props.data || [];

  return (
    <Paper className={classes.root}>
        <Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			className={classes.modal}
			open={open}
			onClose={handleClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
			timeout: 500,
			buyCourse: props.buyCourse,
			}}
		>

        <div className={classes.paper}>
          <h2 id="server-modal-title">Buy online course</h2>
          <p id="server-modal-description">Please enter the amount of seats to buy for this course. Give your friends the gift of education!!</p>
        <form onChange={handleInput}>
          <TextField name="quantity"/>
        </form>
        <br/>
        {/* <Button onClick={()=>props.buyCourse(modalInput.universityId, modalInput.courseId, input.quantity, modalInput.price)}>GET THE COURSE!</Button> */}
        <Button onClick={()=>handleClose(modalInput.universityId, modalInput.courseId, input.quantity, modalInput.price)}>GET THE COURSE!</Button>
        </div>
      </Modal>

      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center"> Course Id</StyledTableCell> 
            <StyledTableCell align="center"> Course Name</StyledTableCell> 
            <StyledTableCell align="center"> Cost</StyledTableCell> 
            <StyledTableCell align="center"> Total Seats </StyledTableCell> 
            <StyledTableCell align="center"> Seats Available</StyledTableCell>
            <StyledTableCell align="center"> Course Status</StyledTableCell>
            <StyledTableCell align="center"> Register </StyledTableCell> 
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row,index) => {           
            
            return (
              <StyledTableRow key={index}>
                 <StyledTableCell component="th" scope="row" align="center">
                  {row.courseId}
                </StyledTableCell>

                <StyledTableCell component="th" scope="row" align="center">
                  {row.courseName}
                </StyledTableCell>

                <StyledTableCell component="th" scope="row" align="center">
                  {row.cost}
                </StyledTableCell>

                <StyledTableCell component="th" scope="row" align="center">
                  {row.totalSeats}
                </StyledTableCell>

                <StyledTableCell component="th" scope="row" align="center">
                   {row.seatsAvailable}
                </StyledTableCell>

                { row.active === true?
                  <StyledTableCell component="th" scope="row" align="center">
                    <Chip label="ACTIVE" />
                  </StyledTableCell>
                  :
                  <StyledTableCell component="th" scope="row" align="center">
                    <Chip label="INACTIVE" disabled />
                  </StyledTableCell>
                }

                { row.active === true?
                  <StyledTableCell component="th" scope="row" align="center">
                   <Button onClick={()=>handleOpen(index, row.universityId, row.courseId, row.cost)}> Buy </Button>
                 </StyledTableCell>
                  :
                  <StyledTableCell component="th" scope="row" align="center">
                    <Button disabled> Buy </Button>
                  </StyledTableCell>
                }
               
              </StyledTableRow>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default StudentTable;