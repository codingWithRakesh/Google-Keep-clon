import { API_URL } from '../constant/constants.js';

const fetchNotes = async (setValueLabel) => {
    try {
        const response = await fetch(`${API_URL}/alllabels`, {
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
        // console.log("create label ", data.data[0].allLabels)
        setValueLabel(data.data[0].allLabels);
    } catch (error) {
        // console.error('Error fetching notes:', error.message);
        throw error
    }
};

export default fetchNotes