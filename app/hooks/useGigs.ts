"use client";
import { useState, useEffect } from "react";
import { publicClient, CONTRACT_ADDRESS, ABI } from "../../lib/contract";

export interface Gig {
  id: number;
  poster: string;
  title: string;
  description: string;
  bounty: bigint;
  status: number;
  worker: string;
  createdAt: bigint;
}

const STATUS = ["OPEN", "IN PROGRESS", "COMPLETED", "CANCELLED"];

export function useGigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchGigs() {
    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "getAllGigs",
      });
      const formatted = (data as any[]).map((g, i) => ({
        id: i,
        poster: g.poster,
        title: g.title,
        description: g.description,
        bounty: g.bounty,
        status: g.status,
        worker: g.worker,
        createdAt: g.createdAt,
      }));
      setGigs(formatted);
    } catch (e) {
      console.error("Failed to fetch gigs:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGigs();
    const interval = setInterval(fetchGigs, 10000);
    return () => clearInterval(interval);
  }, []);

  return { gigs, loading, refetch: fetchGigs, STATUS };
}
