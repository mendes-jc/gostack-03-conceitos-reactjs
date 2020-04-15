import React, { useState, useEffect } from "react";

import api from './services/api';

import "./styles.css";

const initialRepo = {
  title: '',
  url: '',
  techs: '',
}

function App() {
  const [repositories, setRepositories] = useState([]);
  const [newRepo, setNewRepo] = useState(initialRepo);

  useEffect(() => {
    async function fetchRepositories() {
      const { data } = await api.get('/repositories');
      setRepositories(data);
    }
    fetchRepositories();
  }, []);

  async function handleAddRepository() {
    const { title, url, techs } = newRepo;
    const { data } = await api.post('/repositories', {
      title,
      url,
      techs: techs.split(';')
    })
    setRepositories([...repositories, data]);
    setNewRepo(initialRepo);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);
    
    setRepositories(repositories.filter(repo => repo.id !== id));
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => 
          <div key={repository.id}> 
            <li>
              {repository.title}
              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>
          </div>
        )}
      </ul>
      Title
      <input
        value={newRepo.title}
        onChange={event => setNewRepo({...newRepo, title: event.target.value })}
      /><br/>
      URL
      <input
        value={newRepo.url}
        onChange={event => setNewRepo({...newRepo, url: event.target.value })}
      /><br/>
      Techs (separated by ';')
      <input
        value={newRepo.techs}
        onChange={event => setNewRepo({...newRepo, techs: event.target.value})}
      /><br/>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
