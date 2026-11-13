'use client';

import { useState, useEffect } from "react";

export default function Home() {

  // 1. Définition des trois états
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Appel à notre propre route API lors du chargement de la page
  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/articles');

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();
        setArticles(data);
      } catch(err) {
        setError(err.message);
      } finally {
        // Terminer le chargement 
        setLoading(false);
      }
    }

    fetchArticles();
  }, [  ]); //Tableau vide pour l'exécution en une seule fois à l'ouverture de la page

  // 3. Affichage conditionnelle (du chargement ou de l'erreur)
  if(loading) {
    return <p style={{padding: '2rem'}}>Chargement de la veille tech...</p>;
  }

  if (error) {
    return <p style={{padding: '2rem', color:'red'}}>Erreur: {error}</p>;
  }

  // 4. Affichage de la liste des articles
  return (
    <main style={{maxWidth: '800px', margin:'0 auto', padding:'2rem', fontFamily:'sans-serif'}}>
      <h1>Ma veille Tech</h1>

      {articles.length === 0 ? (
        <p>Aucun article trouvé pour le moment.</p>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:'1rem', marginTop:'1.5rem'}}>
          {articles.map((article) => (
            <article 
            key = {article.id}
            style = {{border: '1px solid #ddd', padding:'1rem', borderRadius:'8px'}}
            >
              <h2>
                <a href={article.url} target="_blank" rel = "noopener noreferrer">
                  {article.title}
                </a>
              </h2>
              <p style={{color: '#666', fontSize:'0.9rem'}}>
                Par {article.user.name} • Publié le {new Date(article.published_at).toLocaleDateString('fr-FR')}
              </p>
              <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem'}}>
                {article.tag_list.map((tag) => (
                  <span key={tag} style={{background:'#f0f0f0', color:'black', padding:'0.2rem 0.5rem', borderRadius:'4px', fontSize:'0.8rem'}}>
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div> 
      )}
    </main>
  );
}