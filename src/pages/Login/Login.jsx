import styles from "./Login.module.css"
import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import LogoImage from "../../assets/images/img_logo_login.svg"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import CompanyService from "../../services/companySerice"

function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim() || !password.trim()) {
            alert("Por favor, preencha o email e a senha.");
            return;
        }

        setIsSubmitting(true);

        try {            
            const credential = await signInWithEmailAndPassword(auth, email, password);
            // localStorage.setItem("authToken", token);

            const company = await CompanyService.login(email); 

            if (company && company.id) {
                localStorage.setItem("companyId", company.id);
                localStorage.setItem("planId", company.plan_id);
                
                
                console.log("Login de empresa bem-sucedido! ID:", company.id);
            } else {
                console.error("Login falhou ou o objeto da empresa não contém um ID.");
            }

            navigate('/home');
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Falha no login. Verifique suas credenciais.");
        } finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <div className={styles.LoginPage}>
            <div className={styles.LoginContainer}>
                
                <div className={styles.LogoArea}>
                    <img src={LogoImage} alt="Zeta Logo" className={styles.LogoImage} />
                    <h1 className={styles.LogoText}>ZETA</h1>
                </div>

                <form onSubmit={handleSubmit} className={styles.FormArea}> 
                    
                    <label className={styles.Label} htmlFor="email">Email</label>
                    <input 
                        id="email"
                        type="email"
                        placeholder="Digite o seu email..."
                        className={styles.TextInput}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        required
                    />

                    <label className={styles.Label} htmlFor="password">Senha</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Digite a sua senha..."
                        className={styles.TextInput}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        required
                    />

                    <button 
                        type="submit"
                        className={styles.LoginButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logando...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login