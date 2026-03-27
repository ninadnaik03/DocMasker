export default function ResultCard({ data }) {
  return (
    <div className="card">
      <p>Vendor: {data.vendor}</p>
      <p>Amount: {data.amount}</p>
      <p>Date: {data.date}</p>
    </div>
  );
}
