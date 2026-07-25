"use client";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";

export function WalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const arcChainId = 1227853239;

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: injected() })}
        style={{ fontSize: "8px", padding: "8px 14px", background: "transparent", color: "#ffd700", border: "3px solid #ffd700", boxShadow: "3px 3px 0 #7a6500", cursor: "pointer", fontFamily: "'Press Start 2P', monospace" }}
      >
        [ CONNECT WALLET ]
      </button>
    );
  }

  if (chain?.id !== arcChainId) {
    return (
      <button
        onClick={() => switchChain({ chainId: arcChainId })}
        style={{ fontSize: "8px", padding: "8px 14px", background: "#ff4444", color: "#fff", border: "3px solid #cc0000", boxShadow: "3px 3px 0 #7a0000", cursor: "pointer", fontFamily: "'Press Start 2P', monospace" }}
      >
        [ SWITCH TO ARC ]
      </button>
    );
  }

  return (
    <button
      onClick={() => disconnect()}
      style={{ fontSize: "8px", padding: "8px 14px", background: "#001a00", color: "#00ff41", border: "3px solid #00ff41", boxShadow: "3px 3px 0 #007a1f", cursor: "pointer", fontFamily: "'Press Start 2P', monospace" }}
    >
      {address?.slice(0, 6)}...{address?.slice(-4)}
    </button>
  );
}
