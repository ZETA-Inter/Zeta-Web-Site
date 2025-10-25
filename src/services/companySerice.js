const token = "TokenUserZeta1234"
const postgres_url = "https://api-postgresql-zeta-fide.onrender.com"

async function assignGoal(goalId, workerIds) {
    try {
        const res = await fetch(`${postgres_url}/api/companies/assign-goal/${goalId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(workerIds)
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Erro na requisição: ${res.status} — ${errText}`);
        }

        const message = await res.text();

        console.log("Meta atribuída com sucesso:", message);
        return message;

    } catch (err) {
        console.error("Erro ao atribuir meta:", err.message);
    }
}

export default {
    assignGoal
}