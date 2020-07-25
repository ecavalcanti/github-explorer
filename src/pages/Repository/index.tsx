import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Header, RepositoryInfo, Issues } from './styles';

interface RepositoryDetails {
  full_name: string; // eslint-disable-line camelcase
  description: string;
  stargazers_count: number; // eslint-disable-line camelcase
  forks_count: number; // eslint-disable-line camelcase
  open_issues_count: number; // eslint-disable-line camelcase
  owner: {
    login: string;
    avatar_url: string; // eslint-disable-line camelcase
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string; // eslint-disable-line camelcase
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const [
    repositoryDetails,
    setRepositoryDetails,
  ] = useState<RepositoryDetails | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const { repository } = useParams();

  useEffect(() => {
    api.get<RepositoryDetails>(`repos/${repository}`).then(response => {
      setRepositoryDetails(response.data);
    });

    api.get<Issue[]>(`repos/${repository}/issues`).then(response => {
      setIssues(response.data);
    });
  }, [repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>

      {repositoryDetails && (
        <RepositoryInfo>
          <header>
            <img
              src={repositoryDetails.owner.avatar_url} // eslint-disable-line camelcase
              alt={repositoryDetails.owner.login}
            />
            <div>
              <strong>{repositoryDetails.full_name}</strong>
              <p>{repositoryDetails.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repositoryDetails.stargazers_count}</strong>
              <span>Stars</span>
            </li>
            <li>
              <strong>{repositoryDetails.forks_count}</strong>
              <span>Forks</span>
            </li>
            <li>
              <strong>{repositoryDetails.open_issues_count}</strong>
              <span>Issues</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}
      <Issues>
        {issues.map(issue => (
          <a href={issue.html_url} key={issue.id}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
