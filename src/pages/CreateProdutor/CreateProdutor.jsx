import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import workerService from '../../services/workerService';
import styles from './CreateProdutor.module.css';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../../firebaseConfig";

const getInitialData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultValue;
};

function CreateProdutor() {
    const { workerid } = useParams();
    const navigate = useNavigate(); 

    const isEditing = Boolean(workerid);

    const [nome, setNome] = useState(getInitialData('produtor_nome', ''));
    const [email, setEmail] = useState(getInitialData('produtor_email', ''));
    const [cpf, setCpf] = useState(getInitialData('produtor_cpf', ''));
    const [active, setActive] = useState(true);
    const [imgUrl, setImgUrl] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }
        try {

            const planId = localStorage.getItem('planId');
            const companyId = localStorage.getItem('companyId');
             
            if(planId === null) {
                alert("ID do plano não encontrado. Por favor, verifique o login da empresa.");
                return;
            }

            const Worker = {
                name: nome,
                email: email,
                image_url: imgUrl, 
                company_id: Number(companyId),
                plan_info: {
                    id: Number(planId),
                    frequency: "default_frequency", 
                    amount: 0.0
                }
            };

            if (isEditing) {
                Worker.id = workerid;
                const updatedWorker = await workerService.updateWorker(Worker);
                if (updatedWorker) {
                    alert(`Produtor ${updatedWorker.name} atualizado com sucesso!`);
                    localStorage.removeItem('produtor_nome');
                    localStorage.removeItem('produtor_email');
                    localStorage.removeItem('produtor_cpf');
                    navigate(`/produtores`);
                    return;
                }
                else {
                    alert("Erro ao atualizar produtor. Por favor, tente novamente.");
                    return;
                }
            }
            else {
                const createdWorker = await workerService.createWorker(Worker);

                if (createdWorker) { 
                    alert(`Produtor ${createdWorker.name} criado com sucesso!`); 
                    localStorage.removeItem('produtor_nome');
                    localStorage.removeItem('produtor_email');
                    localStorage.removeItem('produtor_cpf');

                    navigate(`/produtores`);
                } else {
                    alert("Erro ao criar produtor. Verifique se o email ou CPF já estão cadastrados.");
                }
            }

        } catch (error) {
            console.error("Erro ao criar produtor: ", error);
            alert("Erro ao criar produtor. Por favor, tente novamente.");
        }


        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        
        const userData = {
            uid: user.uid,
            nome: nome,
            email: email,
            cpf: cpf,
            telefone: telefone
        };

        await db.collection('Produtor').doc(user.uid).set(userData);

        alert(`Usuário ${nome} criado com sucesso!`);


    };

    const handleCancel = () => {
        setNome('');
        setEmail('');
        setCpf('');
        setImgUrl('');
        setSenha('');
        setConfirmarSenha('');
        navigate(-1); 
    };

    return (
        <main className={styles.mainContent}>
            <header>
                <h1>Produtores - inserir novo usuário</h1>
                <p>
                    Bem vindo a tela de criação de produtor! Informe seus dados e crie a conta do seu filiado. O seu segmento só será definido quando for vinculado a um curso a ele. Atenção: poderá ser redefinida quando o produtor acessar a conta.
                </p>
            </header>

            <form className={styles.createUserForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="nome">Nome</label>
                    <input 
                        type="text" 
                        id="nome" 
                        placeholder="Digite seu nome..."
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="Digite seu email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="telefone">Telefone</label>
                    <input 
                        type="text" 
                        id="telefone" 
                        placeholder="Digite seu telefone..."
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="cpf">CPF</label>
                    <input 
                        type="text" 
                        id="cpf" 
                        placeholder="Digite seu CPF..."
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="imgUrl">Imagem URL</label>
                    <input 
                        type="text" 
                        id="imgUrl" 
                        placeholder="Digite a URL da imagem..."
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}    
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="active">Ativo</label>
                    <select 
                        id="active" 
                        value={active} 
                        onChange={(e) => setActive(e.target.value === 'true')}
                    >
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="senha">Senha</label>
                    <input 
                        type="password" 
                        id="senha" 
                        placeholder="Digite sua senha..."
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="confirmar-senha">Confirmar senha</label>
                    <input 
                        type="password" 
                        id="confirmar-senha" 
                        placeholder="Confirme sua senha..."
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                </div> 

                <div className={styles.formActions}>
                    <button type="submit" className={styles.btnPrimary}>Adicionar produtor</button>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleCancel}>
                        Cancelar cadastro
                    </button>
                </div>
            </form>
        </main>
    );
}

export default CreateProdutor;