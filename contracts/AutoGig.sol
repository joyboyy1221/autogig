// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract AutoGig {
    IERC20 public immutable usdc;

    enum Status { Open, InProgress, Completed, Cancelled }

    struct Gig {
        address poster;
        string title;
        string description;
        uint256 bounty;
        Status status;
        address worker;
        uint256 createdAt;
    }

    mapping(uint256 => Gig) public gigs;
    uint256 public gigCount;

    event GigPosted(uint256 indexed gigId, address indexed poster, uint256 bounty, string title);
    event GigStarted(uint256 indexed gigId, address indexed worker);
    event GigCompleted(uint256 indexed gigId, address indexed worker, uint256 bounty);
    event GigCancelled(uint256 indexed gigId);

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }

    function postGig(string calldata title, string calldata description, uint256 bounty) external returns (uint256) {
        require(bounty > 0, "Bounty must be greater than 0");
        require(usdc.transferFrom(msg.sender, address(this), bounty), "USDC transfer failed");
        uint256 gigId = gigCount++;
        gigs[gigId] = Gig({
            poster: msg.sender,
            title: title,
            description: description,
            bounty: bounty,
            status: Status.Open,
            worker: address(0),
            createdAt: block.timestamp
        });
        emit GigPosted(gigId, msg.sender, bounty, title);
        return gigId;
    }

    function startGig(uint256 gigId) external {
        Gig storage gig = gigs[gigId];
        require(gig.status == Status.Open, "Gig not open");
        require(gig.poster != msg.sender, "Poster cannot be worker");
        gig.status = Status.InProgress;
        gig.worker = msg.sender;
        emit GigStarted(gigId, msg.sender);
    }

    function completeGig(uint256 gigId) external {
        Gig storage gig = gigs[gigId];
        require(gig.status == Status.InProgress, "Gig not in progress");
        require(gig.poster == msg.sender, "Only poster can complete");
        gig.status = Status.Completed;
        require(usdc.transfer(gig.worker, gig.bounty), "USDC payout failed");
        emit GigCompleted(gigId, gig.worker, gig.bounty);
    }

    function cancelGig(uint256 gigId) external {
        Gig storage gig = gigs[gigId];
        require(gig.poster == msg.sender, "Only poster can cancel");
        require(gig.status == Status.Open, "Can only cancel open gigs");
        gig.status = Status.Cancelled;
        require(usdc.transfer(gig.poster, gig.bounty), "USDC refund failed");
        emit GigCancelled(gigId);
    }

    function getGig(uint256 gigId) external view returns (Gig memory) {
        return gigs[gigId];
    }

    function getAllGigs() external view returns (Gig[] memory) {
        Gig[] memory allGigs = new Gig[](gigCount);
        for (uint256 i = 0; i < gigCount; i++) {
            allGigs[i] = gigs[i];
        }
        return allGigs;
    }
}
