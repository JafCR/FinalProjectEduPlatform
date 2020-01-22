import React from "react";

// Web3
import getWeb3 from "./getWeb3";

// Contract Information
import EducationPlatform from "./contracts/EducationPlatform.json";

// Import Containers
import PlatformOwner from './containers/PlatformOwner';
import UniversityOwner from './containers/UniversityOwner';
import Student from './containers/Student';

// Material Ui
import {CssBaseline, Typography, Container, CircularProgress, Divider, RootRef, Paper } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  spacing:{
      margin: theme.spacing(1),   
  }
}));

const App = () => {

  const classes = useStyles();    


  // Basic
  const [web3, setWeb3]  = React.useState(undefined);
  const [accounts, setAccounts] = React.useState([]);
  const [contract, setContract] = React.useState(null);

  // Universities
  const [listUniversities, setListUniversities] = React.useState([]);
  const [listUsers, setListUsers] = React.useState([]);
  const [universityInformation, setUniversityInformation] = React.useState("");

  const [listCourses, setListCourses] = React.useState([]);
  const [fullCourseList, setFullCourseList] = React.useState([]);

  // Owner
  const [contractOwner, setContractOwner] = React.useState("");
  const [univOwner, setUnivOwner] = React.useState("");

  const [allLoading, setAllLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchBlockchainInfo = async () => {
    try {
      // Web3
      const web3 = await getWeb3();

      // Accounts 
      const accounts = await web3.eth.getAccounts();

      // Contract instance
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = EducationPlatform.networks[networkId];

      const contract = new web3.eth.Contract(
        EducationPlatform.abi,
        deployedNetwork && deployedNetwork.address,
      );

      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  fetchBlockchainInfo();
  
  },[]);

  React.useEffect(() => {

    const getData = async () => {
      
      const listUniversities = await getListUniversity();
      const ownerAddress = await getContractOwner();

      const univOwner = await isUnivOwner();
      
      
      const listUsers = await getPlatformMemberByAddress();

      const univInfo = await getUniversityInfoByAddress(accounts[0]);

      const courseList = await getCourseList(univInfo.id);

      const fullCourseList = await getFullCourseList();
      
      // Set state
      setUnivOwner(univOwner);
      setListUniversities(listUniversities);
      setListUsers(listUsers);
      setContractOwner(ownerAddress);
      setUniversityInformation(univInfo);
      setListCourses(courseList);
      setFullCourseList(fullCourseList);
      setAllLoading(true);
    };

    if(web3 !== undefined && accounts !== null && contract !== null) {
      getData();
    }

  },[web3, accounts, contract]);

  // IsUnivOwner
  const getContractOwner = async() => {
    const contractOwner = await contract.methods.owner().call();
    return contractOwner;
  }

  const isUnivOwner = async() => {
    const address = accounts[0];
    const univOwner = await contract.methods.isUnivOwner(address).call();
    return univOwner;
  };

  // GeTNumUnivesities
  const getNumUniversity = async () => {
    const numUniversities = await contract.methods.universityIdGenerator().call();
    return numUniversities;
  };

  // Load List Universities
  const getListUniversity = async () => {

    // Get number of Universities
    const numUniv = await getNumUniversity();

    const listUniv = [];

    for(let i = 0; i < numUniv; i++){
      let university = await contract.methods.getUniversity(i).call();

      // Add owner Column
      // let owner = await contract.methods.getUniversityOwner(i).call();
      // university = {null:null, ...university, owner: owner};

      listUniv.push(university);
    }
    return listUniv;
  };

  // Add University
  const addUniversity = async (name, description, website, phoneNumber) => {
    const response = await contract.methods.addUniversity(name, description, website, phoneNumber).send({from: accounts[0]});
    
    // Refresh ListUniversity
    const numUniv = await getNumUniversity();
    const newList = await getListUniversity(numUniv);

    // Set New University List
    setListUniversities(newList);

    return response;
  };

  // Add University Owner
  const addUniversityOwner = async(ownerAddress, universityId, name, email) => {
    const response = await contract.methods.addUniversityOwner(ownerAddress, universityId, name, email).send({from: accounts[0]}); 

    // Refresh University Owner List
    const newList = await getPlatformMemberByAddress();

    // Refresh ListUniversity
    const newListUniv = await getListUniversity();

    // Set New University List
    setListUniversities(newListUniv);
    setListUsers(newList);

    return response;
  }

  // Get University Information By Address
  const getUniversityInfoByAddress = async(address) => {
    let response = await contract.methods.getOwnerUniversity(address).call();
    return response; 
  }

  // Get NumberPlatform members
  const getNumberPlatformMember= async () => {
    let number = await contract.methods.getNumberPlatformUser().call();
    return number;
  }

  // Get PlatformMembers
  const getPlatformMemberByAddress = async() => {
    const numUser = await getNumberPlatformMember();

    let userAddress = [];
    let userInfo = [];
    
    // Get Addresses
    for(let i = 0; i < numUser; i++) {
      let address = await contract.methods.platformUsersList(i).call();
      userAddress.push(address);
    }  

    // Get UserInfo
    for(let i = 0; i < numUser; i++) {
      let user = await contract.methods.getPlatformMember(userAddress[i]).call();
      userInfo.push(user);
    }
    return userInfo;
  }

  // Get Course List
  const getCourseList = async(universityId) => {
    const numCourses = await getNumCourses(universityId);
    let courseList = [];

    for(let i = 0; i < numCourses; i++){
      let courseInfo = await contract.methods.getUniversityCourse(universityId, i).call()
      courseList.push(courseInfo);
    }

    return courseList;
  }

  // Get Number Courses
  const getNumCourses = async(universityId) => {
    let numCourses = await contract.methods.getCourseId(universityId).call();
    return numCourses;
  }

  // Add Course
  const addCourse = async(universityId, courseName, cost, seatsAvailable) => {
    const response = await contract.methods.addCourse(universityId, courseName, cost, seatsAvailable).send({from: accounts[0]});

    // Refresh University Owner List
    const univInfo = await getUniversityInfoByAddress(accounts[0]);

    const courseList = await getCourseList(univInfo.id);

    setListCourses(courseList);
    
    return response;
  }

  // Withdraw Course Funds
  const withdrawCourseFunds = async(universityId, courseId) => {
    const response = await contract.methods.withdrawCourseFunds(universityId, courseId).send({from:accounts[0]});
    
    const univInfo = await getUniversityInfoByAddress(accounts[0]);
    const courseList = await getCourseList(univInfo.id);
    setListCourses(courseList);

    return response; 
  }

  // Buy Course
  const buyCourse = async(universityId, courseId, quantity, price) => {
    const value = web3.utils.toWei((quantity * price).toString(), 'ether');
    const response = await contract.methods.buyCourse(universityId, courseId, quantity).send({from: accounts[0], value: value});

    const fullCourseList = await getFullCourseList();
    setFullCourseList(fullCourseList);

    return response;
  }

  // Get FullList Courses
  const getFullCourseList = async () => {

    const fullCourseList = [];
    const getUniversityList = await getListUniversity();

    
    for(let i = 0; i < getUniversityList.length; i++){
      var courseList = await getCourseList(getUniversityList[i].id);
      for(let j = 0; j < courseList.length; j++){
        fullCourseList.push(courseList[j]);
      }
    }
  
    return fullCourseList;
  }

  // Toogle Active course

  const toggleActiveCourse = async (universityId, courseId, state) => {
    const response = await contract.methods.toggleActiveCourse(universityId, courseId, state).send({from: accounts[0]});

    // Refresh University Owner List
    const univInfo = await getUniversityInfoByAddress(accounts[0]);

    const courseList = await getCourseList(univInfo.id);

    setListCourses(courseList);
        
    return response;
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md">
      <Paper style={{marginBottom:'50px', marginTop: '50px', padding: '30px'}}>

      
      {
        
      }

      {
        accounts[0] === contractOwner &&
        <div style={{margin: "30px 0px"}}>
          <div className={classes.spacing}>
            <Typography variant="h4">Online Education Platform</Typography>
            <Typography variant="h6">Welcome: {accounts[0]} </Typography>
          </div>
          <br/>
          <PlatformOwner 
            listUniversities={listUniversities}
            listUsers={listUsers}
            addUniversity={addUniversity}
            addUniversityOwner={addUniversityOwner}
            />         
          </div>
      }

      {
        univOwner &&
        <div>
          <div className={classes.spacing}>
            <Typography variant="h4">My University {`<${universityInformation.name}>`} </Typography>
            <Typography variant="h6">Welcome {accounts[0]} </Typography>
          </div>
          <br/>
          <UniversityOwner
            addCourse = {addCourse}
            courseList={listCourses}
            toggleActiveCourse = {toggleActiveCourse}
            withdrawCourseFunds = {withdrawCourseFunds}
            web3 = {web3}
            />
        </div>
      }
  
      {
        (allLoading && accounts[0] !== contractOwner) &&
        <div>
          <br/>
          <div className={classes.spacing}>
            <Typography variant="h4">Student Portal</Typography>
            <Typography variant="h6">Welcome: {accounts[0]} </Typography>
          </div>
          <br/>
          <Student 
              fullCourseList = {fullCourseList}
              buyCourse = {buyCourse}
              />         
        </div>
      }
      </Paper>

      </Container>
    </>
  );
}
export default App;
