const token = "TokenUserZeta1234"
const postgres_url = "https://api-postgresql-zeta-fide.onrender.com"

async function listAllPrograms() {
    try {
      const res = await fetch(`${postgres_url}/api/programs/list-all`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    
      if (!res.ok) {
        throw new Error("Erro na requisição: " + res.status);
      }
        
      const data = await res.json();
      
      console.log(`Lista de programs: `, data)
      
      return data;
    } catch (err) {
      console.error("Erro ao buscar programs: ", err);
      throw err;
    }
  }
  

export default {
    listAllPrograms
};