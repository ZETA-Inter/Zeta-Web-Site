const token = "TokenUserZeta1234"
const postgres_url = "https://api-postgresql-zeta-fide.onrender.com"

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
        const errorText = await res.text(); 
        throw new Error(`Erro na requsição: ${res.status}, corpo: ${errorText}`);      
      }

      const data = await res.json();

      console.log("Meta criada com sucesso: ", data)

      return data
  } catch (err) {
    console.error("Erro ao criar meta: ", err, err.message)
  }
}

async function updateGoal(goalId, goal) {
  try {
      const res = await fetch(`${postgres_url}/api/goals/update/${goalId}`, {
        method: "PATCH",
        headers: {
          "Authorization":  `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(goal)
      })

      if (!res.ok) {
        throw new Error("Erro na requsição: " + res.status + ", corpo: " + res.body);
      }

      const message = await res.text();

      console.log("Meta atualizada com sucesso: ", message)

      return message
  } catch (err) {
    console.error("Erro ao atualizar meta: ", err, err.message)
  }
}

async function deleteGoal(goalId) {
  try {
    const res = await fetch(`${postgres_url}/api/goals/delete/${goalId}`, {
      method: "DELETE",
      headers: {
        "Authorization":  `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error("Erro na requsição: " + res.status + ", corpo: " + res.body);
    }

    const message = await res.text();

    console.log("Meta deletada com sucesso: ", message)

  } catch (err) {
    console.error("Erro ao deletar meta: ", err, err.message)
  }
}

async function deleteWorkerGoals(goalId, workerIds) {
  try {
    const res = await fetch(`${postgres_url}/api/worker-goals/delete-workers-goal-by-goalId/${goalId}`, {
      method: "DELETE",
      headers: {
        "Authorization":  `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(workerIds)
    })

    if (!res.ok) {
      const errorBody = await res.text(); 
      throw new Error(`Erro na requisição: ${res.status}, corpo: ${errorBody}`);
  }

    const message = await res.text();

    console.log(`Ids de produtores ${workerIds} da Meta com Id ${goalId} deletada com sucesso: `, message);
    return message;

  } catch (err) {
    console.error("Erro ao deletar produtores da meta: ", err, err.message);
    throw err;
  }
}

export default {
  listGoalsByCompanyId,
  listWorkerIdsByGoalId,
  updateGoal,
  createGoal,
  deleteGoal,
  deleteWorkerGoals
};