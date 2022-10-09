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

function readFromContractAsync(address, abi, functionName, args) {
  const { refetch, isError, isLoading } = useContractRead({
    addressOrName: address,
    contractInterface: abi,
    functionName,
    args,
  });

  if (isError) {
    console.log('Error reading from contract');
    return null;
  }

  return refetch;
}

function writeToContract(
  contractAddress,
  contractAbi,
  functionName,
  args,
  handling,
) {
  const { config } = usePrepareContractWrite({
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

  // Test with timeout to try toast with promise

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return { write, isLoading, isSuccess };
}

export { readFromContract, readFromContractAsync, writeToContract };
