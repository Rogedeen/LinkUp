import { useState, useEffect, useCallback } from 'react';
import { Button, TextInput, Select, Card, Modal } from 'flowbite-react';
import {
    HiUserAdd, /*HiTrash,*/ HiCalendar, HiTag, HiCheckCircle, HiChevronRight, HiXCircle
} from 'react-icons/hi'; 
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
    const [speakers, setSpeakers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);

    const [newSpeaker, setNewSpeaker] = useState({ fullName: '', expertise: '', bio: '' });
    const [newCategory, setNewCategory] = useState({ name: '' });
    const [newEvent, setNewEvent] = useState({ title: '', speakerId: '', categoryId: '' });

    const [showEditModal, setShowEditModal] = useState(false);
    const [editTarget, setEditTarget] = useState({ type: '', data: {} });

    const userRole = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const [sRes, cRes, eRes] = await Promise.all([
                api.get('/speakers'),
                api.get('/categories'),
                api.get('/events')
            ]);
            setSpeakers(sRes.data || []);
            setCategories(cRes.data || []);
            setEvents(eRes.data || []);

            const currentUserId = localStorage.getItem('userId');

            if (currentUserId) {
                const myRes = await api.get(`/events/my/${currentUserId}`);
                console.log("FETCH EDİLEN KAYITLARIM:", myRes.data);
                setMyEvents(myRes.data || []);
            }
        } catch (err) {
            console.error("Veri çekme hatası:", err);
        }
    }, []); 

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAdd = async (path, state, resetFn) => {
        if (path === 'categories' && !state.name.trim()) return alert("Kategori ismi boş olamaz!");
        if (path === 'speakers' && (!state.fullName.trim() || !state.expertise.trim())) return alert("Konuşmacı bilgileri eksik!");
        if (path === 'events' && (!state.title.trim() || !state.speakerId || !state.categoryId)) return alert("Etkinlik bilgileri eksik!");

        try {
            await api.post(`/${path}`, state);
            resetFn(); fetchData();
            alert("Başarıyla eklendi! ✅");
        } catch (err) { alert("Ekleme sırasında bir hata oluştu!"); }
    };

    const handleJoin = async (eventId) => {
        try {
            const currentUserId = localStorage.getItem('userId');
            await api.post(`/events/${eventId}/join`, { userId: parseInt(currentUserId) });
            await fetchData();
        } catch (err) {
            console.warn("409 Yakalandı - Veri senkronize ediliyor...");
            await fetchData();
        }
    };

    const handleLeave = async (eventId) => {
        if (window.confirm("Kaydınızı silmek istediğinize emin misiniz?")) {
            try {
                const currentUserId = localStorage.getItem('userId');
                await api.post(`/events/${eventId}/leave`, { userId: parseInt(currentUserId) });

                await fetchData();
                alert("Kaydınız iptal edildi. ❌");
            } catch (err) {
                alert("İşlem başarısız.");
            }
        }
    };

    const handleDelete = async (path, id) => {
        if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
            try { await api.delete(`/${path}/${id}`); fetchData(); } catch (err) { alert("Silme hatası!"); }
        }
    };

    const openEdit = (type, item) => {
        setEditTarget({
            type,
            data: { ...item, speakerId: item.speaker?.id, categoryId: item.category?.id }
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            const { type, data } = editTarget;
            const payload = { ...data };

            if (type === 'events') {
                payload.speaker = { id: parseInt(data.speakerId) };
                payload.category = { id: parseInt(data.categoryId) };
            }

            await api.patch(`/${type}/${data.id}`, payload);
            setShowEditModal(false);
            fetchData();
            alert("Güncellendi! ✅");
        } catch (err) {
            console.error("Güncelleme hatası:", err.response?.data);
            alert("Güncelleme sırasında hata oluştu!");
        }
    };

    return (
        <div className={`min-h-screen pb-20 font-sans transition-colors duration-500 ${userRole === 'admin' ? 'bg-slate-200' : 'bg-sky-100'}`}>
            <nav className="bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-2 font-black text-indigo-700 tracking-tighter"><HiCalendar size={28} /> LinkUp </div>
                <div className="flex items-center gap-4">
                    <p className="text-sm font-bold text-slate-600">{username} ({userRole})</p>
                    <Button size="xs" color="failure" onClick={() => { localStorage.clear(); navigate('/login'); }} pill className="font-bold">Çıkış</Button>
                </div>
            </nav>

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
                {userRole === 'admin' ? (
                    <>
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                            <h2 className="text-xl font-black mb-6 text-slate-800 uppercase tracking-widest">Veri Giriş Paneli</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <h5 className="font-bold flex items-center gap-2 text-indigo-600"><HiTag /> Kategori</h5>
                                    <TextInput placeholder="İsim..." value={newCategory.name} onChange={e => setNewCategory({ name: e.target.value })} />
                                    <Button color="indigo" className="w-full rounded-xl font-black" onClick={() => handleAdd('categories', newCategory, () => setNewCategory({ name: '' }))}>EKLE</Button>
                                </div>
                                <div className="space-y-3">
                                    <h5 className="font-bold flex items-center gap-2 text-blue-600"><HiUserAdd /> Konuşmacı</h5>
                                    <TextInput placeholder="Ad Soyad" value={newSpeaker.fullName} onChange={e => setNewSpeaker({ ...newSpeaker, fullName: e.target.value })} />
                                    <TextInput placeholder="Uzmanlık" value={newSpeaker.expertise} onChange={e => setNewSpeaker({ ...newSpeaker, expertise: e.target.value })} />
                                    <Button color="indigo" className="w-full rounded-xl font-black" onClick={() => handleAdd('speakers', newSpeaker, () => setNewSpeaker({ fullName: '', expertise: '' }))}>KAYDET</Button>
                                </div>
                                <div className="space-y-3 bg-indigo-50 p-4 rounded-3xl">
                                    <h5 className="font-bold flex items-center gap-2 text-indigo-700"><HiCalendar /> Yeni Etkinlik</h5>
                                    <TextInput placeholder="Başlık" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Select value={newEvent.speakerId} onChange={e => setNewEvent({ ...newEvent, speakerId: e.target.value })}>
                                            <option value="">Konuşmacı</option>
                                            {speakers.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                                        </Select>
                                        <Select value={newEvent.categoryId} onChange={e => setNewEvent({ ...newEvent, categoryId: e.target.value })}>
                                            <option value="">Tür</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </Select>
                                    </div>
                                    <Button color="indigo" className="w-full rounded-xl font-black" onClick={() => handleAdd('events', newEvent, () => setNewEvent({ title: '', speakerId: '', categoryId: '' }))}>YAYINLA</Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b bg-slate-50"><h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Kategori Listesi</h4></div>
                                <table className="w-full text-left text-sm">
                                    <tbody className="divide-y divide-slate-100">
                                        {categories.map(c => (
                                            <tr key={c.id} className="hover:bg-slate-50">
                                                <td className="p-6 font-bold text-slate-700">{c.name}</td>
                                                <td className="p-6 text-right">
                                                    <button onClick={() => openEdit('categories', c)} className="text-blue-600 mr-4 font-bold">Düzenle</button>
                                                    <button onClick={() => handleDelete('categories', c.id)} className="text-red-600 font-bold">Sil</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b bg-slate-50"><h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Konuşmacı Listesi</h4></div>
                                <table className="w-full text-left text-sm">
                                    <tbody className="divide-y divide-slate-100">
                                        {speakers.map(s => (
                                            <tr key={s.id} className="hover:bg-slate-50">
                                                <td className="p-6 font-bold text-slate-700">{s.fullName}<p className="text-[10px] text-indigo-500 font-black uppercase">{s.expertise}</p></td>
                                                <td className="p-6 text-right">
                                                    <button onClick={() => openEdit('speakers', s)} className="text-blue-600 mr-4 font-bold">Düzenle</button>
                                                    <button onClick={() => handleDelete('speakers', s.id)} className="text-red-600 font-bold">Sil</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                                <h4 className="font-black text-slate-800 uppercase tracking-tighter">Aktif Etkinlik Takvimi</h4>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white text-slate-400 font-bold uppercase text-[10px]">
                                    <tr><th className="p-6">Etkinlik</th><th className="p-6">Konuşmacı</th><th className="p-6">Tür</th><th className="p-6 text-right">İşlem</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {events.map(ev => (
                                        <tr key={ev.id} className="hover:bg-slate-50">
                                            <td className="p-6 font-black text-slate-800">{ev.title}</td>
                                            <td className="p-6 font-bold text-indigo-600">{ev.speaker?.fullName || 'Atanmadı'}</td>
                                            <td className="p-6 font-medium text-slate-400">{ev.category?.name || 'Genel'}</td>
                                            <td className="p-6 text-right">
                                                <button onClick={() => openEdit('events', ev)} className="text-blue-600 font-bold mr-4">Düzenle</button>
                                                <button onClick={() => handleDelete('events', ev.id)} className="text-red-600 font-bold">Sil</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="space-y-12">
                        <div className="bg-indigo-700 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                            <h1 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">Hoş Geldin, {username}!</h1>
                            <p className="opacity-80 text-lg font-medium">Geleceği şekillendiren konuşmacılar seni bekliyor.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {events.map(ev => {
                                    const isJoined = myEvents.some(me => {
                                        const joinedId = me?.id || me?.event?.id;

                                        return Number(joinedId) === Number(ev.id);
                                    });

                                    if (myEvents.length > 0) console.log("Eşleşen ID'ler:", myEvents.map(m => m.id || m.event?.id), "Aranan ID:", ev.id);

                                    return (
                                        <Card key={ev.id} className="flex flex-col border-none bg-white rounded-[2.5rem] shadow-xl p-2 h-full transition-transform hover:scale-105">
                                            <div className="flex flex-col h-full">
                                                <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase w-fit mb-4">{ev.category?.name}</span>
                                                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4">{ev.title}</h3>

                                                <div className="border-t border-slate-50 pt-4 mt-2 mb-6">
                                                    <p className="text-sm font-bold text-slate-700 mb-1">{ev.speaker?.fullName}</p>
                                                    {}
                                                    <p className="text-xs text-slate-400 italic line-clamp-2 uppercase font-black tracking-widest">
                                                        {ev.speaker?.expertise || 'Uzmanlık Belirtilmemiş'}
                                                    </p>
                                                </div>

                                                <div className="mt-auto space-y-2">
                                                    {isJoined ? (
                                                        <div className="flex flex-col gap-2">
                                                            {}
                                                            <div className="w-full bg-green-50 text-green-600 text-center py-3 rounded-2xl font-black text-xs border border-green-100 flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider">
                                                                <HiCheckCircle size={18} /> KATILDINIZ
                                                            </div>

                                                            {}
                                                            <button
                                                                onClick={() => handleLeave(ev.id)}
                                                                className="w-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white py-3 rounded-2xl font-black text-xs border border-rose-100 shadow-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <HiXCircle size={18} /> KAYDI İPTAL ET
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleJoin(ev.id)}
                                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl shadow-lg transition-all text-xs uppercase tracking-wider"
                                                        >
                                                            ETKİNLİĞE KATIL <HiChevronRight className="inline ml-1" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                        </div>
                    </div>
                )}
            </div>

            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="p-8 border-b bg-slate-50 rounded-t-lg"><h3 className="text-xl font-black uppercase text-slate-900 tracking-tighter">Bilgileri Güncelle</h3></div>
                <div className="p-8 space-y-6">
                    {editTarget.type === 'events' && (
                        <div className="space-y-4">
                            <TextInput value={editTarget.data.title || ''} onChange={e => setEditTarget({ ...editTarget, data: { ...editTarget.data, title: e.target.value } })} />
                            <div className="grid grid-cols-2 gap-4">
                                <Select value={editTarget.data.speakerId} onChange={e => setEditTarget({ ...editTarget, data: { ...editTarget.data, speakerId: e.target.value } })}>{speakers.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}</Select>
                                <Select value={editTarget.data.categoryId} onChange={e => setEditTarget({ ...editTarget, data: { ...editTarget.data, categoryId: e.target.value } })}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
                            </div>
                        </div>
                    )}
                    {editTarget.type === 'speakers' && (
                        <div className="space-y-4">
                            <TextInput placeholder="Ad Soyad" value={editTarget.data.fullName || ''} onChange={e => setEditTarget({ ...editTarget, data: { ...editTarget.data, fullName: e.target.value } })} />
                            <TextInput placeholder="Uzmanlık" value={editTarget.data.expertise || ''} onChange={e => setEditTarget({ ...editTarget, data: { ...editTarget.data, expertise: e.target.value } })} />
                        </div>
                    )}
                    {editTarget.type === 'categories' && (
                        <TextInput placeholder="Kategori Adı" value={editTarget.data.name || ''} onChange={e => setEditTarget({ ...editTarget, data: { ...editTarget.data, name: e.target.value } })} />
                    )}
                </div>
                <div className="p-8 border-t flex gap-4 rounded-b-lg">
                    <button className="w-full bg-indigo-600 text-white font-black py-2.5 rounded-xl shadow-lg" onClick={handleUpdate}>KAYDET</button>
                    <button className="w-full bg-slate-200 text-slate-600 font-black py-2.5 rounded-xl" onClick={() => setShowEditModal(false)}>İPTAL</button>
                </div>
            </Modal>
        </div>
    );
}