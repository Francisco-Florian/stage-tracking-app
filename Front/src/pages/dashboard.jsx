import { useEffect, useState } from 'react';
import { PlusCircle, X, ChevronDown } from 'lucide-react';
import { getAllCandidatures, createCandidature, updateCandidature } from '../api/fetchApi';
import { useStore } from '../store/useStore';

const ApplicationStatus = {
    TO_SEND: 'A envoyer',
    PENDING: 'En attente',
    FOLLOW_UP: 'A suivre',
    ACCEPTED: 'Acceptée',
    REJECTED: 'Rejetée',
    MOST_RECENT_DATE: 'Du plus recent',
    MOST_OLDER_DATE: 'Du plus ancien',
};

const EMPTY_CANDIDATURE = {
    entreprise: '',
    poste: '',
    email: '',
    telephone: '',
    status: ApplicationStatus.TO_SEND,
    date: '',
    note: '',
};

export default function Dashboard() {
    const { saveCandidature } = useStore();
    const [candidatures, setCandidatures] = useState([]);
    const [candidature, setCandidature] = useState(EMPTY_CANDIDATURE);
    const [filter, setFilter] = useState({ status: 'Toutes', date: '' });    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const fetchAllCandidatures = async () => {
            try {
                const data = await getAllCandidatures();
                setCandidatures(data);
            } catch (error) {
                console.error('Failed to fetch candidatures', error);
            }
        };
        fetchAllCandidatures();
    }, []);

    const handleCreate = async () => {
        try {
            const data = await createCandidature(candidature);
            saveCandidature(data);
            const updatedList = await getAllCandidatures();
            setCandidatures(updatedList);
            resetForm();
        } catch (error) {
            console.error('Failed to create candidature', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const updatedData = await updateCandidature(candidature);
            const updatedList = await getAllCandidatures();
            setCandidatures(updatedList, updatedData);
            resetForm();
        } catch (error) {
            console.error('Failed to update candidature', error);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditMode) {
            await handleUpdate();
        } else {
            await handleCreate();
        }
        closeModal();
    };

    const handleCandidatureClick = (app) => {
        setCandidature(app);
        setIsEditMode(true);
        setIsAddModalOpen(true);
    };

    const handleAddNew = () => {
        setIsEditMode(false);
        setCandidature(EMPTY_CANDIDATURE);
        setIsAddModalOpen(true);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCandidature(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setCandidature(EMPTY_CANDIDATURE);
        setIsEditMode(false);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        resetForm();
    };

    const stats = {
        total: candidatures.length,
        pending: candidatures.filter(app => [ApplicationStatus.PENDING, ApplicationStatus.FOLLOW_UP, ApplicationStatus.TO_SEND].includes(app.status)).length,
        accepted: candidatures.filter(app => app.status === ApplicationStatus.ACCEPTED).length,
        rejected: candidatures.filter(app => app.status === ApplicationStatus.REJECTED).length,
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Suivi de Candidatures</h1>
                </header>

                <div className="col-span-full mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="bg-blue-100 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
                                <p className="text-sm text-blue-600">Total</p>
                            </div>
                            <div className="bg-yellow-100 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
                                <p className="text-sm text-yellow-600">En attente</p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-green-800">{stats.accepted}</p>
                                <p className="text-sm text-green-600">Acceptées</p>
                            </div>
                            <div className="bg-red-100 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
                                <p className="text-sm text-red-600">Rejetées</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-full">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Vos Candidatures</h2>
                            <button
                                onClick={handleAddNew}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Ajouter une Candidature
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <div className="relative">
                                <select
                                    name="status"
                                    value={filter.status}
                                    onChange={handleFilterChange}
                                    className="appearance-none border rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Toutes">Toutes</option>
                                    {Object.values(ApplicationStatus).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[...candidatures].reverse().map(app => (
                                <div
                                    key={app.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleCandidatureClick(app)}
                                >
                                    <h3 className="font-semibold">{app.entreprise}</h3>
                                    <p className="text-sm text-gray-600">{app.poste}</p>
                                    <p className="text-sm text-gray-600">{app.email}</p>
                                    <p className="text-sm text-gray-600">{app.telephone}</p>
                                    <p className="text-sm text-gray-600">{app.status}</p>
                                    <p className="text-sm text-gray-600">{app.updatedAt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {isEditMode ? 'Modifier la Candidature' : 'Ajouter une Nouvelle Candidature'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 p-4 overflow-y-auto">
                            {['entreprise', 'poste', 'email', 'telephone', 'date'].map((field) => (
                                <div key={field}>
                                    <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
                                    <input
                                        type={field === 'email' ? 'email' : field === 'date' ? 'date' : 'text'}
                                        id={field}
                                        name={field}
                                        value={candidature[field]}
                                        onChange={handleChange}
                                        // required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            ))}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="status">
                                    Status
                                </label>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                    name="status"
                                    id="status"
                                    value={candidature.status}
                                    onChange={handleChange}
                                >
                                    {Object.values(ApplicationStatus).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-8 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="note">
                                    Note
                                </label>
                                <textarea
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    name="note"
                                    id="note"
                                    value={candidature.note}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                {isEditMode ? 'Mettre à jour' : 'Sauvegarder'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}