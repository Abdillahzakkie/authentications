export default function allowedChains() {
	const chains: {
		chainId: number;
		alchemy?: string;
		opensea?: string;
		isTestNetwork?: boolean;
	}[] = [
		{
			chainId: 1,
			alchemy: "eth-mainnet",
			opensea: "ethereum",
		},
		{
			chainId: 8453,
			alchemy: "base-mainnet",
			opensea: "base",
		},
		{
			chainId: 10,
			alchemy: "opt-mainnet",
			opensea: "optimism",
		},
		{
			chainId: 137,
			alchemy: "polygon-mumbai",
			opensea: "matic",
		},

		// Test networks
		{
			chainId: 80001,
			alchemy: "polygon-mumbai",
			opensea: "mumbai",
		},
		{
			chainId: 5,
			alchemy: "eth-goerli",
			opensea: "goerli",
			isTestNetwork: true,
		},
		{
			chainId: 11155111,
			alchemy: "eth-sepolia",
			opensea: "sepolia",
			isTestNetwork: true,
		},
	];
	return chains;
}
