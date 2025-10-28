import styles from "./CreateMetas.module.css"
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkerCard from '../../components/CardProdutor/CardProdutor';
import GoalService from '../../services/goalService';
import CompanySerice from '../../services/companySerice';
import ProgramService from '../../services/programService';

const getInitialData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultValue;
};

function CreateMetas() {

    const { goalId } = useParams();
    const navigate = useNavigate();
 
    const isEditing = Boolean(goalId);

    const companyId = localStorage.getItem("companyID") || 1;

    const [availableWorkers] = useState(() => getInitialData("workers", []));

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [originalWorkerIds, setOriginalWorkerIds] = useState([]);
    const [selectedWorkerIds, setSelectedWorkerIds] = useState([]);
    const [selectAllWorkers, setSelectAllWorkers] = useState(false);
    const [selectedProgramId, setSelectedProgramId] = useState('');
    const [programs, setPrograms] = useState([]);

    const [workerSearchText, setWorkerSearchText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {

        const loadPrograms = async () => {
            const cachedPrograms = localStorage.getItem("programs");
            if (cachedPrograms) {
                setPrograms(JSON.parse(cachedPrograms));
            } else {
                try {
                    const allPrograms = await ProgramService.listAllPrograms(); 
                    if (allPrograms) {
                        setPrograms(allPrograms);
                        localStorage.setItem("programs", JSON.stringify(allPrograms));
                    }
                } catch (error) {
                    console.error("Erro ao carregar programas/cursos:", error);
                }
            }
        };

        const loadGoalData = async () => {
            if (!isEditing) return;

            try {
                const existingGoals = JSON.parse(localStorage.getItem("goals") || "[]");
                const goalToEdit = existingGoals.find(g => String(g.id) === goalId);
                
                if (!goalToEdit) {
                    alert("Meta não encontrada. Redirecionando.");
                    navigate('/metas');
                    return;
                }

                setTitle(goalToEdit.name);
                setDescription(goalToEdit.description);
                setSelectedProgramId(goalToEdit.program_id ? String(goalToEdit.program_id) : '');
                
                const assignedIds = await GoalService.listWorkerIdsByGoalId(goalId);

                setOriginalWorkerIds(assignedIds);
                
                setSelectedWorkerIds(assignedIds); 

                if (assignedIds.length > 0 && assignedIds.length === availableWorkers.length) {
                    setSelectAllWorkers(true);
                }

            } catch (error) {
                console.error("Erro ao carregar dados da meta:", error);
                alert("Não foi possível carregar os detalhes da meta para edição.");
                navigate('/metas');
            }
        };

        loadPrograms();
        loadGoalData();
    }, [goalId, isEditing, availableWorkers, navigate]);

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
        
        const goalData = {
            name: title,
            description: description,
            program_id: Number(selectedProgramId),
            company_id: companyId
        };
        
        try {
            let response = null;
            let finalGoalId = goalId;
            let successMessage = "";
            let metaUpdatedSuccessfully = false;

            if (isEditing) {
                // ATUALIZAR
                response = await GoalService.updateGoal(goalId, goalData);
                finalGoalId = goalId;
                successMessage = `Meta "${title}" atualizada com sucesso!`;
                metaUpdatedSuccessfully = true

                const originalSet = new Set(originalWorkerIds);
                const selectedSet = new Set(selectedWorkerIds);

                const idsToRemove = originalWorkerIds.filter(id => !selectedSet.has(id));
                const idsToAdd = selectedWorkerIds.filter(id => !originalSet.has(id));

                if (idsToRemove.length > 0) {
                    console.log(`Removendo associações para Goal ${goalId} e Workers:`, idsToRemove);
                    await GoalService.deleteWorkerGoals(goalId, idsToRemove); 
                }

                if (idsToAdd.length > 0) {
                    console.log(`Adicionando associações para Goal ${goalId} e Workers:`, idsToAdd);
                    await CompanySerice.assignGoal(goalId, idsToAdd);
                }

                const changes = [];
                if (idsToAdd.length > 0) changes.push(`${idsToAdd.length} adicionado(s)`);
                if (idsToRemove.length > 0) changes.push(`${idsToRemove.length} removido(s)`);
                
                if (changes.length > 0) {
                    successMessage += ` Produtores: ${changes.join(' e ')}.`;
                } else {
                    successMessage += ` Nenhuma alteração nos produtores.`;
                }

            } else {
                // CRIAR
                response = await GoalService.createGoal(goalData);
                finalGoalId = response.id;
                successMessage = `Meta "${title}" criada com sucesso!`;
                metaUpdatedSuccessfully = true

                console.log(`Atribuindo Meta ID ${finalGoalId} aos produtores:`, selectedWorkerIds);
                await CompanySerice.assignGoal(finalGoalId, selectedWorkerIds); 
                
                successMessage += ` E vinculada a ${selectedWorkerIds.length} produtores.`;
            }
            
            if (response || metaUpdatedSuccessfully) {

                const existingGoals = JSON.parse(localStorage.getItem("goals") || "[]");
                if (isEditing) {
                    const updatedGoals = existingGoals.map(g => 
                        String(g.id) === goalId ? { ...goalData, id: finalGoalId } : g
                    );
                    localStorage.setItem("goals", JSON.stringify(updatedGoals));
                } else {
                    const goalToSave = { ...goalData, id: finalGoalId };
                    localStorage.setItem("goals", JSON.stringify([...existingGoals, goalToSave]));
                }
            
                window.dispatchEvent(new Event("storageUpdate"));

                alert(successMessage);
                
                navigate('/metas');

            } else {
                console.warn(`A Meta ${isEditing ? 'não foi atualizada' : 'não foi criada'}, algo aconteceu na requisição.`);
                alert(`Falha na comunicação. Tente novamente.`);
            }
            
        } catch (error) {
            console.error(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} meta:`, error);
            alert(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} meta. Tente novamente.`);
        } finally {
            if (!isEditing) {
                setTitle('');
                setDescription('');
                setSelectedProgramId('');
                setSelectedWorkerIds([]);
                setSelectAllWorkers(false);
            }
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
            
            <h1 className={styles.PageTitle}>
                Metas - {isEditing ? 'Editar Meta' : 'Inserir nova meta'} 
            </h1>

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

                    <label className={styles.Label} htmlFor="meta-program">Curso (Programa)</label>
                    <select
                        id="meta-program"
                        className={styles.TextInput}
                        value={selectedProgramId}
                        onChange={(e) => setSelectedProgramId(e.target.value)}
                        disabled={isSubmitting || programs.length === 0}
                    >
                        <option value="">Selecione um curso...</option>
                        {programs.map(program => (
                            <option key={program.id} value={program.id}> 
                                {program.name || program.title} 
                            </option>
                        ))}
                    </select>

                    <button 
                        type="submit" 
                        className={styles.SaveButton}
                        disabled={isSubmitting || selectedWorkerIds.length === 0}
                    >
                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar Meta'}
                    </button>
                    
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
                </div>
            </form>
        </main>
    );
}

export default CreateMetas;