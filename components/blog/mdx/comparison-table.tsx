export function ComparisonTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse border border-[oklch(1_0_0/8%)] rounded-xl overflow-hidden text-sm">
        <thead>
          <tr className="bg-[oklch(1_0_0/3%)]">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left font-semibold text-xs uppercase tracking-wider text-[oklch(0.65_0_0)] px-4 py-3 border-b border-[oklch(1_0_0/8%)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[oklch(1_0_0/5%)] last:border-b-0 hover:bg-[oklch(1_0_0/2%)] transition-colors"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-[oklch(0.85_0_0)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
