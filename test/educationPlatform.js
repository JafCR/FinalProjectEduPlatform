const EducationPlatform = artifacts.require("../contracts/EducationPlatform.sol");

contract("EducationPlatform", accounts => {

  it("..should be Contract Owner", async() => {
    const instance = await EducationPlatform.deployed();

    const owner = await instance.owner();

    assert.equal(accounts[0], owner, "The account is not the owner account");
  });

  it("..should Create University", async() => {
    const instance = await EducationPlatform.deployed();

    await instance.addUniversity("Universidad 1", "description1", "website1", "phoneNumber1")

    // Get Number Universities
    const univNum = await instance.universityIdGenerator.call();
  
    // Get List Universities
    const univList = [];
    for(let i = 0; i < univNum; i++){
      univList.push(await instance.getUniversity(0));
    }

    assert.equal(univList[0][1], "Universidad 1", "There is not registered")    

  });

  
  it("..should Set University Owners", async() => {
    const instance = await EducationPlatform.deployed();
    
    // Set University Owners
    await instance.addUniversityOwner(accounts[0], 0, "Jaffet", "Jaffet@Jaffet.com");
    
    const univOwner = await instance.isUnivOwner(accounts[0]);

    assert.equal(univOwner, true, "The account is not a university Owner");
  });

  
  it("..should Create Courses", async() => {

    const instance = await EducationPlatform.deployed();

     // As Owner Create Courses
     await instance.addCourse(0, "Course1", 2, 10);
    
     
    let courseInfo = await instance.getUniversityCourse(0, 0);
    
    assert.equal(courseInfo.courseName, "Course1", "Theres is not courses registered");   
  });

  it("..should Buy Course", async() => {

    const instance = await EducationPlatform.deployed();

    await instance.buyCourse(0, 0, 1, {from: accounts[2], value: web3.utils.toWei("2", 'ether')});

    const courseInfo = await instance.getUniversityCourse(0, 0);

    const balance = web3.utils.fromWei(courseInfo.balance.toString(), 'ether');

    assert.equal(balance, 2, "The course has not been purchased");   

  });

  it("..should Withdraw funds", async() => {

    const instance = await EducationPlatform.deployed();

    await instance.withdrawCourseFunds(0, 0, {from: accounts[0]});

    const ownerBalance = await web3.eth.getBalance(accounts[0]);
    const toEther = web3.utils.fromWei(ownerBalance.toString(), 'ether');

    assert.equal(toEther > 100, true, "Funds have not been withdrawned");

  });  
});
