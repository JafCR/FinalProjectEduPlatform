pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/access/Roles.sol";
import "openzeppelin-solidity/contracts/access/roles/PauserRole.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

//import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/access/Roles.sol";
//import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/access/roles/PauserRole.sol";
//import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol";

/// @title Online Educational Platform
/// @author Jafett Sandi
/// @notice This contracts is not intended for Production use yet.
/// @dev All function calls are currently implemented without side effects
contract EducationPlatform is Ownable {

    using Roles for Roles.Role; // We want to use the Roles library
    Roles.Role universityOwners; //Stores University owner Roles
    Roles.Role teachers; // Stores teacher Roles
    Roles.Role students; // Stores student Roles;

    // ID Generators for universities and platform users
    uint public universityIdGenerator;
    uint public UserIdGenerator;

    mapping (uint => University) public universities; // Mapping to keep track of the Universities
    mapping (address => University) public mapUniversity;
    mapping (address => PlatformMember) public platformUsers; // Mapping to keep track of the Students in the platform

    address [] public platformUsersList;
    
    uint contractBalance;

    struct University {
        uint id;
        string name;
        string description;
        string website;
        string phoneNumber;
        bool open;
        uint courseIdGenerator;
        address payable UniversityOwner;
        mapping (uint => Course) courses; //Mappint to track all classes available for this University
    }

    // This structs is to store the information of a Platform member. Has a flag to identify if the member is Owner or not.
    struct PlatformMember {
        uint id;
        string fullName;
        string email;
        address userAddress;
        bool isUniversityOwner;
    }

    struct Course {
        uint id;
        string courseName;
        uint cost;
        uint courseBalance;
        bool active;
        uint activeStudents;
        uint seatsAvailable; //to simulate a student buying multiple seats for a course
        uint totalSeats;
        address payable courseOwner;
    }
    
    function getOwnerUniversity(address _ownerAddress) public view returns(uint id, string memory name, uint courseIdGenerator){
        id = mapUniversity[_ownerAddress].id;
        name = mapUniversity[_ownerAddress].name;
        courseIdGenerator = mapUniversity[_ownerAddress].courseIdGenerator;
        
        return(id, name, courseIdGenerator);
    }
    
    /// @author Jafett Sandi
    /// @notice Gets a course based on an address and CourseId
    /// @param _ownerAddress The address of the owner of the course
    /// @param _courseId The id of the course
    /// @return courseName, cost, active, activeStudents, seatsAvailable, totalSeats
    function getOwnerCourseByAddress(address _ownerAddress, uint _courseId) public view returns(string memory courseName, uint cost, bool active, uint activeStudents, uint seatsAvailable, uint totalSeats) {
        courseName = mapUniversity[_ownerAddress].courses[_courseId].courseName;
        cost = mapUniversity[_ownerAddress].courses[_courseId].cost;
        active = mapUniversity[_ownerAddress].courses[_courseId].active;
        activeStudents = mapUniversity[_ownerAddress].courses[_courseId].activeStudents;
        seatsAvailable = mapUniversity[_ownerAddress].courses[_courseId].seatsAvailable;
        totalSeats = mapUniversity[_ownerAddress].courses[_courseId].totalSeats;
        
        return (courseName, cost, active, activeStudents, seatsAvailable, totalSeats);
    }

    function getNumberPlatformUser() public view returns(uint number){
        number = platformUsersList.length;
        return number;
    }
        
    function isUnivOwner(address _address) public view returns(bool){
        return universityOwners.bearer[_address];
    }
    
    // Events
    event LogUniversityAdded(string name, string desc, uint universityId);
    event LogCourseAdded(string _courseName, uint cost, uint _seatsAvailable, uint courseId);

    // Modifiers
    modifier validAddress(address _address) {
        require(_address != address(0), "ADDRESS CANNOT BE THE ZERO ADDRESS");
        _;
    }

    modifier isUniversityOwner(address _addr) {
        require(universityOwners.has(_addr), "DOES NOT HAVE UNIVERSITY OWNER ROLE");
        _;
    }

    modifier isStudent(address _addr) {
        require(students.has(_addr), "DOES NOT HAVE STUDENT ROLE");
        _;
    }

    modifier enoughSeats(uint _universityId, uint _courseId, uint _quantity) {
        require((universities[_universityId].courses[_courseId].seatsAvailable >= _quantity), "NOT ENOUGH SEATS IN THIS COURSE - CONTACT UNIVERSITY OWNER");
        _;
    }

    modifier ownerAtUniversity(uint _universityId) {
        require((universities[_universityId].UniversityOwner == msg.sender), "DOES NOT BELONG TO THE UNIVERSITY OWNERS OR IS INACTIVE");
        require(universityOwners.has(msg.sender), "DOES NOT HAVE UNIVERSITY OWNER ROLE");
        _;
    }

    modifier courseIsActive(uint _universityId, uint _courseId) {
        require((universities[_universityId].courses[_courseId].active == true), "COURSE IS INACTIVE - CONTACT UNIVERSITY OWNER");
        _;
    }

    modifier paidEnough(uint _universityId, uint _courseId, uint _quantity)
    {
        uint coursePrice = universities[_universityId].courses[_courseId].cost;
        require((universities[_universityId].courses[_courseId].seatsAvailable >= _quantity), "NOT ENOUGH SEATS IN THIS COURSE - CONTACT UNIVERSITY OWNER");
        require(msg.value >= (coursePrice * _quantity), "NOT ENOUGH FEES PAID");
        _;
    }

    modifier checkValue(uint _universityId, uint _courseId, uint _quantity, address payable _addr)  {
    //refund them after pay for item
        _;
        uint coursePrice = universities[_universityId].courses[_courseId].cost * _quantity;
        uint total2RefundAfterPay = msg.value - coursePrice;
        _addr.transfer(total2RefundAfterPay);
    }
    
    modifier checkActive(uint _universityId, uint _courseId){
        bool isActive = universities[_universityId].courses[_courseId].active;
        
        require(isActive == true, "THE COURSE IS NOT ACTIVE, YOU CANNOT REGISTER");
        _;
    }


    /// @author Jafett Sandi
    /// @notice Adds a University to the platform
    /// @param _name The name of the University
    /// @param _description The description of the University
    /// @param _website The website URL of the University
    /// @param _phoneNumber The PhoneNumber of the University
    function addUniversity(string memory _name, string memory _description, string memory _website, string memory _phoneNumber)
    public onlyOwner
    {
        University memory newUniversity;
        newUniversity.name = _name;
        newUniversity.description = _description;
        newUniversity.website = _website;
        newUniversity.phoneNumber = _phoneNumber;
        newUniversity.open = false;
        newUniversity.id = universityIdGenerator;
        universities[universityIdGenerator] = newUniversity;
        
        universityIdGenerator += 1;

        emit LogUniversityAdded(_name, _description, universityIdGenerator);
    }

    /// @author Jafett Sandi
    /// @notice Adds a course to a University
    /// @param _universityId The id of the University
    /// @param _courseName The name of the course
    /// @param _cost Thecost of the course
    /// @param _seatsAvailable The seatsAvailablefor the course
    /// @return true
    function addCourse(uint _universityId, string memory _courseName, uint _cost, uint _seatsAvailable) public
    ownerAtUniversity(_universityId)
    returns (bool)
    {
        Course memory newCourse;
        newCourse.courseName = _courseName;
        newCourse.seatsAvailable = _seatsAvailable;
        newCourse.totalSeats = _seatsAvailable;
        newCourse.cost = _cost;
        newCourse.active = true;
        newCourse.activeStudents = 0;
        newCourse.courseOwner = universities[_universityId].UniversityOwner;

        uint courseId = universities[_universityId].courseIdGenerator;
        newCourse.id = courseId;
        universities[_universityId].courses[courseId] = newCourse;
        universities[_universityId].courseIdGenerator += 1;

        emit LogCourseAdded(_courseName, _cost, _seatsAvailable, courseId);
        return true;
    }


    /// @author Jafett Sandi
    /// @notice Updates a course's information
    /// @param _universityId The id of the University
    /// @param _courseId The id of the course to update
    /// @param _courseName The name of the course
    /// @param _cost Thecost of the course
    /// @param _seatsAvailable The seatsAvailablefor the course
    /// @param _isActive Is the course active?
    /// @return true
    function updateCourse(uint _universityId, uint _courseId, string memory _courseName, uint _cost, uint _seatsAvailable, bool _isActive)
    public
    ownerAtUniversity(_universityId)
    returns (bool)
    {
        Course memory newCourse;
        newCourse.courseName = _courseName;
        newCourse.seatsAvailable = _seatsAvailable;
        newCourse.totalSeats = _seatsAvailable;
        newCourse.cost = _cost;
        newCourse.active = _isActive;
        universities[_universityId].courses[_courseId] = newCourse;
        return true;
    }

    /// @author Jafett Sandi
    /// @notice Get University details
    /// @param _uniId The id of the University
    /// @return _uniId, name, description, website, phone
    function getUniversity(uint _uniId)
    public view
    returns (uint id, string memory name, string memory description, string memory website, string memory phone)
    {
        name = universities[_uniId].name;
        website = universities[_uniId].website;
        description = universities[_uniId].description;
        phone = universities[_uniId].phoneNumber;
        return (_uniId, name, description, website, phone);
    }
    
    
    /// @author Jafett Sandi
    /// @notice Used to generate a courseId
    /// @param _universityId The id of the University
    /// @return courseId
    function getCourseId (uint _universityId) public view returns(uint){
            uint courseIdGenerator = universities[_universityId].courseIdGenerator;
            return courseIdGenerator;
    }
    
    
    /// @author Jafett Sandi
    /// @notice Get the owner of a university
    /// @param _universityId The id of the University
    /// @return universityOwner Address of the university owner
    function getUniversityOwner (uint _universityId) public view returns(address universityOwner){
            universityOwner = universities[_universityId].UniversityOwner;
            return universityOwner;
    }
    
    
   /// @author Jafett Sandi
    /// @notice Get the details of a university course
    /// @param _universityId The id of the University
    /// @param _courseId The courseId of the course
    /// @return All information about a course
    function getUniversityCourse(uint _universityId, uint _courseId) 
    public view 
    returns(
        uint universityId,
        uint courseId,
        string memory courseName, 
        uint cost, 
        bool active, 
        uint activeStudents, 
        uint seatsAvailable, 
        uint totalSeats,
        uint balance){
            courseName = universities[_universityId].courses[_courseId].courseName;
            courseId = universities[_universityId].courses[_courseId].id;
            cost = universities[_universityId].courses[_courseId].cost;
            active = universities[_universityId].courses[_courseId].active;
            activeStudents = universities[_universityId].courses[_courseId].activeStudents;
            seatsAvailable = universities[_universityId].courses[_courseId].seatsAvailable;
            totalSeats = universities[_universityId].courses[_courseId].totalSeats;            
            balance = universities[_universityId].courses[_courseId].courseBalance;            
        
            return (universityId, courseId, courseName, cost, active, activeStudents, seatsAvailable, totalSeats,balance);
        }
        
        
    /// @author Jafett Sandi
    /// @notice Toggles the state of a course
    /// @param _universityId The id of the University
    /// @param _courseId The id of the course
    /// @param _state The state to toggle the course
    function toggleActiveCourse(uint _universityId, uint _courseId, bool _state) public {
        universities[_universityId].courses[_courseId].active = _state;
    }
    
    /// @author Jafett Sandi
    /// @notice Gets a platform member information
    /// @param _address The address of the member
    /// @return All information about a platform member
    function getPlatformMember(address _address)
    public view
    returns (
        uint id, 
        string memory fullname, 
        string memory email, 
        address  userAddress, 
        bool isUnivOwner)
    {
        fullname = platformUsers[_address].fullName;
        email = platformUsers[_address].email;
        id = platformUsers[_address].id;
        userAddress = platformUsers[_address].userAddress;
        
        isUnivOwner = platformUsers[_address].isUniversityOwner;
        return (id, fullname, email, userAddress, isUnivOwner);
    }


    /*
    Roles and membership
    */

    /// @author Jafett Sandi
    /// @notice Adds an owner to the platform
    /// @param _ownerAddr The address of the member
    /// @param _universityId The id of the University
    /// @param _name The name of the owner of the University
    /// @param _email The email address of the member
    /// @return bool
    function addUniversityOwner(address payable _ownerAddr, uint _universityId, string memory _name, string memory _email)
    public onlyOwner
    validAddress(_ownerAddr)
    returns (bool)
    {
        PlatformMember memory newPlatformMember;
        newPlatformMember.fullName = _name;
        newPlatformMember.email = _email;
        newPlatformMember.id = UserIdGenerator;
        newPlatformMember.isUniversityOwner = true;
        newPlatformMember.userAddress = _ownerAddr;
        
        universityOwners.add(_ownerAddr);

        platformUsers[_ownerAddr] = newPlatformMember;
        UserIdGenerator += 1;

        universities[_universityId].UniversityOwner = _ownerAddr;
        universities[_universityId].open = true;
        
        mapUniversity[_ownerAddr] = universities[_universityId];
    
        platformUsersList.push(_ownerAddr);

        return true;
    }


    /// @author Jafett Sandi
    /// @notice Registers a new user into the Platform - Owner or Student
    /// @param _addr The address of the member
    /// @param _name The name of the member
    /// @param _email The email address of the member
    /// @return bool
    function addStudent(address _addr, string memory _name, string memory _email) public
    validAddress(_addr)
    returns (bool)
    {
        PlatformMember memory newPlatformMember;
        newPlatformMember.fullName = _name;
        newPlatformMember.email = _email;
        newPlatformMember.id = UserIdGenerator;
        students.add(_addr);
        newPlatformMember.isUniversityOwner = false;

        platformUsers[_addr] = newPlatformMember;
        UserIdGenerator += 1;
        return true;
    }

    function getCourseBalance(uint _univId ,uint _courseId) public view returns (uint){
        return universities[_univId].courses[_courseId].courseBalance;
    }

    /*
    Students specific functions
    - Buy/Pay course
    */

    /// @author Jafett Sandi
    /// @notice Buy a course
    /// @param _uniId The id of the university
    /// @param _courseId The id of the course
    /// @param _quantity The number of seats to buy
    function buyCourse(uint _uniId, uint _courseId, uint _quantity)
    public payable
    //isStudent(msg.sender)
    //checkValue(_uniId, _courseId, _quantity, msg.sender)
    paidEnough(_uniId, _courseId, _quantity)
    checkActive(_uniId, _courseId)
    {
        universities[_uniId].courses[_courseId].courseBalance += msg.value;
        universities[_uniId].courses[_courseId].seatsAvailable -= _quantity;
    }

    /// @author Jafett Sandi
    /// @notice Withdraw the course funds
    /// @param _uniId The id of the university
    /// @param _courseId The id of the course    
    function withdrawCourseFunds(uint _uniId, uint _courseId)
    public payable
    {
        require(msg.sender ==  universities[_uniId].courses[_courseId].courseOwner, "Need to be the course owner");
        uint courseBalance = universities[_uniId].courses[_courseId].courseBalance;
        universities[_uniId].courses[_courseId].courseBalance = 0;
        msg.sender.transfer(courseBalance);
    }
}