export const mockPosts = [
  {
    id: "1",
    content: "Just deployed my first smart contract on Ethereum!",
    isPublic: true,
    manualAccepting: false,
    acceptingUntil: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(), // 7 days from now
    creationTime: new Date().toISOString(),
    totalResponses: 5,
    totalEarnings: "0.05",
    identity: {
      name: "CryptoEnthusiast",
      profilePicture: "/placeholder-user-1.jpg",
      isAnonymous: false,
    },
    responses: [
      {
        responseId: "1",
        postId: "1",
        responder: "0x1234567890123456789012345678901234567890",
        content: "Congratulations! What kind of contract did you deploy?",
        identity: {
          name: "BlockchainDev",
          profilePicture: "/placeholder-user-2.jpg",
          isAnonymous: false,
        },
        etherTransferred: "0.01",
        creationTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      // Add more responses as needed
    ],
  },
  {
    id: "2",
    content: "Looking for feedback on my new DeFi protocol idea. Any takers?",
    isPublic: true,
    manualAccepting: true,
    acceptingUntil: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(), // 30 days from now
    creationTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    totalResponses: 10,
    totalEarnings: "0.5",
    identity: {
      name: "DeFiInnovator",
      profilePicture: "/placeholder-user-3.jpg",
      isAnonymous: false,
    },
    responses: [
      // Add responses here
    ],
  },
  {
    id: "3",
    content: "Anonymous question about crypto taxes. Need expert advice!",
    isPublic: false,
    manualAccepting: false,
    acceptingUntil: new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000
    ).toISOString(), // 14 days from now
    creationTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    totalResponses: 3,
    totalEarnings: "0.2",
    identity: {
      name: "AnonymousUser",
      profilePicture: "/placeholder-anonymous.jpg",
      isAnonymous: true,
    },
    responses: [
      // Add responses here
    ],
  },
];

export const mockStats = {
  totalPosts: 15,
  totalResponses: 87,
  activePosts: 12,
  publicPosts: 10,
  privatePosts: 5,
  latestResponse: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(), // 30 minutes ago
};
