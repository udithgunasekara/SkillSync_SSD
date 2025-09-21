import React, { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

const SearchSection: React.FC<Props> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    // Regular expression to match only alphabetical letters
    const regex = /^[A-Za-z\s]*$/;
    if (regex.test(input)) {
      setSearchQuery(input);
    }
  };

  return (
    <section className="containerx" style={{ margin: '30px' }}>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSearch}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search gigs using gig title or gig category..."
                value={searchQuery}
                onChange={handleInputChange}
              />
              <div className="input-group-append">
                <button className="btn btn-primary" type="submit">Search</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
