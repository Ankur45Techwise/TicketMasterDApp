// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply;

    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
        string category; // New category field
    }

    mapping(uint256 => Occasion) public occasions;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) seatsTaken;
    mapping(uint256 => address) public occasionCreators; // Track occasion creators
    mapping(uint256 => uint256) public occasionBalances; // Track funds per occasion

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location,
        string memory _category // New category parameter
    ) public {
        totalOccasions++;
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location,
            _category // Set the category
        );
        occasionCreators[totalOccasions] = msg.sender; // Set the occasion creator
    }

    function mint(uint256 _id, uint256 _seat) public payable {
        require(_id != 0);
        require(_id <= totalOccasions);
        require(msg.value >= occasions[_id].cost);
        require(seatTaken[_id][_seat] == address(0));
        require(_seat <= occasions[_id].maxTickets);

        occasions[_id].tickets -= 1; // Update ticket count
        hasBought[_id][msg.sender] = true; // Update buying status
        seatTaken[_id][_seat] = msg.sender; // Assign seat
        seatsTaken[_id].push(_seat); // Update seats currently taken

        occasionBalances[_id] += occasions[_id].cost; // Track funds for the occasion
        totalSupply++;

        _safeMint(msg.sender, totalSupply);
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    function withdrawFunds(uint256 _id) public {
        require(msg.sender == occasionCreators[_id], "Not the occasion creator");
        uint256 occasionBalance = occasionBalances[_id];
        require(occasionBalance > 0, "No funds to withdraw for this occasion");

        occasionBalances[_id] = 0; // Reset the balance before transferring
        (bool success, ) = msg.sender.call{value: occasionBalance}("");
        require(success, "Withdrawal failed");
    }
}