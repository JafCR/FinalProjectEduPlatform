import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';

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
      backgroundColor: theme.palette.primary,
    },
  },
}))(TableRow);

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    margin: theme.spacing(1),   
  },
  table: {
    minWidth: 700,
  },
}));

 // UniversityList Format
  const getColumnNames = (list) => {
    
    if(list.length <= 0)  return; 
    
    // Get column
    const elementKeys = Object.keys(list[0]);
    
    // Create column array
    const columns = [];

    // Set column format to table
    for(let i = elementKeys.length / 2 ; i < elementKeys.length ; i++) {
        columns.push({
            name: elementKeys[i]
        });
    }
    return columns
  }

const CustomizedTables = (props) => {
  const classes = useStyles();

  if(props.data <= 0) return <div style={{width:"100%", textAlign: "center"}}><CircularProgress/></div>;

  const tableData = props.data || [];

  console.log(props); 

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center"> Course Id</StyledTableCell> 
            <StyledTableCell align="center"> Course Name</StyledTableCell> 
            <StyledTableCell align="center"> Cost</StyledTableCell> 
            <StyledTableCell align="center"> Total Setas </StyledTableCell> 
            <StyledTableCell align="center"> Seats Available</StyledTableCell> 
            <StyledTableCell align="center"> Course Status </StyledTableCell> 
            <StyledTableCell align="center"> Toogle Course Status </StyledTableCell>
            <StyledTableCell align="center"> Course Funds </StyledTableCell>
            <StyledTableCell align="center"> Withdraw Funds </StyledTableCell>
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

                <StyledTableCell component="th" scope="row" align="center">
                  {row.active.toString()}
                </StyledTableCell>

                <StyledTableCell component="th" scope="row" align="center">
                  {
                    row.active ? 
                      <Button style={{backgroundColor: "red"}} onClick={()=>props.toggleActiveCourse(row.universityId, row.courseId, !row.active)}> CLOSE </Button>
                      :
                      <Button style={{backgroundColor: "green"}} onClick={()=>props.toggleActiveCourse(row.universityId, row.courseId, !row.active)}> OPEN </Button>
                  }
                </StyledTableCell>

                <StyledTableCell align="center"> { props.web3.utils.fromWei(row.balance, 'ether')} ETH </StyledTableCell>

                <StyledTableCell component="th" scope="row" align="center">
                  <Button onClick={()=>props.withdrawCourseFunds(row.universityId, row.courseId, !row.active)}> WITHDRAW </Button>
                </StyledTableCell>
              </StyledTableRow>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default CustomizedTables;