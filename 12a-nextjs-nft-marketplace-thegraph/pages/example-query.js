import GET_ACTIVE_ITEMS from '../constants/subgraphQueries';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';

// const clientGoerli = createClient({
//   url: process.env.NEXT_PUBLIC_SUBGRAPH_URL_GOERLI,
// });

export default function exampleQuery() {
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <div>
      {data.activeItems.map((item) => {
        const interval = setInterval(() => {
          console.log(data);
        }, 3000);
        return (
          <div key={item.tokenId}>
            <p>{item.tokenId}</p>
          </div>
        );
      })}
    </div>
  );
}
