import { NextResponse } from "next/server";

// Fonction à réaliser lors de l'appel de GET /api/articles
export async function GET() {
   try{
      // Aller chercher une liste d'articles sur l'API externe
      const username = "le_maonluc_76311b2c3c1e9";
      const response = await fetch(`https://dev.to/api/articles?username=${username}`);
      if (!response.ok) {
         throw new Error(`Erreur HTTP: ${response.status}`);
      }
   const articles = await response.json();
   return NextResponse.json(articles);

   } catch (error) {
      
      console.error("Détail de l'ereur dans le terminal: ", error);
      // Retourner une erreur le cas échéant
      return NextResponse.json(
         {error: "Impossible de récupérer les articles"},
         {status:500}
      );
   }
}