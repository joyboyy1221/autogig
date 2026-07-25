import { createPublicClient, http } from "viem";

const arcTestnet = {
  id: 1227853239,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
} as const;

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

export const CONTRACT_ADDRESS = "0xa7877E90d33C3B2D42E341fDad04943080a5Deb6" as const;

export const ABI = [
  {
    name: "getAllGigs",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{
      type: "tuple[]",
      components: [
        { name: "poster", type: "address" },
        { name: "title", type: "string" },
        { name: "description", type: "string" },
        { name: "bounty", type: "uint256" },
        { name: "status", type: "uint8" },
        { name: "worker", type: "address" },
        { name: "createdAt", type: "uint256" },
      ]
    }]
  }
] as const;
