import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="border-b-2 w-full flex justify-between items-center">
      <h1 className="py-4 px-4 font-bold text-3xl"> Decentralized Lottery</h1>
      <div className="px-2 py-2">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
