
import { createWalletClient, custom, createPublicClient, parseEther, defineChain } from "https://esm.sh/viem";
import { contractAddress, coffeeabi } from "./constants.js"

const connectbtn = document.getElementById("connectbtn")
const fundbtn = document.getElementById("fundbtn")
const ethamountinput = document.getElementById("ethamount")
let walletclient
let publicClient

async function connect() {
    if (typeof window.ethereum !== "undefined") {

        walletclient = createWalletClient({
            transport: custom(window.ethereum)})
        await walletclient.requestAddresses()
        connectbtn.innerHTML = "connected"

    } else {
        connectbtn.innerHTML = "please install metamask"
    }
}

async function fund() {
    const ethamount = ethamountinput.value
    console.log(`funding with ${ethamount}..`)

    if (typeof window.ethereum !== "undefined") {

        walletclient = createWalletClient({
            transport: custom(window.ethereum)
        })
       const [connectedAccount] = await walletclient.requestAddresses()
       const currentChain = await getCurrentChain(walletclient)
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        
        await publicClient.simulateContract({
            address: contractAddress,
            abi: coffeeabi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethamount)
        })
    }
    else {
        connectbtn.innerHTML = "please install metamask"
    }

}

async function getCurrentChain(client) {
  const chainId = await client.getChainId()
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  })
  return currentChain
}

connectbtn.onclick = connect
fundbtn.onclick = fund