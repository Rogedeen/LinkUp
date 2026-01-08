import { useState } from 'react';
import { Button, TextInput, Label, Card, Select } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';
import api from '../api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!username || !email || !password) {
            return alert("Lütfen tüm alanları doldurun!");
        }

        if (!email.includes('@')) {
            return alert("Geçerli bir e-posta adresi girin!");
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return alert("Şifreniz yeterince güçlü değil!");
        }

        try {
            await api.post('/auth/register', { username, email, password, role });
            alert("Kayıt başarılı! Giriş yapabilirsiniz. 🎉");
            navigate('/login');
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Kayıt sırasında bir hata oluştu.";
            alert("Hata: " + errorMsg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-950 p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-900 rounded-full blur-3xl opacity-20"></div>

            <Card className="max-w-md w-full rounded-[2.5rem] shadow-2xl border-none bg-white/95 backdrop-blur-sm relative z-10">
                <div className="p-2">
                    <h2 className="text-3xl font-black text-center text-indigo-900 tracking-tighter uppercase mb-2">Kayıt Ol</h2>
                    <p className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Yeni bir hesap oluşturun</p>

                    <div className="space-y-5">
                        <div>
                            <Label value="Kullanıcı Adı" className="mb-2 block font-black text-indigo-900 text-[10px] uppercase tracking-widest" />
                            <TextInput
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Kullanıcı adınız"
                                sizing="md"
                            />
                        </div>

                        <div>
                            <Label value="E-posta Adresi" className="mb-2 block font-black text-indigo-900 text-[10px] uppercase tracking-widest" />
                            <TextInput
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ornek@mail.com"
                                sizing="md"
                            />
                        </div>

                        <div>
                            <Label value="Hesap Türü" className="mb-2 block font-black text-indigo-900 text-[10px] uppercase tracking-widest" />
                            <Select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="user">Katılımcı</option>
                                <option value="admin">Yönetici</option>
                            </Select>
                        </div>

                        <div>
                            <Label value="Güçlü Şifre" className="mb-2 block font-black text-indigo-900 text-[10px] uppercase tracking-widest" />
                            <TextInput
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                sizing="md"
                            />
                        </div>

                        <Button color="indigo" onClick={handleRegister} className="w-full font-black py-1 rounded-2xl">
                            HESAP OLUŞTUR
                        </Button>

                        <p className="text-center text-[10px] font-bold text-slate-400">
                            Zaten üye misiniz? <button onClick={() => navigate('/login')} className="text-indigo-600 hover:underline">Giriş Yapın</button>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}