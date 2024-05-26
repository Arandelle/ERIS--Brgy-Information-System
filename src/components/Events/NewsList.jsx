import React from "react";

const NewsList = ({ news }) => {
  return (
    <div className="bg-gray-100 h-screen rounded">
      <div class="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
       Today's Activities
      </div>
      {news.map((article) => (
        <div className="dark:text-white" key={article.id}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
