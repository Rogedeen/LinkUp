import { useState } from 'react';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { username, password } = formData;
            const response = await api.post('/auth/login', { username, password });

            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('userId', response.data.id); 

            navigate('/dashboard');
        } catch (err) {
            console.error("Giriş hatası:", err);
            alert("Giriş başarısız! Bilgilerini kontrol et.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-900 to-black p-4">
            <Card className="max-w-md w-full shadow-2xl border-none">
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">LinkUp</h1>
                    <p className="text-gray-500 text-sm">Giriş Yapın</p>
                </div>
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    <div>
                        <Label htmlFor="username" value="Kullanıcı Adı" />
                        <TextInput id="username" type="text" icon={HiMail} placeholder="Kullanıcı adınız" required
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                    </div>
                    <div>
                        <Label htmlFor="password" value="Şifre" />
                        <TextInput id="password" type="password" icon={HiLockClosed} required
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    <Button type="submit" className="bg-primary-700 hover:bg-primary-800">Giriş Yap</Button>
                    <div className="text-sm font-medium text-gray-500">
                        Hesabınız yok mu? <Link to="/register" className="text-primary-700 hover:underline">Kayıt Ol</Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}