// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HushmailContractv2{
    struct Post{
        uint256 postId;
        string content;
        address payable postOwner;
        bool isPublic;
        bool manualAcceting;        
        uint256 acceptingUntil;
        uint256 creationTime;
        uint256 totalEarnings;
        uint256 totalResponses;
        Identity identity;
        Response[] responses;
    }

    struct Identity{
        string name;
        string username;
        string avatarUrl;
    }

    struct Response{
        uint256 refPostId;
        uint256 responseId;
        address responder;
        string content;
        uint256 amountTransferredInWei;
        uint256 creationTime;
        Identity identity;
    }

    mapping(uint256 => Post) public posts;
    mapping(address => uint256[]) public userPosts;
    mapping(uint256 => Response[]) public postResponses;

    uint256 public postCounter;
    uint256 public responseCounter;
    address payable public contractOwner;
    uint256 public platformFee = 0.001 ether;
    uint256 public responseFeePercentage = 50; //0.5%

    constructor(){
        contractOwner = payable(msg.sender);  //Setting contract deployer as owner
    }

    // Events
    event PostCreated(
        uint256 indexed postId,
        address indexed postOwner,
        bool isPublic
    );

    event ResponseCreated(
        uint256 indexed postId,
        uint256 indexed responseId,
        address indexed responder,
        bool isAnonymous
    );

    // Event for post update
    event PostUpdated(uint256 indexed postId, address indexed postOwner);

    // Event for post deletion
    event PostDeleted(uint256 indexed postId, address indexed postOwner);

    function createPost(
        string memory _content,
        bool _isPublic,
        bool _manualAccepting,
        bool _isAnonymous,
        string memory _name,
        string memory _username,
        string memory _avatarUrl,
        uint256 _acceptingUntil
    ) public payable {
        require(msg.value >= platformFee, "Insufficient balance to create the post");
        require(bytes(_content).length > 0, "Post content cannot be empty");

        Identity memory ownerIdentity;
        if (_isAnonymous == false) {
            ownerIdentity = Identity({
                name: _name,
                username: _username,
                avatarUrl: _avatarUrl
            });
        } else {
            ownerIdentity = Identity({
                name: "",
                username: "",
                avatarUrl: ""
            });
        }

        postCounter++;
        Post storage newPost = posts[postCounter];
        newPost.postId = postCounter;
        newPost.content = _content;
        newPost.postOwner = payable(msg.sender);
        newPost.isPublic = _isPublic;

        if (_manualAccepting == false) {
            require(_acceptingUntil > block.timestamp, "Needs to be set in the future");
            newPost.acceptingUntil = _acceptingUntil;
        } else {
            newPost.acceptingUntil = 0;
        }

        newPost.creationTime = block.timestamp;
        newPost.identity = ownerIdentity;
        newPost.totalResponses = 0; 
        newPost.totalEarnings = 0; 

        userPosts[msg.sender].push(postCounter);

        // Transfer platform fee to contract owner
        contractOwner.transfer(platformFee);

        emit PostCreated(postCounter, msg.sender, _isPublic);
    }

    function respondToPost(
        uint256 _postId,
        string memory _content,
        bool _isAnonymous,
        string memory _name,
        string memory _username,
        string memory _avatarUrl
    ) public payable {
        require(posts[_postId].postId != 0, "Post does not exist");
        require(_postId <= postCounter, "Post does not exist");
        require(bytes(_content).length > 0, "Response content cannot be empty");

        // Calculate platform fee if ether is sent
        uint256 etherToOwner = msg.value;
        uint256 platformFeeAmount = 0;

        if (etherToOwner > 0) {
            platformFeeAmount = (etherToOwner * responseFeePercentage) / 10000; // 0.5%
            require(etherToOwner > platformFeeAmount, "Ether sent must be more than platform fee");
        }

        // Create and store response
        Identity memory ownerIdentity;
        if (!_isAnonymous) {
            ownerIdentity = Identity({
                name: _name,
                username: _username,
                avatarUrl: _avatarUrl
            });
        } else {
            ownerIdentity = Identity({
                name: "",
                username: "",
                avatarUrl: ""
            });
        }

        // Increment the response counter
        responseCounter++;

        Response memory newResponse = Response({
            refPostId: _postId,
            responseId: responseCounter,
            responder: msg.sender,
            content: _content,
            amountTransferredInWei: etherToOwner,
            creationTime: block.timestamp, // Add creation time
            identity: ownerIdentity
        });

        // Store the response
        postResponses[_postId].push(newResponse);

        // Update the total responses count in the post
        posts[_postId].totalResponses++;

        // Interactions (after effects)
        // Transfer platform fee to contract owner
        (bool platformSuccess, ) = contractOwner.call{value: platformFeeAmount}("");
        require(platformSuccess, "Failed to send platform fee");

        // Transfer ether to the post owner
        (bool ownerSuccess, ) = posts[_postId].postOwner.call{value: etherToOwner - platformFeeAmount}("");
        require(ownerSuccess, "Failed to send ether to post owner");

        // Now update the post's total earnings after successful transfer
        posts[_postId].totalEarnings += etherToOwner - platformFeeAmount;

        // Emit the ResponseCreated event
        emit ResponseCreated(_postId, responseCounter, msg.sender, _isAnonymous);
    }

    function getAllPosts() public view returns (Post[] memory) {
        Post[] memory allPosts = new Post[](postCounter);
        
        for (uint256 i = 1; i <= postCounter; i++) {
            allPosts[i - 1] = posts[i];
        }

        return allPosts;
    }
    
    function getPostResponses(uint256 _postId) public view returns (Response[] memory) {
        require(posts[_postId].postId != 0, "Post does not exist");

        Response[] memory responses = postResponses[_postId];
        return responses;
    }

    function getPostsByPage(uint256 startIndex, uint256 batchSize) public view returns (Post[] memory) {
        require(startIndex > 0 && startIndex <= postCounter, "Invalid startIndex");
        require(batchSize > 0, "Batch size must be greater than 0");

        uint256 endIndex = startIndex + batchSize - 1;
        
        // If the endIndex exceeds the total number of posts, adjust it
        if (endIndex > postCounter) {
            endIndex = postCounter;
        }

        // Calculate the actual number of posts to return
        uint256 actualSize = endIndex - startIndex + 1;
        Post[] memory postsBatch = new Post[](actualSize);

        uint256 index = 0;
        for (uint256 i = startIndex; i <= endIndex; i++) {
            postsBatch[index] = posts[i];
            index++;
        }

        return postsBatch;
    }

    function getResponsesByPage(uint256 _postId, uint256 startIndex, uint256 batchSize) public view returns (Response[] memory) {
        require(posts[_postId].postId != 0, "Post does not exist");
        require(startIndex > 0 && startIndex <= posts[_postId].totalResponses, "Invalid startIndex");
        require(batchSize > 0, "Batch size must be greater than 0");

        uint256 endIndex = startIndex + batchSize - 1;

        // If endIndex exceeds total responses, adjust it
        if (endIndex > posts[_postId].totalResponses) {
            endIndex = posts[_postId].totalResponses;
        }

        // Calculate the actual number of responses to return
        uint256 actualSize = endIndex - startIndex + 1;
        Response[] memory responsesBatch = new Response[](actualSize);

        uint256 index = 0;
        for (uint256 i = startIndex; i <= endIndex; i++) {
            responsesBatch[index] = postResponses[_postId][i - 1]; // Adjust for 0-based index
            index++;
        }

        return responsesBatch;
    }

    function updatePost(
        uint256 _postId,
        string memory _newContent,
        bool _newIsPublic,
        bool _newManualAccepting,
        uint256 _newAcceptingUntil
    ) public {
        // Ensure the post exists
        require(posts[_postId].postId != 0, "Post does not exist");
        
        // Ensure only the owner can update the post
        require(posts[_postId].postOwner == msg.sender, "You are not the owner of this post");
        
        // Ensure new content is not empty
        require(bytes(_newContent).length > 0, "Post content cannot be empty");

        // Update the post's details
        posts[_postId].content = _newContent;
        posts[_postId].isPublic = _newIsPublic;
        posts[_postId].manualAcceting = _newManualAccepting;

        // If not manual accepting, update acceptingUntil to a future time
        if (!_newManualAccepting) {
            require(_newAcceptingUntil > block.timestamp, "Accepting until must be in the future");
            posts[_postId].acceptingUntil = _newAcceptingUntil;
        }

        // Emit an event for the update
        emit PostUpdated(_postId, msg.sender);
    }

    function deletePost(uint256 _postId) public {
        // Ensure the post exists
        require(posts[_postId].postId != 0, "Post does not exist");

        // Ensure only the owner can delete the post
        require(posts[_postId].postOwner == msg.sender, "You are not the owner of this post");

        // Remove the post from the user's list of posts
        uint256[] storage userPostIds = userPosts[msg.sender];
        for (uint256 i = 0; i < userPostIds.length; i++) {
            if (userPostIds[i] == _postId) {
                // Remove the post by shifting the last element to the current index and popping the last one
                userPostIds[i] = userPostIds[userPostIds.length - 1];
                userPostIds.pop();
                break;
            }
        }

        // Delete the post from the posts mapping
        delete posts[_postId];

        // Optionally delete the post's responses (if you want to remove all responses too)
        delete postResponses[_postId];

        // Emit an event for the deletion
        emit PostDeleted(_postId, msg.sender);
    }

    function getPostsByUser(address _user) public view returns (Post[] memory) {
        uint256[] memory postIds = userPosts[_user];  // Get the post IDs for the user
        Post[] memory userPostsArray = new Post[](postIds.length);  // Create an array to hold the posts
        
        for (uint256 i = 0; i < postIds.length; i++) {
            userPostsArray[i] = posts[postIds[i]];  // Fetch each post by its ID
        }

        return userPostsArray;  // Return the array of posts
    }
}
