import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2>Unauthorized</h2>
      <p>شما دسترسی لازم را ندارید.</p>
      <p>
        <Link to="/">بازگشت به ورود</Link>
      </p>
    </div>
  );
};

export default Unauthorized;
