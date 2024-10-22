import React, { useState } from 'react';

const SearchBar = ({ onSearch, onStatusChange }) => {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('All');

    const handleSearch = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        onStatusChange(e.target.value); // Truyền trạng thái mới lên component cha
    };

    return (
        <div className="mb-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <input
                type="text"
                placeholder="Search orders..."
                value={query}
                onChange={handleSearch}
                style={{ width: '50%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '10px' }}
            />
            <select value={status} onChange={handleStatusChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option value="All">All</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
            </select>
        </div>
    );
};

export default SearchBar;
