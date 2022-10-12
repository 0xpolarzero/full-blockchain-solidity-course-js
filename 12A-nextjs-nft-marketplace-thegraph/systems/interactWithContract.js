import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

function readFromContract(address, abi, functionName, args, enabled) {
  const { data, isError, isLoading } = useContractRead({
    addressOrName: address,
    contractInterface: abi,
    functionName,
    args,
    enabled,
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
  enabled,
) {
  const { config, status, error, refetch } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: contractAbi,
    functionName,
    args,
    enabled,
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

export { readFromContract, writeToContract };
