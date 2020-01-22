import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
      backgroundColor: theme.palette.background.default,
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

  if(props.data <= 0) return <div><CircularProgress/></div>;


  const tableData = props.data || [];
  const colName = getColumnNames(tableData) || [];

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {
              colName.map((column, index) => {
                  return <StyledTableCell key={index} aling="center">{column.name}</StyledTableCell>
                  
                }
              )
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row,index) => {           
            
            const valueLength = Object.values(row).length;
            const values = Object.values(row).slice(valueLength/2 , valueLength);

            return (
              <StyledTableRow key={index}>
                {
                  values.map((value, index) => {
                    if(typeof value === "boolean") {
                      value = value.toString();
                    }
                    
                    return (
                      <StyledTableCell key={index} component="th" scope="row">
                        {value}
                      </StyledTableCell>
                      )
                    }
                  )
                }
              </StyledTableRow>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default CustomizedTables;