'use client';

import { useState, useEffect } from "react";

interface Article {
  id: number;
  title: string;
  url: string;
  published_at: string;
  tag_list: string[];
  user: {
    name:string;
  };
}

export default function Home() {

  // 1. Définition des trois états
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

    //Nouveaux états pour la recherche de filtre
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 2. Appel à notre propre route API lors du chargement de la page
  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/articles');

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const data: Article[] = await response.json();
        setArticles(data);
      } catch(err) {
        if(err instanceof Error) {
                  setError(err.message);
        } else {
          setError('Une erreur inconnue est survenue');
        }
      } finally {
        // Terminer le chargement 
        setLoading(false);
      }
    }

    fetchArticles();
  }, [  ]); //Tableau vide pour l'exécution en une seule fois à l'ouverture de la page

  // Extraction dynamique des tags uniques présents dans les articles récupérés
  const allTags = Array.from(new Set(articles.flatMap((article) => article.tag_list))).slice(0,8); 
  
  // Calcul de la liste filtrée (recherche texte + tag sélectionné
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? article.tag_list.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

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

      {/* Zone de la recherche et de filtre*/}
      <div style={{marginTop:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem'}}>
        <input 
          type="text"
          placeholder="Rechercher un article par mot-clé..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '0.75rem',
            fontSize:'1rem',
            borderRadius:'8px',
            border:'1px, solid #ccc',
            width:'100%'
          }} 
        />

        {/* Boutons de tags */}
        <div 
          style={{
            display:'flex',
            flexWrap:'wrap',
            gap:'0.5rem'
          }}
        >
          <button
            onClick={() => setSelectedTag(null)}
            style={{
              padding:'0.4rem 0.8rem',
              borderRadius:'20px',
              border:'1px solid #333',
              background: selectedTag === null ? '#333' : '#fff',
              color: selectedTag === null ? '#fff' : '#333',
              cursor: "pointer"
            }}
          >
            Tous ({articles.length})
          </button>

          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              style = {{
              padding:'0.4rem 0.8rem',
              borderRadius:'20px',
              border:'1px solid #ccc',
              background: selectedTag === tag ? '#0070f3' : '#f5f5f5',
              color: selectedTag === tag ? '#fff' : '#333',
              cursor: "pointer"
              }}
            >
              #{tag}
            </button>
          ))}
        </div>  
      </div>

      {/* Affichage des résultats filtrés */} 
      {filteredArticles.length === 0 ? (
        <p style= {{
          marginTop:'2rem',
          color:'#666',
          }}
        >
          Aucun article ne correspond à ta recherche.
        </p>
      ) : (
        <div style = {{
          display:'flex',
          flexDirection:'column',
          gap:'1rem',
          marginTop:'1.5rem'
          }}
        >
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              style={{
                border:'1px solid #ddd',
                padding:'1rem',
                borderRadius:'8px',
              }}
            >
              <h2>
                <a 
                  href={article.url} 
                  target='_blank'
                  rel="noopener noreferrer"
                >
                  {article.title}
                </a>
              </h2>
              <p
                style = {{
                color:'#666',
                fontSize:'0.9rem',
                }}
              >
                Par {article.user.name} • Publié le {' '}
                {new Date(article.published_at).toLocaleDateString('fr-Fr')}  
              </p>
              <div
                style={{
                  display:'flex',
                  gap:"0.5rem",
                  marginTop:'0.5rem',
                }}
              >
                {article.tag_list.map((tag) => (
                  <span
                    key = {tag}
                    style = {{
                      background:'#f0f0f0',
                      color:'#333',
                      padding:'0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                    }}
                  >
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