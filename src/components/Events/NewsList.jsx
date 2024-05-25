import React from 'react';

const NewsList = ({ news }) => {
  return (
    <div>
      {news.map((article) => (
        <div className='dark:text-white' key={article.id}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
