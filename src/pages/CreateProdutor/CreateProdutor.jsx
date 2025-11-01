import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import workerService from '../../services/workerService';
import styles from './CreateProdutor.module.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

function CreateProdutor() {

    
  const { workerid } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(workerid);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [active, setActive] = useState(true);
  const [imgUrl, setImgUrl] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    if (isEditing) {
      async function fetchWorkerData() {
        try {
          const worker = await workerService.getWorkerById(workerid);
          if (worker) {
            setNome(worker.name || '');
            setEmail(worker.email || '');
            setCpf(worker.cpf || '');
            setTelefone(worker.telefone || '');
            setImgUrl(worker.image_url || '');
            setActive(worker.active ?? true);
          }
        } catch (err) {
          console.error("Erro ao carregar dados do produtor:", err);
        }
      }
      fetchWorkerData();
    }
  }, [isEditing, workerid]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing && senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const planId = localStorage.getItem('planId');
      const companyId = localStorage.getItem('companyId');

      if (!planId) {
        alert("ID do plano não encontrado. Verifique o login da empresa.");
        return;
      }

      const Worker = {
        name: nome,
        email,
        image_url: imgUrl,
        company_id: Number(companyId),
        plan_info: {
          id: Number(planId),
          frequency: "default_frequency",
          amount: 0.0
        },
        active,
        telefone,
        cpf
      };

      if (isEditing) {
        // 🔹 Atualiza no banco
        const updatedWorker = await workerService.updateWorker(workerid, Worker);

        // 🔹 Atualiza no Firebase, se existir
        try {
          const userRef = doc(db, "Produtor", workerid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            await updateDoc(userRef, {
              nome,
              email,
              cpf,
              telefone,
              image_url: imgUrl,
              active
            });
            console.log("Firebase atualizado com sucesso.");
          } else {
            console.log("Usuário não encontrado no Firebase, criando novo...");
            await setDoc(userRef, {
              nome,
              email,
              cpf,
              telefone,
              image_url: imgUrl,
              active
            });
          }
        } catch (firebaseErr) {
          console.error("Erro ao atualizar Firebase:", firebaseErr);
        }

        alert(`Produtor ${updatedWorker.name} atualizado com sucesso!`);
        navigate(`/produtores`);

      } else {
        // 🔹 Cria no banco
        const createdWorker = await workerService.createWorker(Worker);

        if (createdWorker) {
          // 🔹 Cria usuário no Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
          const user = userCredential.user;

          // 🔹 Cria documento no Firestore
          await setDoc(doc(db, "Produtor", user.uid), {
            uid: user.uid,
            nome,
            email,
            cpf,
            telefone,
            image_url: imgUrl,
            active
          });

          alert(`Produtor ${createdWorker.name} criado com sucesso!`);
          navigate(`/produtores`);
        } else {
          alert("Erro ao criar produtor. Verifique se o email ou CPF já estão cadastrados.");
        }
      }

      // 🔹 Atualiza lista local
      const updatedList = await workerService.listWorkersByCompany(companyId);
      localStorage.setItem('workers', JSON.stringify(updatedList));
      window.dispatchEvent(new Event("storageUpdate"));
    } catch (error) {
      console.error("Erro ao criar/atualizar produtor: ", error);
      alert("Erro ao salvar produtor. Por favor, tente novamente.");
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <main className={styles.mainContent}>
      <header>
        <h1>{isEditing ? "Editar produtor" : "Criar novo produtor"}</h1>
        <p>
          {isEditing
            ? "Atualize as informações do produtor abaixo."
            : "Preencha os dados para criar um novo produtor. O segmento será definido quando ele for vinculado a um curso."}
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
          <label htmlFor="active">Atividade</label>
          <select
            id="active"
            value={active}
            onChange={(e) => setActive(e.target.value === 'true')}
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>

        {!isEditing && (
          <>
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
          </>
        )}

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>
            {isEditing ? "Salvar alterações" : "Adicionar produtor"}
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={handleCancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateProdutor;
