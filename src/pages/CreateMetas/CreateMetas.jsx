import styles from "./CreateMetas.module.css"
import React, { useState, useMemo } from 'react';
import WorkerCard from '../../components/CardProdutor/CardProdutor';
import GoalService from '../../services/goalService';
import CompanySerice from '../../services/companySerice';

const getInitialData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultValue;
};


function CreateMetas() {

    const companyId = localStorage.getItem("companyID") || 1;

    const [availableWorkers] = useState(() => getInitialData("workers", []));

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedWorkerIds, setSelectedWorkerIds] = useState([]);
    const [selectAllWorkers, setSelectAllWorkers] = useState(false);

    const [workerSearchText, setWorkerSearchText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredWorkers = useMemo(() => {
        if (!workerSearchText) {
            return availableWorkers;
        }
        const lowerCaseSearch = workerSearchText.toLowerCase();
        return availableWorkers.filter(worker => 
            (worker.name && worker.name.toLowerCase().includes(lowerCaseSearch)) ||
            (worker.segment && worker.segment.toLowerCase().includes(lowerCaseSearch))
        );
    }, [workerSearchText, availableWorkers]);

    const handleWorkerToggle = (workerId) => {
        setSelectedWorkerIds(prevIds => 
            prevIds.includes(workerId)
                ? prevIds.filter(id => id !== workerId)
                : [...prevIds, workerId]
        );
        setSelectAllWorkers(false);
    };

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setSelectAllWorkers(isChecked);
        
        if (isChecked) {
            const allIds = availableWorkers.map(w => w.id);
            setSelectedWorkerIds(allIds);
        } else {
            setSelectedWorkerIds([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !description.trim()) {
            alert("Por favor, preencha o Nome e a Descrição da meta.");
            return;
        }

        if (selectedWorkerIds.length === 0) {
             alert("Por favor, selecione pelo menos um produtor para vincular à meta.");
             return;
        }
        
        setIsSubmitting(true);
        
        const newGoalData = {
            description: description,
            company_id: companyId
        };
        
        try {
            const response = await GoalService.createGoal(newGoalData);

            if (response) {

                const newGoalId = response.id;

                const goalToSave = { 
                    ...newGoalData, 
                    id: newGoalId
                };

                const existingGoals = JSON.parse(localStorage.getItem("goals") || "[]");
                const updatedGoals = [...existingGoals, goalToSave];
            
                localStorage.setItem("goals", JSON.stringify(updatedGoals));

                window.dispatchEvent(new Event("storageUpdate"));
            
                console.log(`Atribuindo Meta ID ${newGoalId} aos produtores:`, selectedWorkerIds);

                await CompanySerice.assignGoal(newGoalId, selectedWorkerIds);

                alert(`Meta "${title}" criada com sucesso e vinculada a ${selectedWorkerIds.length} produtores!`);
            } else {
                console.warn("Meta não foi criado, algo aconteceu na requisição.");
            }
            
        } catch (error) {
            console.error("Erro ao cadastrar meta:", error);
            alert("Erro ao cadastrar meta. Tente novamente.");
        } finally {
            setTitle('');
            setDescription('');
            setSelectedWorkerIds([]);
            setSelectAllWorkers(false);
            setIsSubmitting(false);
        }
    };

    if (availableWorkers.length === 0) {
        
        return (
            <main className={styles.CreateMetasPage}>
                <h1 className={styles.PageTitle}>Metas - Inserir nova meta</h1>
                <p>Nenhum produtor encontrado no cache local. Por favor, verifique a tela de Produtores.</p>
            </main>
        );
    }

    return (
        <main className={styles.CreateMetasPage}>
            
            <h1 className={styles.PageTitle}>Metas - Inserir nova meta</h1>
            
            <form className={styles.ContentWrapper} onSubmit={handleSubmit}>

                <div className={styles.FormArea}>
                    
                    <label className={styles.Label} htmlFor="meta-name">Nome</label>
                    <input 
                        id="meta-name"
                        type="text" 
                        placeholder="Digite o nome da meta..."
                        className={styles.TextInput}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                    />

                    <label className={styles.Label} htmlFor="meta-description">Descrição</label>
                    <textarea 
                        id="meta-description"
                        placeholder="Digite a descrição..."
                        className={styles.TextArea}
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSubmitting}
                    />
                    
                    <div className={styles.ButtonRow}>
                         <button type="button" className={styles.PlaceholderButton}>Adicionar produtor</button>
                         <button type="button" className={styles.PlaceholderButton}>Adicionar produtor</button>
                    </div>
                </div>

                <div className={styles.SidebarSticky}>
                    <h2 className={styles.SidebarTitle}>Selecionar produtores a meta</h2>
                    
                    <div className={styles.SearchBar}>
                        <input 
                            type="text" 
                            placeholder="Buscar..."
                            value={workerSearchText}
                            onChange={(e) => setWorkerSearchText(e.target.value)}
                        />
                        <button type="button" className={styles.SearchButton}>🔍</button>
                    </div>
                    
                    <div className={styles.SelectAllBox}>
                        <label>
                            <input 
                                type="checkbox"
                                checked={selectAllWorkers}
                                onChange={handleSelectAll}
                            />
                            Aplicar a todos os produtores
                        </label>
                    </div>

                    <div className={styles.WorkerSelectionList}>
                        {filteredWorkers.map(worker => (
                            <div key={worker.id} className={styles.WorkerSelectionItem}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedWorkerIds.includes(worker.id)}
                                    onChange={() => handleWorkerToggle(worker.id)}
                                />
                                <WorkerCard 
                                    nome={worker.name}
                                    segmento={worker.segment || (worker.segments ? worker.segments.join(', ') : 'N/A')}
                                    foto={worker.image_url}
                                    active={worker.active}
                                    onClick={(e) => e.preventDefault()} 
                                />
                            </div>
                        ))}
                        {filteredWorkers.length === 0 && <p>Nenhum produtor encontrado.</p>}
                    </div>
                    

                    <button 
                        type="submit" 
                        className={styles.SaveButton}
                        disabled={isSubmitting || selectedWorkerIds.length === 0}
                    >
                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar Meta'}
                    </button>
                </div>
            </form>
        </main>
    );
}

export default CreateMetas;