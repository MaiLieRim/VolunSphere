import { useRouter } from 'vue-router';
import { ref } from 'vue';

export function useAuth() {
    const router = useRouter();
    const loginForm = ref(null);
    const username = ref('');
    const password = ref(''); // NEU: Passwort State
    const loginError = ref(false); // NEU: Genereller Fehler-State

    const login = async () => {
        const formElement = loginForm.value;

        // Fehler-Status vor jedem Versuch zurücksetzen
        loginError.value = false;

        // 1. Lokale HTML5-Validierung (Prüft nur, ob die Felder leer sind)
        if (formElement) {
            if (!formElement.checkValidity()) {
                formElement.classList.add('was-validated');
                return; // Abbruch, da Felder leer sind
            }
        }

        // Onboarding / Prototyp Fallback
        if (!username.value) {
            username.value = 'Liselotte Pulver';
        }

        // Dummy-Datenbank für den Prototyp
        // Hier könntest du auch ein Dummy-Passwort ergänzen, z.B. { role: 'admin', password: '123' }
        const users = {
            'herbert mayer': 'admin',
            'liselotte pulver': 'volunteer'
        };

        const normalizedUsername = username.value.toLowerCase().trim();
        const role = users[normalizedUsername];

        // 2. SICHERHEITS-CHECK (Backend-Simulation)
        // Hier prüfen wir, ob der User existiert (und idealerweise ob das Passwort stimmt)
        // Da du im Prototyp noch keine echten Passwörter hast, prüfen wir hier nur die Rolle.
        // Falls du Passwörter testen willst, ändere es zu: if (!role || password.value !== '123')
        if (!role) {
            // Generischen Fehler werfen
            loginError.value = true;
            
            // Absichtliche Verzögerung (Timing Attack Prevention)
            await new Promise(resolve => setTimeout(resolve, 500));
            return; // Login abbrechen
        }

        // 3. Login erfolgreich!
        localStorage.setItem('authToken', 'your-auth-token'); // Fake token
        localStorage.setItem('userRole', role); // Store role
        localStorage.setItem('username', normalizedUsername);

        router.push('/'); // Redirect to Home
    };

    return { 
        loginForm, 
        username, 
        password, 
        loginError, 
        login 
    };
}