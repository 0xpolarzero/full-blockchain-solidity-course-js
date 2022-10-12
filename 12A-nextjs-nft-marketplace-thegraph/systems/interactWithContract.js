import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

function readFromContract(address, abi, functionName, args) {
  const { data, isError, isLoading } = useContractRead({
    addressOrName: address,
    contractInterface: abi,
    functionName,
    args,
  });

  if (isError) {
    console.log('Error reading from contract');
    return null;
  }

  return data;
}

function writeToContract(
  contractAddress,
  contractAbi,
  functionName,
  args,
  handling,
) {
  const { config, status, error, refetch } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: contractAbi,
    functionName,
    args,
  });

  const { data, write } = useContractWrite({
    ...config,
    onSuccess: handling.onSuccess,
    onError: handling.onError,
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
  });

  return { write, isLoading, isSuccess, refetch };
}

function writeToContractWithoutPrepare(
  contractAddress,
  contractAbi,
  functionName,
  args,
  handling,
) {
  const { write, isLoading, isSuccess } = useContractWrite({
    addressOrName: contractAddress,
    contractInterface: contractAbi,
    functionName,
    args,
    onSuccess: handling.onSuccess,
    onError: handling.onError,
  });

  return { write, isLoading, isSuccess };
}

export { readFromContract, writeToContract, writeToContractWithoutPrepare };
