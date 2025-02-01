import { API_URL } from "../constant/constants.js";

const fetchArchiveNotes = async (setArchiveNote) => {
    try {
        const response = await fetch(`${API_URL}/archivenote`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }

        const data = await response.json();
        console.log('Fetched data: ', data.data[0].allNotes);
        setArchiveNote(data.data[0].allNotes);
    } catch (error) {
        console.error('Error fetching notes:', error.message);
    }
};

export default fetchArchiveNotes