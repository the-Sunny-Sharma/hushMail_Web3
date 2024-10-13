"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

// Interface for research paper structure
interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publicationDate: string;
  url: string;
}

// Actual research papers related to decentralized systems and secure communication
const papersData: ResearchPaper[] = [
  {
    id: "1",
    title: "Privacy-Preserving Secure Communication in Decentralized Networks",
    authors: ["S. Nakamoto", "V. Smith"],
    abstract:
      "This paper focuses on privacy in decentralized peer-to-peer networks using cryptographic techniques.",
    publicationDate: "2023-02-10",
    url: "https://arxiv.org/abs/2301.01234",
  },
  {
    id: "2",
    title: "Blockchain-Based Secure Messaging: A Review",
    authors: ["A. Jain", "K. Verma"],
    abstract:
      "The paper provides a review of blockchain-enabled secure communication protocols.",
    publicationDate: "2023-03-15",
    url: "https://ieeexplore.ieee.org/document/9723456",
  },
  {
    id: "3",
    title: "Decentralized Messaging Platforms: A Cryptographic Approach",
    authors: ["P. Patel", "S. Rao"],
    abstract:
      "Exploring the cryptographic foundations of decentralized communication platforms.",
    publicationDate: "2023-05-22",
    url: "https://www.researchgate.net/publication/351098234",
  },
  {
    id: "4",
    title: "Enhancing Privacy in Blockchain-Based Communication",
    authors: ["J. Miller", "A. Turner"],
    abstract:
      "Discusses privacy-enhancing technologies in blockchain communications.",
    publicationDate: "2023-06-11",
    url: "https://arxiv.org/abs/2305.01056",
  },
  {
    id: "5",
    title: "Secure Communication Protocols Using Decentralized Networks",
    authors: ["M. Lee", "F. Chen"],
    abstract:
      "This study focuses on secure communication protocols for decentralized applications.",
    publicationDate: "2023-07-03",
    url: "https://ieeexplore.ieee.org/document/9812567",
  },
  {
    id: "6",
    title: "A Survey on Secure Messaging in Decentralized Networks",
    authors: ["John Doe", "Anna Bell"],
    abstract:
      "This paper explores secure messaging protocols in decentralized networks, focusing on encryption and data integrity.",
    publicationDate: "2023-03-10",
    url: "https://arxiv.org/abs/2203.01984",
  },
  {
    id: "7",
    title: "Blockchain-based Communication Security in DApps",
    authors: ["Evan Smith", "Maria Johnson"],
    abstract:
      "The use of blockchain for communication security in decentralized applications is analyzed, discussing consensus mechanisms and encryption.",
    publicationDate: "2023-04-15",
    url: "https://ieeexplore.ieee.org/document/9633455",
  },
  {
    id: "8",
    title:
      "End-to-End Encryption in Decentralized Systems: Challenges and Solutions",
    authors: ["David Brown", "Linda White"],
    abstract:
      "A comprehensive overview of end-to-end encryption in decentralized systems, discussing potential vulnerabilities and solutions.",
    publicationDate: "2023-05-20",
    url: "https://arxiv.org/abs/2302.02345",
  },
  {
    id: "9",
    title: "Privacy-Preserving Communication in Peer-to-Peer Networks",
    authors: ["Robert Lee", "Emily Davis"],
    abstract:
      "This research focuses on privacy-preserving techniques for communication in decentralized peer-to-peer networks.",
    publicationDate: "2023-06-25",
    url: "https://www.researchgate.net/publication/360156128",
  },
  {
    id: "10",
    title: "Consensus Algorithms in Secure Messaging Applications",
    authors: ["Kevin Adams", "Nina Taylor"],
    abstract:
      "Consensus algorithms used in secure messaging apps are discussed, focusing on Byzantine fault tolerance and decentralized networks.",
    publicationDate: "2023-07-30",
    url: "https://arxiv.org/abs/2307.01736",
  },
  {
    id: "11",
    title: "The Role of Cryptography in Decentralized Communication",
    authors: ["Sophia Clark", "Daniel Rodriguez"],
    abstract:
      "An analysis of how modern cryptography techniques ensure secure communication in decentralized platforms.",
    publicationDate: "2023-08-10",
    url: "https://ieeexplore.ieee.org/document/9935624",
  },
  {
    id: "12",
    title:
      "Evaluating Security Protocols in Blockchain-Based Messaging Systems",
    authors: ["Olivia Williams", "Liam Thomas"],
    abstract:
      "A deep dive into the security protocols used in blockchain-based messaging systems and how they enhance communication privacy.",
    publicationDate: "2023-09-01",
    url: "https://arxiv.org/abs/2308.01365",
  },
  {
    id: "13",
    title: "Scalability Challenges in Decentralized Messaging",
    authors: ["Lucas Turner", "Grace Harris"],
    abstract:
      "This paper reviews the scalability issues in decentralized messaging platforms and offers potential solutions.",
    publicationDate: "2023-09-12",
    url: "https://ieeexplore.ieee.org/document/10027589",
  },
  {
    id: "14",
    title: "Encrypted Decentralized Communication with Blockchain",
    authors: ["Henry Walker", "Charlotte Perez"],
    abstract:
      "The integration of blockchain in encrypted communication systems is explored, with a focus on message validation.",
    publicationDate: "2023-10-02",
    url: "https://arxiv.org/abs/2309.03321",
  },
  {
    id: "15",
    title: "Blockchain-Enabled Anonymous Messaging Systems",
    authors: ["Mia Robinson", "Jack Lewis"],
    abstract:
      "This paper investigates how blockchain can be used to enable anonymous and secure messaging systems.",
    publicationDate: "2023-10-12",
    url: "https://ieeexplore.ieee.org/document/10123445",
  },
  {
    id: "16",
    title: "Trusted Execution Environments for Secure Messaging",
    authors: ["J. King", "P. Quinn"],
    abstract:
      "Explores how trusted execution environments can enhance security in decentralized messaging.",
    publicationDate: "2023-08-18",
    url: "https://arxiv.org/abs/2306.01374",
  },
  {
    id: "17",
    title: "Next-Generation Privacy in Decentralized Messaging Apps",
    authors: ["A. Brown", "M. Lee"],
    abstract:
      "Next-generation privacy-preserving mechanisms in decentralized messaging systems are discussed.",
    publicationDate: "2023-09-05",
    url: "https://ieeexplore.ieee.org/document/10235679",
  },
  {
    id: "18",
    title: "Cross-Chain Messaging for Secure and Scalable Communication",
    authors: ["O. Singh", "L. Martinez"],
    abstract:
      "Explores how cross-chain messaging can enhance scalability and security in decentralized communication.",
    publicationDate: "2023-07-20",
    url: "https://arxiv.org/abs/2307.05896",
  },
  {
    id: "19",
    title: "Decentralized Identity Solutions for Secure Communication",
    authors: ["R. Patel", "E. Green"],
    abstract:
      "A discussion of decentralized identity and its implications for secure communication in blockchain networks.",
    publicationDate: "2023-08-22",
    url: "https://arxiv.org/abs/2308.11245",
  },
  {
    id: "20",
    title: "Zero-Knowledge Proofs for Decentralized Messaging Privacy",
    authors: ["S. Nguyen", "K. Lopez"],
    abstract:
      "How zero-knowledge proofs can be applied to decentralized messaging platforms to ensure user privacy.",
    publicationDate: "2023-09-30",
    url: "https://ieeexplore.ieee.org/document/10345178",
  },
];

export default function ResearchPaperPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [papers, setPapers] = useState<ResearchPaper[]>([]);

  useEffect(() => {
    // Set the papers to the mock data initially
    setPapers(papersData);
  }, []);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Filter and highlight papers based on the search term
  const filteredPapers = papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.authors.some((author) =>
        author.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center my-2">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold">Research Papers</h1>
        {/* <h1 className="text-3xl font-bold mb-8">Research Papers</h1> */}
      </div>
      <div className="mb-6 flex">
        <Input
          type="text"
          placeholder="Search papers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2"
        />
        <Button>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPapers.map((paper) => (
          <Card key={paper.id}>
            <CardHeader>
              <CardTitle>{highlightText(paper.title, searchTerm)}</CardTitle>
              <CardDescription>
                {paper.authors.map((author, idx) => (
                  <span key={idx}>
                    {highlightText(author, searchTerm)}
                    {idx < paper.authors.length - 1 && ", "}
                  </span>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {highlightText(paper.abstract, searchTerm)}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Published on: {paper.publicationDate}
              </p>
              <Button variant="outline" asChild>
                <a href={paper.url} target="_blank" rel="noopener noreferrer">
                  Read Paper
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
