import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface IData  {
    name: string;
    result: {
        "numberOfViolations": number,
        "numberOfIncomplete": number
    }

}

function byViolations({ result: resultA}:IData, { result: resultB}:IData){
    return (resultA.numberOfViolations + resultA.numberOfIncomplete) - (resultB.numberOfViolations + resultB.numberOfIncomplete)
}

export default function Index() {
  const { data, error } = useSWR<string>('/api/staticdata', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const result:IData[] = JSON.parse(data)

  return (
      <table cellSpacing="0">
          <tr>
              <th>Bank</th>
              <th>Antal fel</th>
          </tr>
          {result.sort(byViolations).map(({ name, result:{numberOfViolations, numberOfIncomplete}}) => (
              <tr key={name} style={
                  { background: `linear-gradient(90deg, hsl(205.45deg 100% 22.35%) 1%, hsl(205.45deg 100% 32.35%) 1%)"`}
              }>
                  <td>{name}</td>
                  <td>{numberOfViolations + numberOfIncomplete}</td>
              </tr>
          ))}

      </table>
  );
}