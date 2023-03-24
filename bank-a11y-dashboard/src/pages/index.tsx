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
      <div>
        <h1>Antal fel per banks startsida</h1>
        <ol>
          {result.sort(byViolations).map(({ name, result:{numberOfViolations, numberOfIncomplete}}) => (
            <li key={name}>
                <strong>{name}</strong>: {numberOfViolations + numberOfIncomplete}
            </li>
          ))}
        </ol>
      </div>
  );
}