import { useEffect, useState } from 'react';
import { PlusCircle, X, ChevronDown } from 'lucide-react';
import { getAllCandidatures, getCandidatureById } from '../api/fetchApi';
import { useStore } from '../store/useStore';

const ApplicationStatus = {
    TO_SEND: 'A envoyer',
    PENDING: 'En attente',
    FOLLOW_UP: 'A suivre',
    ACCEPTED: 'Acceptée',
    REJECTED: 'Rejetée'
};

export default function Dashboard() {
    const { saveCandidature } = useStore();
    const [candidatures, setCandidatures] = useState([]);
    const [candidature, setCandidature] = useState({
        id: '',
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        status: '',
        date: '',
        note: '',
    });

    const [filter, setFilter] = useState({ status: 'Toutes', date: '' });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // const [selectedApplication, setSelectedApplication] = useState(null);

    const handleSave = () => {
        console.log('Save candidature', candidature);
        saveCandidature(candidature);
    };

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

    useEffect(() => {
        const fetchCandidatureById = async () => {
            try {
                const data = await getCandidatureById(candidature.id);
                setCandidature(data)
            } catch (error) {
                console.error('Failed to fetch candidature', error);
            }
        }
        fetchCandidatureById();
    }, [candidature.id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave();
        setIsAddModalOpen(false);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCandidature(prev => ({ ...prev, [name]: value }));
    };

    // const filteredApplications = candidatures.filter(app =>
    //     (filter.status === 'Toutes' || app.status === filter.status) &&
    //     (!filter.date || app.date >= filter.date)
    // );

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

                {/* Statistiques */}
                <div className="col-span-full">
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

                {/* Filtre et Liste des candidatures */}
                <div className="col-span-full">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Vos Candidatures</h2>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
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
                            <input
                                type="date"
                                name="date"
                                value={filter.date}
                                onChange={handleFilterChange}
                                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="space-y-4">
                            {candidatures.reverse().map(app => (
                                <div
                                    key={app.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow cursor-pointer hover:bg-gray-100"
                                    onClick={() => setIsAddModalOpen(true)}
                                >
                                    <h3 className="font-semibold">{app.entreprise}</h3>
                                    <p className="text-sm text-gray-600">{app.poste}</p>
                                    <p className="text-sm text-gray-600">{app.email}</p>
                                    <p className="text-sm text-gray-600">{app.telephone}</p>
                                    <p className="text-sm text-gray-600">{app.status}</p>
                                    <p className="text-sm text-gray-600">{app.createdAt}</p>
                                </div>
                            ))}
                            
                            {/* {filteredApplications.map(app => (
                                    <div>
                                        <h3 className="font-semibold">{app.company}</h3>
                                        <p className="text-sm text-gray-600">{app.position}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${app.status === ApplicationStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                            app.status === ApplicationStatus.FOLLOW_UP ? 'bg-blue-100 text-blue-800' :
                                                app.status === ApplicationStatus.ACCEPTED ? 'bg-green-100 text-green-800' :
                                                    app.status === ApplicationStatus.REJECTED ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                            {app.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">{app.date}</p>
                                    </div>
                                </div>
                            ))} */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Ajouter Candidature */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Ajouter une Nouvelle Candidature</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {['entreprise', 'poste', 'email', 'telephone', 'date'].map((item) => (
                                <div key={item}>
                                    <label htmlFor={item} className="block text-sm font-medium text-gray-700">
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </label>
                                    <input
                                        type={item === 'email' ? 'email' : item === 'date' ? 'date' : 'text'}
                                        id={item.id}
                                        name={item.entreprise}
                                        value={candidature[item]}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            ))}
                            <label className="block text-sm font-medium text-gray-700" htmlFor="status">Status</label>
                            <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 appearance-none" name="Status" id="Status">
                                {Object.values(ApplicationStatus).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <label className="block text-sm font-medium text-gray-700" htmlFor="Note">Note</label>
                            <textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" name="note" id="note" />
                            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                Sauvegarder
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
