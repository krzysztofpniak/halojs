import React from 'react';
import {map} from 'ramda';
import {Routes, safeHref} from '../../data/routes';
import {Link} from '../../halo/halo';

const ArticlePreview = ({article}) => (
  <div className="article-preview">
    <div className="article-meta">
      <a></a>
      <div className="info">
        <a className="author" href="#">
          {article.author.username}
        </a>
      </div>
      <div className="pull-xs-right"></div>
    </div>
    <Link
      className="preview-link"
      href={safeHref(Routes.ViewArticle(article.slug))}
    >
      <h1>{article.title}</h1>
      <p>{article.description}</p>
      <span>Read more...</span>
      <ul className="tag-list">
        {map(
          t => (
            <li key={t} className="tag-default tag-pill tag-outline">
              {t}
            </li>
          ),
          article.tagList
        )}
      </ul>
    </Link>
  </div>
);

const ArticleList = ({articles}) =>
  articles.cata({
    NotAsked: () => 'Articles not yet loaded',
    Loading: () => 'Loading...',
    Failure: () => 'x',
    Success: ({content, total}) => (
      <div>
        {map(
          a => (
            <ArticlePreview key={a.slug} article={a} />
          ),
          content
        )}
      </div>
    ),
  });

export default ArticleList;
