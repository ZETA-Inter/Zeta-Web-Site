import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import workerService from '../../services/workerService';
import styles from './CreateProdutor.module.css';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { collection, query, where, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";

function CreateProdutor() {

  const { workerId } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(workerId);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    if (isEditing) {
      async function fetchWorkerData() {
        try {
          const worker = await workerService.getWorkerById(workerId);

          console.log("Worker Data: " + worker)

          const q = query(
            collection(db, "Produtor"),
            where("Email", "==", worker.email)
          );

          const querySnapshot = await getDocs(q);

          let cpfFirebase = '';
          let telefoneFirebase = '';

          if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data();
            cpfFirebase = docData.CPF || docData.cpf || '';
            telefoneFirebase = docData.Telefone || docData.telefone || '';
          } else {
            console.warn("Nenhum documento encontrado no Firestore para este e-mail.");
          }

          setNome(worker.name || '');
          setEmail(worker.email || '');
          setCpf(cpfFirebase);
          setTelefone(telefoneFirebase);

        } catch (err) {
          console.error("Erro ao carregar dados do produtor:", err);
        }
      }
      fetchWorkerData();
    }
  }, [isEditing, workerId]);

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

      const workerPayload = {
        email,
        name: nome,
        company_id: Number(companyId),
        active: true
      };

      console.log("Worker Payload: " + JSON.stringify(workerPayload))

      if (!isEditing) {
        const createdWorker = await workerService.createWorker(workerPayload);

        if (!createdWorker) {
          alert("Erro ao criar produtor. Verifique se o email já está cadastrado.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        await setDoc(doc(db, "Produtor", user.uid), {
          CPF: cpf,
          Email: email,
          Nome: nome,
          Telefone: telefone,
          createdAt: new Date(),
        });

        alert(`Produtor ${nome} criado com sucesso!`);
        navigate(`/produtores`);
      }

      else {
        const updatedWorker = await workerService.updateWorker(workerId, workerPayload);

        const q = query(collection(db, "Produtor"), where("Email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          await updateDoc(userDoc.ref, {
            Nome: nome,
            Telefone: telefone,
            CPF: cpf,
            Email: email,
            updatedAt: new Date(),
          });
        } else {
          await setDoc(doc(collection(db, "Produtor")), {
            Nome: nome,
            Telefone: telefone,
            CPF: cpf,
            Email: email,
            createdAt: new Date(),
          });
        }

        alert(`Produtor ${workerPayload.name} atualizado com sucesso!`);
        navigate(`/produtor`);
      }

      const updatedList = await workerService.listWorkersByCompany(companyId);
      localStorage.setItem("workers", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("storageUpdate"));

    } catch (error) {
      console.error("Erro ao criar/atualizar produtor:", error);
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
