const API_URL = 'http://localhost:3000/api';

export const getAllCandidatures = async () => {
    const response = await fetch(`${API_URL}/candidatures`);
    return response.json();
}

export const getCandidatureById = async (id) => {
    const response = await fetch(`${API_URL}/candidatures/${id}`);
    return response.json();
}

export const createCandidature = async (candidature) => {
    const response = await fetch(`${API_URL}/candidatures`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidature),
    });
    return response.json();
}

export const updateCandidature = async (candidature) => {
    const response = await fetch(`${API_URL}/candidatures/${candidature.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidature),
    });
    return response.json();
}

export const deleteCandidature = async (id) => {
    const response = await fetch(`${API_URL}/candidatures/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}