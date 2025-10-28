import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import workerService from '../../services/workerService';
import styles from './CreateProdutor.module.css'; // O arquivo CSS Module

const getInitialData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultValue;
};

function CreateProdutor() {
    const { companyId } = useParams();
    const navigate = useNavigate(); 

    const [nome, setNome] = useState(getInitialData('produtor_nome', ''));
    const [email, setEmail] = useState(getInitialData('produtor_email', ''));
    const [cpf, setCpf] = useState(getInitialData('produtor_cpf', ''));
    const [imgUrl, setImgUrl] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }
        try {
            const newWorker = {
                name: nome,
                email: email,
                cpf: cpf,
                password: senha,
                active: true
            };
            const createdWorker = await workerService.createWorker(newWorker);
            alert(`Produtor ${createdWorker.name} criado com sucesso!`);
            

            localStorage.removeItem('produtor_nome');
            localStorage.removeItem('produtor_email');
            localStorage.removeItem('produtor_cpf');

            navigate(`/company/${companyId}/produtores`);

        } catch (error) {
            console.error("Erro ao criar produtor: ", error);
            alert("Erro ao criar produtor. Por favor, tente novamente.");
        }
    };

    const handleCancel = () => {
        setNome('');
        setEmail('');
        setCpf('');
        setSenha('');
        setConfirmarSenha('');
        navigate(-1); 
    };

    return (
        <main className={styles.mainContent}>
            <header>
                <h1>Produtores - inserir novo usuário</h1>
                <p>Bem vindo a tela de criação de produtor! Informe seus dados e crie a conta do seu filiado. O seu segmento só será definido quando for vinculado a um curso a ele. Atenção: poderá ser redefinida quando o produtor acessar a conta.</p>
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