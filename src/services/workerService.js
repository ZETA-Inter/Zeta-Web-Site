const token = "TokenUserZeta1234"
const postgres_url = "https://api-postgresql-zeta-fide.onrender.com"

async function listWorkersByCompany(companyId) {
  try {
    const res = await fetch(`${postgres_url}/api/workers/list-by-companyId/${companyId}`, {
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
    
    console.log(`Lista de produtores do fornecedor ${companyId}: `, data)
    
    return data;
  } catch (err) {
    console.error("Erro ao buscar produtores: ", err);
    throw err;
  }
}

async function getWorkerById(workerId) {
   try {
    const res = await fetch(`${postgres_url}/api/workers/find-by-id/${workerId}`, {
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
    
    console.log(`Produtor com ID=${workerId}: `, data)
    
    return data;
  } catch (err) {
    console.error("Erro ao buscar produtor: ", err);
    throw err;
  }
}

async function inactiveWorker(workerId) {
  try {
    const res = await fetch(`${postgres_url}/api/workers/inactive/${workerId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  
    if (!res.ok) {
      throw new Error("Erro na requisição: " + res.status);
    }
      
    const message = await res.text();

    console.log(message)
    
    return message;
  } catch (err) {
    console.error("Erro ao inativar um produtor: ", err);
    throw err;
  }
}

async function createWorker(worker) {
  try {
    // const token = localStorage.getItem('authToken'); 
    
    // if (!token) {
    //     throw new Error("Token de autorização não encontrado.");
    // }

    const res = await fetch(`${postgres_url}/api/workers/create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`, 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(worker)
    });

    if (!res.ok) {
      throw new Error("Erro na requsição: " + res.status);
    }

    const data = await res.json();
    console.log("Produtor criado com sucesso: ", data);
    
    return data;

  } catch (err) {
      console.error("Erro ao criar trabalhador: ", err.message);
      
      return null;
    }
}

async function updateWorker(workerId, worker) {
  try {
      const res = await fetch(`${postgres_url}/api/workers/update/${workerId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(worker)
      })

      if (!res.ok) {
        throw new Error("Erro na requisição: " + res.status)
      }

      const message = await res.text();

      console.log(message)

      return message
  } catch (err) {
    console.error(`Erro ao atualizar o produtor ${workerId}: `, err, err.message)
  }
}

async function ListGoalsByWorker(workerId) {
  try {
    const res = await fetch(`${postgres_url}/api/goals/list-goals-by-workerId/${workerId}`, {
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
    console.log(`Lista de metas do produtor ${workerId}: `, data)
    return data;
  } catch (err) {
    console.error("Erro ao buscar metas do produtor: ", err);
    throw err;
  }
}

export default {
  getWorkerById,
  listWorkersByCompany,
  inactiveWorker,
  createWorker,
  updateWorker,
  ListGoalsByWorker
};