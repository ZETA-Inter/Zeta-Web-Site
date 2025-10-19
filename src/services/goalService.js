const token = "TokenUserZeta1234"
const postgres_url = "http://localhost:8080"

async function listGoalsByCompanyId(companyId) {
  try {
    const res = await fetch(`${postgres_url}/api/goals/list-goals-by-company?companyId=${companyId}`, {
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
    
    console.log(`Lista de metas do fornecedor ${companyId}: `, data)
    
    return data;
  } catch (err) {
    console.error("Erro ao buscar produtores: ", err);
    throw err;
  }
}

async function listWorkerIdsByGoalId(goalId) {
  try {
    const res = await fetch(`${postgres_url}/api/worker-goals/list-worker-ids-by-goalId/${goalId}`, {
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
  
    console.log(`Lista de worker Ids da meta ${goalId}: `, data)
  
    return data;
    } catch (err) {
        console.error("Erro ao buscar produtores: ", err);
        throw err;
    }
}

async function createGoal(goal) {
  try {
      const res = await fetch(`${postgres_url}/api/goals/create`, {
        method: "POST",
        headers: {
          "Authorization":  `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(goal)
      })

      if (!res.ok) {
        throw new Error("Erro na requsição: " + res.status);
      }

      const data = await res.json();

      console.log("Meta criada com sucesso: ", data)

      return data
  } catch (err) {
    console.error("Erro ao criar meta: ", err, err.message)
  }
}

export default {
  listGoalsByCompanyId,
  listWorkerIdsByGoalId,
  createGoal
};