// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HushMail {
    struct Identity {
        string name;
        string profilePicture;
        bool isAnonymous;
    }

    struct Response {
        uint256 responseId;
        uint256 postId;
        address responder; 
        string content;
        Identity identity;
        uint256 etherTransferred; // Ether sent with response
        uint256 creationTime;
    }

    struct Post {
        uint256 postId;
        string content;
        address payable owner;
        bool isPublic;
        bool manualAccepting;
        uint256 creationTime;
        uint256 acceptingUntil; 
        uint256 totalResponses;
        uint256 totalEarnings;
        Identity identity;
        Response[] responses; // Array to hold responses
    }

    mapping(uint256 => Post) public posts;
    mapping(address => uint256[]) public userPosts; // Keeps track of posts by user
    mapping(uint256 => Response[]) public postResponses; // Keeps track of responses per post

    uint256 public postCounter;
    uint256 public responseCounter;
    address payable public contractOwner;
    uint256 public platformFee = 0.001 ether; // Fixed fee for creating posts
    uint256 public responseFeePercentage = 50; // 0.5%

    event PostCreated(uint256 postId, address owner, string content);
    event PostUpdated(uint256 postId, string newContent, bool isPublic, bool manualAccepting, uint256 acceptingUntil);
    event PostDeleted(uint256 postId, address owner);
    event ResponseCreated(uint256 responseId, uint256 postId, address responder, string content, uint256 etherTransferred);

    constructor() {
        contractOwner = payable(msg.sender); // Set contract deployer as owner
    }

    // Create a new post
    function createPost(
        string memory _content,
        bool _isPublic,
        bool _manualAccepting, 
        uint256 _acceptingUntil, 
        string memory _name,
        string memory _profilePicture,
        bool _isAnonymous
    ) public payable {
        require(msg.value >= platformFee, "Insufficient fee to create post");

        postCounter++;
        Identity memory ownerIdentity = Identity({
            name: _name,
            profilePicture: _profilePicture,
            isAnonymous: _isAnonymous
        });

        Post storage newPost = posts[postCounter];
        newPost.postId = postCounter;
        newPost.content = _content;
        newPost.owner = payable(msg.sender);
        newPost.isPublic = _isPublic;
        newPost.manualAccepting = _manualAccepting;
        newPost.acceptingUntil = _acceptingUntil;
        newPost.creationTime = block.timestamp;
        newPost.identity = ownerIdentity;
        newPost.totalResponses = 0;
        newPost.totalEarnings = 0; // Initialize earnings

        userPosts[msg.sender].push(postCounter);

        // Transfer platform fee to contract owner
        contractOwner.transfer(platformFee);

        // Calculate remaining balance
        uint256 remainingBalance = msg.value - platformFee;

        // Return the remaining balance back to the sender, if any
        if (remainingBalance > 0) {
            // payable(msg.sender).transfer(remainingBalance);
            (bool success, ) = payable(msg.sender).call{value: remainingBalance}("");
            require(success, "Failed to send remaining ether");
        }

        emit PostCreated(postCounter, msg.sender, _content);
    }

    // Respond to a post
    function respondToPost(
        uint256 _postId,
        string memory _content,
        string memory _name,
        string memory _profilePicture,
        bool _isAnonymous
    ) public payable {
        require(posts[_postId].postId != 0, "Post does not exist");
        require(block.timestamp <= posts[_postId].acceptingUntil || posts[_postId].manualAccepting, "Post is no longer accepting responses");

        // Calculate platform fee if ether is sent
        uint256 etherToOwner = msg.value;
        uint256 platformFeeAmount = 0;

        if (etherToOwner > 0) {
            platformFeeAmount = (etherToOwner * responseFeePercentage) / 10000; // 0.5%
            require(etherToOwner > platformFeeAmount, "Ether sent must be more than platform fee");

            posts[_postId].totalEarnings += etherToOwner - platformFeeAmount; // Update total earnings
        }

        // Create and store response
        responseCounter++;
        Identity memory responderIdentity = Identity({
            name: _name,
            profilePicture: _profilePicture,
            isAnonymous: _isAnonymous
        });

        Response memory newResponse = Response({
            responseId: responseCounter,
            postId: _postId,
            responder: msg.sender,
            content: _content,
            identity: responderIdentity,
            etherTransferred: etherToOwner,
            creationTime: block.timestamp
        });

        posts[_postId].responses.push(newResponse);
        posts[_postId].totalResponses++;

        // Interactions (after effects)
        // Transfer platform fee to contract owner
        (bool platformSuccess, ) = contractOwner.call{value: platformFeeAmount}("");
        require(platformSuccess, "Failed to send platform fee");

        // Transfer ether to the post owner
        (bool ownerSuccess, ) = posts[_postId].owner.call{value: etherToOwner - platformFeeAmount}("");
        require(ownerSuccess, "Failed to send ether to post owner");

        emit ResponseCreated(responseCounter, _postId, msg.sender, _content, etherToOwner);
    }


    // Get all posts with their details and responses
    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCounter);

        for (uint256 i = 1; i <= postCounter; i++) {
            allPosts[i - 1] = posts[i];
        }

        return allPosts;
    }

    function getChunkPosts(uint256 startIndex, uint256 endIndex) public view returns (Post[] memory) {
    require(endIndex >= startIndex, "Invalid index range");
    require(endIndex <= postCounter, "End index exceeds post count");

    Post[] memory selectedPosts = new Post[](endIndex - startIndex + 1);

    for (uint256 i = startIndex; i <= endIndex; i++) {
        selectedPosts[i - startIndex] = posts[i];
    }

    return selectedPosts;
}



    // Update a post
    function updatePost(
        uint256 _postId,
        string memory _newContent,
        bool _isPublic,
        bool _manualAccepting,
        uint256 _acceptingUntil
    ) public {
        Post storage postToUpdate = posts[_postId];

        // Ensure the caller is the owner of the post
        require(postToUpdate.owner == msg.sender, "Only the post owner can update this post");

        // Update the post details
        postToUpdate.content = _newContent;
        postToUpdate.isPublic = _isPublic;
        postToUpdate.manualAccepting = _manualAccepting;
        postToUpdate.acceptingUntil = _acceptingUntil;

        // Emit an event to record the update
        emit PostUpdated(_postId, _newContent, _isPublic, _manualAccepting, _acceptingUntil);
    }

       // Delete a post
    function deletePost(uint256 _postId) public {
        Post storage postToDelete = posts[_postId];

        // Ensure the caller is the owner of the post
        require(postToDelete.owner == msg.sender, "Only the post owner can delete this post");

        // Remove the post ID from the user's post list
        uint256[] storage userPostList = userPosts[msg.sender];
        for (uint256 i = 0; i < userPostList.length; i++) {
            if (userPostList[i] == _postId) {
                // Move the last element into the deleted spot and pop the array to keep it compact
                userPostList[i] = userPostList[userPostList.length - 1];
                userPostList.pop();
                break;
            }
        }

        // Delete the post from the posts mapping
        delete posts[_postId];

        // Emit the PostDeleted event
        emit PostDeleted(_postId, msg.sender);
    }
}

