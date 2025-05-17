import { useState, useEffect } from 'react';
import axios from 'axios';

const BrowseMagazines = () => {
  const [magazines, setMagazines] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const res = await axios.get('http://localhost:5000/magazines', {
          params: { category },
        });
        setMagazines(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMagazines();
  }, [category]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Browse Magazines</h1>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border rounded mb-4"
      >
        <option value="">All Categories</option>
        <option value="Fiction">Fiction</option>
        <option value="Science">Science</option>
        <option value="Art">Art</option>
      </select>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {magazines.map((magazine) => (
          <div key={magazine._id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">{magazine.title}</h2>
            <p className="text-gray-600">{magazine.description}</p>
            <p className="text-sm text-blue-500">{magazine.categories.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseMagazines;